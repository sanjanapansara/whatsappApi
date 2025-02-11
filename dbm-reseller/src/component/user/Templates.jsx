import { useState, useEffect } from "react";
import axiosInstance from "../../util/axiosInstance";
import {
  Select,
  Button,
  Card,
  Col,
  Switch,
  Flex,
  Row,
  Typography,
  Modal,
  message,
  Spin,
  Input,
} from "antd";
import { Badge, Space } from "antd";
import { EditOutlined, CalendarOutlined, DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { Text } = Typography;

const Templates = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedValue, setSelectedValue] = useState('hours');
  const [scheduledData, setScheduledData] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [tempId, setTempId] = useState();
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("");

  const getPlaceholder = () => {
    if (selectedValue === "hours") {
      return t("templates.hours");
    } else if (selectedValue === "days") {
      return t("days");
    }
    return "";
  };

  const handleChange = (value) => {
    setSelectedValue(value.value);
  };


  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const showModal = (template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
    setType(template.type); // Set the template type separately
    fetchTemplateDetails(template._id);
    setScheduledData([]);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
  };

  const getTemplates = () => {
    axiosInstance
      .post("reseller/templates")
      .then((response) => {
        setTemplates(response.data.templates);
      })
      .catch((error) => {
        message.error(
          error.response?.data?.message || t("failedtofetchtemplates")
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const scheduleSave = (templateType) => {
    if (!inputValue) {
      message.error(t("pleaseenteravalidtimevalue"));
      return;
    }

    message.success(t("templates.schedulesavedsuccessfully"));
    const newData = {
      templateType: templateType,
      label: selectedValue,
      inputValue: inputValue
    };
    // Update selectedTemplate with the new schedule
    const updatedTemplate = {
      ...selectedTemplate,
      schedule: [...selectedTemplate.schedule, { type: selectedValue, value: inputValue }],
    };

    setSelectedTemplate(updatedTemplate); // Update selectedTemplate state

    setInputValue(''); // Clear the input field after adding

    axiosInstance
      .post("reseller/add/schedule", {
        "template_id": tempId,
        "schedule": {
          "type": newData.label,
          "value": inputValue,
        }
      })
      .then((response) => {
        console.log("schedulesave--->", response.data);
      })
      .catch((error) => {
        console.error("Error fetching template details:", error);
        message.error(
          error.response?.data?.message || t("failedtofetchtemplatedetails")
        );
      });
  };


  const saveTemplate = () => {
    axiosInstance
      .post("/reseller/save-templates", {
        "template_id": tempId,
        "title": selectedTemplate.title,
        "content": selectedTemplate.content,
      }
      )
      .then((response) => {
        message.success(t("templates.templatesavedsuccessfully", response.data.message));
        getTemplates();
        handleOk();
      })
      .catch((error) => {
        console.error("Error saving template:", error);
        message.error(
          error.response?.data?.message || t("failedtosavetemplate")
        );
      });
  };

  const deleteDetail = (scheduledid) => {
    axiosInstance
      .post("reseller/delete/schedule", {
        schedule_id: scheduledid,
        template_id: tempId,
      })
      .then((response) => {
        message.success("schedule deleted ", response.data.message);
        const updatedSchedule = selectedTemplate.schedule.filter(
          (item) => item._id !== scheduledid
        );
        setSelectedTemplate({
          ...selectedTemplate,
          schedule: updatedSchedule,
        });
        fetchTemplateDetails(tempId);
      })
      .catch((error) => {
        console.error("Error delete template details:", error);
        message.error(
          error.response?.data?.message || t("failedtodeletetemplatedetails")
        );
      });
  };

  const fetchTemplateDetails = (templateId) => {
    setTempId(templateId)
    axiosInstance
      .get(`reseller/template/${templateId}`)
      .then((response) => {
        setSelectedTemplate(response.data.template);
      })
      .catch((error) => {
        console.error("Error fetching template details:", error);
        message.error(
          error.response?.data?.message || t("failedtofetchtemplatedetails")
        );
      });
  };

  const enableTemplate = (status, id) => {
    axiosInstance
      .post("reseller/template-status", {
        "template_id": id,
        "enable": status
      })
      .then((response) => {
        message.success(response.data.message);

        if (response.data.status) {
          setTemplates((prevTemplates) => prevTemplates.map((template) => template.id === id ? { ...template, enable: status } : template));
        }
      })
      .catch((error) => {
        console.error("Error delete template details:", error);
        message.error(
          error.response?.data?.message || t("failedtodeletetemplatedetails")
        );
      });
  }

  useEffect(() => {
    getTemplates();
  }, []);

  const labelRender = (props) => {
    const { label, value } = props;
    if (label) {
      return label; // Return the label if it exists
    }
    // Return the label corresponding to the value
    if (value === 'hours') {
      return t("hours");
    } else if (value === 'days') {
      return t("days");
    }
    // Return a default label if none matches
    return '';
  };


  return (
    <>
      <Spin spinning={loading}>
        <Space
          direction="vertical"
          size="middle"
          style={{
            width: "100%",
          }}
        ></Space>
        <Row gutter={[24, 24]}>
          {templates.map((template, index) => (
            <Col lg={12} md={24} sm={24} xs={24} key={index}>
              <Badge.Ribbon
                style={{ marginTop: "2px" }}
                text={template.type == "before_expire" ? (t("templates.beforeExpire")) : template.type == "after_expire" ? (t("templates.afterExpired")) : template.type == "active" ? (t("active")) : template.type == "share" ? (t("templates.share")) : ""}
                placement="start"
                color={template.type === "before_expire" || template.type === "after_expire" ? "#ff4d4f" : "#1890ff"}
              >
                <Card className="custom-card">
                  <Flex justify="space-between">
                    <div></div>
                    <div>
                      <Space>
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => showModal(template)}
                        >
                          {t("templates.edit")}
                        </Button>
                        <Switch
                          checked={template.enable}
                          onChange={(checked) => enableTemplate(checked, template?.id)}
                        />
                      </Space>
                    </div>
                  </Flex>
                  <h3>{template.title}</h3>
                  <br />
                  <Text>
                    <div dangerouslySetInnerHTML={{ __html: template.content }} />
                  </Text>
                </Card>
              </Badge.Ribbon>
            </Col >
          ))}
        </Row>
      </Spin>

      <Modal
        centered
        title={t("templates.editTemplates")}
        open={isModalOpen}

        onOk={saveTemplate}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            {t("cancel")}
          </Button>,
          <Button key="apply" onClick={saveTemplate} type="primary">
            {t("apply")}
          </Button>,
        ]}
      >
        <br />
        {selectedTemplate && (
          <>
            <Text >{t("templates.subject")}</Text>
            <Input
              size="middle"
              placeholder={t("feedback.subject")}
              value={selectedTemplate.title}
              onChange={(e) => {
                setSelectedTemplate({ ...selectedTemplate, title: e.target.value });
              }}
            />
            <br />
            <br />
            <Text >{t("message")}</Text>

            <ReactQuill theme="snow" value={selectedTemplate.content}
              style={{
                height: "150px"
              }}
              onChange={(content) => setSelectedTemplate({ ...selectedTemplate, content })} />
            <br />
            <br />
            {["before_expire", "after_expire"].includes(type) && (
              <>
                <Text >{t("templates.scheduled")}</Text>
                <Row align="middle" gutter={[16, 24]}>
                  <Col xs={16} sm={12} md={12}>
                    <Flex gap="small" align="flex-start" vertical>
                      <Flex gap="small" wrap="wrap">
                        <Select
                          labelInValue
                          labelRender={labelRender}
                          value={selectedValue}
                          onChange={handleChange}
                          options={[
                            {
                              value: "days",
                              label: t("days"), // Translate label
                            },
                            {
                              value: "hours",
                              label: t("templates.hours"), // Translate label
                            },
                          ]}
                        />
                        <Input
                          style={{ width: "100px" }}
                          value={inputValue}
                          onChange={handleInputChange}
                          placeholder={getPlaceholder()}
                        />
                      </Flex>
                    </Flex>
                  </Col>
                  <Col xs={8} sm={12} md={12} >
                    <Flex justify="flex-end" style={{ width: "100%" }} wrap="wrap">
                      <Button type="primary" onClick={() => scheduleSave(type)}>{t("templates.add")}</Button>
                    </Flex>
                  </Col>
                </Row>
                <br />
              </>
            )}
            {selectedTemplate.schedule.map((data, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <Card key={index} styles={{ body: { padding: '9px' } }}>
                  <Flex justify="space-between">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarOutlined style={{ marginRight: '8px' }} />
                      <Space>
                        <Text>{type}</Text>
                        <Text>{data.value}</Text>
                        <Text>{data.type}</Text>
                      </Space>
                    </div>
                    <DeleteOutlined
                      style={{ color: 'red', cursor: 'pointer' }}
                      onClick={() => {
                        deleteDetail(data._id);
                      }}
                    />
                  </Flex>
                </Card>
              </div>
            ))}
          </>
        )}
      </Modal>
    </>
  );
};

export default Templates;

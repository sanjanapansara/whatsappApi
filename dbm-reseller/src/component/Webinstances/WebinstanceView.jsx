import React, { useState } from "react";
import {
  Tabs,
  Form,
  Input,
  Row,
  Col,
  Switch,
  Button,
  Space,
  Typography,
  message,
  Dropdown,
  Menu,
  Modal,
  InputNumber,
  Card,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  CommentOutlined,
  CopyOutlined,
  DeleteOutlined,
  DoubleRightOutlined,
  DownloadOutlined,
  EnvironmentOutlined,
  FastBackwardOutlined,
  FastForwardOutlined,
  FolderOutlined,
  FormOutlined,
  LinkOutlined,
  MoreOutlined,
  ReloadOutlined,
  SettingOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const WebinstanceView = () => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("1");
  const [checked, setChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen4, setIsModalOpen4] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [token, setToken] = useState("33D89F82B367666B5B2E26C4");
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const showModal2 = () => {
    setIsModalOpen2(true);
  };

  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };

  const handleOk2 = () => {
    setIsModalOpen2(false);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const showModal3 = () => {
    setIsModalOpen3(true);
  };

  const handleCancel3 = () => {
    setIsModalOpen3(false);
  };

  const handleOk3 = () => {
    setIsModalOpen3(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showModal4 = () => {
    setIsModalOpen4(true);
  };

  const handleCancel4 = () => {
    setIsModalOpen4(false);
  };

  const handleOk4 = () => {
    form
      .validateFields()
      .then((values) => {
        console.log(values);
        setIsModalOpen4(false);
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  };

  const handleSwitchChange = (checked) => {
    setChecked(checked);
  };

  const generateNewToken = () => {
    const newToken = Math.random().toString(36).substring(2, 15).toUpperCase();
    setToken(newToken);
  };

  const handleNext = async () => {
    try {
      await form.validateFields(["instanceName"]);
      message.success("All fields are valid! Proceeding...");
      setActiveKey("2");
    } catch (error) {
      message.error("Please fill all required fields!");
    }
  };

  const handleSave = async () => {
    try {
      await form.validateFields(); 
      message.success("Web instance data saved successfully!");
      navigate("/webInstances");
    } catch (error) {
      message.error("Please fill all required fields before saving.");
    }
  };
  
  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <Text onClick={() => navigate("/webpaymentlist")}>
              <Space>
                <FolderOutlined style={{ fontSize: "18px" }} />
                Payment
              </Space>
            </Text>
          ),
        },
        {
          key: "2",
          label: (
            <Text disabled>
              <Space>
                <ReloadOutlined disabled style={{ fontSize: "18px" }} />
                Restart
              </Space>
            </Text>
          ),
        },
        {
          key: "3",
          label: (
            <Text
              onClick={(e) => {
                e.stopPropagation();
                showModal2();
              }}
            >
              <Space>
                <DeleteOutlined style={{ fontSize: "18px" }} />
                Delete
              </Space>
            </Text>
          ),
        },
        {
          key: "4",
          label: (
            <Text
              onClick={(e) => {
                e.stopPropagation();
                showModal3();
              }}
            >
              <Space>
                <TransactionOutlined style={{ fontSize: "18px" }} />
                Migrate instance
              </Space>
            </Text>
          ),
        },
      ]}
    />
  );

  return (
    <>
      <Form layout="vertical" form={form}>
        <Card>
          <Row gutter={[16, 16]}>
            <Title level={4} >
              Web instance data
            </Title>
          </Row>
          <Row gutter={[16, 16]} align="bottom">
            <Col md={8}>
              <Form.Item
                label={<Text>Instance name</Text>}
                name="instanceName"
                rules={[
                  { required: true, message: "Instance name is required!" },
                ]}
              >
                <Input style={{textAlign:"justify"}} placeholder="Instance name" prefix={<CopyOutlined />} />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item
                label={
                  <Text>
                    Instance ID <CopyOutlined />
                  </Text>
                }
              >
                <Input
                  placeholder="Instance ID"
                  prefix={<CopyOutlined />}
                  disabled
                />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item
                label={
                  <Text style={{ color: "rgba(107, 114, 128, 1)" }}>
                    Integration token <CopyOutlined />
                    <Button type="link" onClick={generateNewToken}>
                      Generate new token
                    </Button>
                  </Text>
                }
              >
                <Input
                  placeholder={token}
                  value={token}
                  readOnly
                  prefix={<LinkOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>

      <br />

      <Form layout="vertical" Form={form}>
        <Card>
          <Row>
            <Title level={4}>Configure webhooks</Title>
          </Row>
          <Row>
            <Text>
              If you like, you can configure the webhooks for your instance.
              This would allow you to listen to its events.
            </Text>
          </Row>
          <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
            <Col md={12}>
              <Form.Item label="On send" name="onsend">
                <Input placeholder="On send" prefix={<FastForwardOutlined />} />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item label="Chat presence" name="chatpresence">
                <Input
                  placeholder="Chat presence"
                  prefix={<EnvironmentOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col md={12}>
              <Form.Item label="On disconnecting" name="ondisconnecting">
                <Input
                  placeholder="On disconnecting"
                  prefix={<DownloadOutlined />}
                />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item label="Receive message status" name="receivemessage">
                <Input
                  placeholder="Receive message status"
                  prefix={<CommentOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col md={12}>
              <Form.Item label="On receiving" name="onreceiving">
                <Input
                  placeholder="On receiving"
                  prefix={<FastBackwardOutlined />}
                />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item label="On connecting" name="onconnecting">
                <Input placeholder="On connecting" prefix={<CheckOutlined />} />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Space>
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                defaultChecked
              />
              <Col>
                <Text strong>Notify all messages sent by me</Text>
              </Col>
            </Space>
          </Row>
        </Card>
        <br />
        <Card>
          {/* </Row> */}
          <Row justify="start" align="middle">
            <Title level={4}>WhatsApp configurations</Title>
          </Row>
          <Row gutter={[16, 16]} justify="start" align="middle">
            <br />
            <Col md={6}>
              <Form.Item>
                <Switch
                  checked={checked}
                  onChange={handleSwitchChange}
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  defaultChecked
                />{" "}
                <Text>Automatically reject calls</Text>
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item>
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  defaultChecked
                />{" "}
                <Text>Read messages automatically</Text>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
      <Row justify="center" style={{ marginTop: "32px" }}>
        <Col>
          <Button
            type="default"
            style={{ marginRight: "8px" }}
            onClick={() => navigate("/webInstances")}
          >
            Cancel
          </Button>
          <Button type="primary" onClick={handleSave}>
            Save
          </Button>
        </Col>
      </Row>

      <Modal
        title=""
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Confirm"
        cancelText="Cancel"
        centered
        width={500}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
      >
        <Row
          justify="center"
          align="middle"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <Row>
            <Text style={{ color: "#00ac5a" }}>Payment method</Text>
          </Row>
          <Row>
            <Text>Choose the best payment method.</Text>
          </Row>

          <Row>
            <Col md={24}>
              <Button
                type="primary"
                block
                onClick={() => navigate("/checkout")}
              >
                Credit Card
              </Button>
            </Col>
          </Row>
          <Row>
            <Col md={24}>
              <Button
                type="primary"
                block
                style={{ width: "100px" }}
                onClick={showModal4}
              >
                Ticket
              </Button>
            </Col>
          </Row>
        </Row>
      </Modal>

      <Modal
        title=""
        open={isModalOpen4}
        onOk={handleOk4}
        onCancel={handleCancel4}
        okText="Confirm"
        cancelText="Cancel"
        centered
        width={500}
        footer={null}
      >
        <Row
          justify="center"
          align="middle"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <Row>
            <Text>Provide your personal data</Text>
          </Row>
          <Text>Total to pay R$99</Text>
          <Text>Remember to fill in the Name field.</Text>
          <Form
            form={form}
            layout="vertical"
            onFinish={(values) => console.log(values)} // Handle form submission
          >
            <Form.Item
              label=""
              name="name"
              rules={[{ required: true, message: "Please enter your name!" }]}
            >
              <Input placeholder="Name" />
            </Form.Item>

            <Form.Item
              label=""
              name="email"
              rules={[{ required: true, message: "Please enter your email!" }]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              label=""
              name="cpfCnpj"
              rules={[{ required: true, message: "Please enter CPF/CNPJ!" }]}
            >
              <Input placeholder="CPF/CNPJ" />
            </Form.Item>

            <Row align="middle" justify="center">
              <Space>
                <Col>
                  <Form.Item
                    name="ddd"
                    rules={[{ required: true, message: "Please enter DDD!" }]}
                  >
                    <InputNumber placeholder="DDD" />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item
                    name="number"
                    rules={[
                      { required: true, message: "Please enter your number!" },
                    ]}
                  >
                    <Input placeholder="Number" style={{ width: "105%" }} />
                  </Form.Item>
                </Col>
              </Space>
            </Row>
          </Form>
          <Button type="primary" style={{ width: "70%" }} onClick={handleOk4}>
            Continue <DoubleRightOutlined />
          </Button>
        </Row>
      </Modal>

      <Modal
        title=""
        open={isModalOpen2}
        onOk={handleOk2}
        onCancel={handleCancel2}
        okText="Confirm"
        cancelText="Cancel"
        centered
        width={500}
        footer={[
          <Button key="back" onClick={handleCancel2}>
            Cancel
          </Button>,
        ]}
      >
        <Row
          justify="center"
          align="middle"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <DeleteOutlined style={{ fontSize: "24px" }} />
          <Row>
            <Text style={{ color: "#00ac5a" }}>
              Do you really wish to cancel?
            </Text>
          </Row>
          <Text>
            The web instance will be deleted, but the subscription will not be
            refunded, remaining active until expiration.
          </Text>
          <Text>Type to continue confirm cancelation In the field below</Text>
          <Input
            placeholder="Type here a confirmation text"
            style={{ width: "70%" }}
          />
          <Row>
            <Col md={24}>
              <Button type="primary" block style={{ width: "150px" }}>
                Delete
              </Button>
            </Col>
          </Row>
        </Row>
      </Modal>

      <Modal
        title=""
        open={isModalOpen3}
        onOk={handleOk3}
        onCancel={handleCancel3}
        okText="Confirm"
        cancelText="Cancel"
        centered
        width={500}
        footer={[
          <Button key="back" onClick={handleCancel3}>
            Cancel
          </Button>,
        ]}
      >
        <Row
          justify="center"
          align="middle"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <DeleteOutlined style={{ fontSize: "24px" }} />
          <Row>
            <Text style={{ color: "#00ac5a" }}>
              Do you really want to migrate this instance?
            </Text>
          </Row>
          <Text>
            Upon confirmation, the instance will be automatically disconnected
            and migrated to a mobile instance
          </Text>
          <Text>To continue type migrate to mobile in the field below</Text>
          <Input
            placeholder="Type here a confirmation text"
            style={{ width: "70%" }}
          />
          <Row>
            <Col md={24}>
              <Button type="primary" block style={{ width: "150px" }}>
                Delete
              </Button>
            </Col>
          </Row>
        </Row>
      </Modal>
    </>
  );
};

export default WebinstanceView;

import { Button, Form, Input, Typography, Col, message, Flex, Card } from "antd";
import axiosInstance from "../../util/axiosInstance";
import 'react-quill/dist/quill.snow.css';
import { useTranslation } from "react-i18next";
import React from "react";
const { TextArea } = Input;
const { Text } = Typography;

const Feedback = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();


  const onFinish = async (values) => {
    try {
      const { data } = await axiosInstance.post("reseller/feedback/add", {
        message: values.message,
        subject: values.subject
      })
      if (data.status) {
        message.success(data?.message || t("feedback.successMessage"));
        form.resetFields();
      } else {
        message.error(data?.message || t("feedback.errorMessage"));
      }
    } catch (error) {
      message.error(error)
    }
  };

  return (
    <React.Fragment>
      <Card>
      <Form
        layout="vertical"
        form={form}
        style={{
          maxWidth: 600,
        }}
        onFinish={onFinish}
      >
        <Text>
          {t("feedback.subject")}
          <Form.Item
            name="subject"
            rules={[{ required: true, message: t("feedback.pleaseenterthesubject") }]}
          >
            <Input  placeholder={t("feedback.enterSubject")} />
          </Form.Item>
        </Text>
        <Text>  {t("feedback.message")}
          <Form.Item
            name="message"
            rules={[{ required: true, message: 'Please enter the message' }]}
          >
            <TextArea  rows={6} placeholder="Enter Message" />
          </Form.Item>
        </Text>
        <Flex justify="end">
          <Button
            type="primary"
            htmlType="submit"
          >
            {t("submit")}
          </Button>
        </Flex>
      </Form>
      </Card>
    </React.Fragment>
  );
};

export default Feedback;
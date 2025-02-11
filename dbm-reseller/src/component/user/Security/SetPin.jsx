import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  ConfigProvider,
  Card,
  Typography,
  Flex,
} from "antd";
import axiosInstance from "../../../util/axiosInstance";
import { CheckCircleFilled } from "@ant-design/icons";
import { useSelector } from "react-redux";
const { Title, Text } = Typography;
// eslint-disable-next-line react/prop-types
const SetPin = ({ onPinSet, isEditMode, CompanyName }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isDarkMode = useSelector((state) => state?.app?.theme);

  const handleSetPinSubmit = async (values) => {
    if (values.newPin !== values.confirmPin) {
      message.error("PINs do not match");
      return;
    }
    try {
      setLoading(true);
      const endpoint = isEditMode ? "reseller/change-pin" : "reseller/add-pin";
      const payload = isEditMode
        ? {
          old_pin: Number(values.oldPin),
          new_pin: Number(values.newPin),
          confirm_pin: Number(values.confirmPin)
        }
        : {
          pin: Number(values.newPin),
          set_pin: Number(values.confirmPin)
        };

      const { data } = await axiosInstance.post(endpoint, payload);

      if (data?.status) {
        message.success(data?.message);
        onPinSet();
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
      form.resetFields();
    }
  };

  return (
    <React.Fragment>
      <ConfigProvider
        theme={{
          components: {
            Input: {
              borderRadius: 6,
              controlHeight: 40,
              inputFontSize: 30,
              fontSize: 20,
            },
          },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          onFinish={handleSetPinSubmit}
          className="pin-unlock-form"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
              {CompanyName}
            </Title>
            <Title level={5}>
            </Title>
            <Text type="secondary" style={{ marginBottom: 24 }}>
              {isEditMode
                ? "Please enter your old PIN and create a new 4-digit PIN."
                : "Please create a new 4-digit PIN to secure your account."}
            </Text>

            {isEditMode && (
              <Form.Item
                name="oldPin"
                label="Old PIN"
                rules={[
                  { required: true, message: "Please enter your old PIN" },
                  { len: 4, message: "PIN must be 4 digits" },
                ]}
                className="pin-input-item"
              >
                <Input.OTP
                  type="password"
                  mask="🔒"
                  inputMode="numeric"
                  maxLength={4}
                  length={4}
                  style={{ letterSpacing: "1em" }}
                />
              </Form.Item>
            )}
            <Form.Item
              name="newPin"
              label="New PIN"
              rules={[
                { required: true, message: "Please enter a new PIN" },
                { len: 4, message: "PIN must be 4 digits" },
              ]}
              className="pin-input-item"
            >
              <Input.OTP
                type="password"
                mask="🔒"
                inputMode="numeric"
                maxLength={4}
                length={4}
                style={{ letterSpacing: "1em" }}
              />
            </Form.Item>
            <Form.Item
              name="confirmPin"
              label="Confirm New PIN"
              rules={[
                { required: true, message: "Please confirm the PIN" },
                { len: 4, message: "PIN must be 4 digits" },
              ]}
              className="pin-input-item"
            >
              <Input.OTP
                type="password"
                mask="🔒"
                inputMode="numeric"
                length={4}
                maxLength={4}
                style={{ letterSpacing: "1em" }}
              />
            </Form.Item>
            <Button
              type="primary"
              icon={<CheckCircleFilled />}
              htmlType="submit"
              loading={loading}
            >
              Save Pin
            </Button>
          </div>
        </Form>
      </ConfigProvider>
    </React.Fragment>
  );
};

export default SetPin;

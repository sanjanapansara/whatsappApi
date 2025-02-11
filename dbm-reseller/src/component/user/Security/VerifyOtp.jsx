import React, { useState } from "react";
import { Form, Input, Button, message, ConfigProvider, Card, Typography } from "antd";
import axiosInstance from "../../../util/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { RedoOutlined } from "@ant-design/icons";
import { setUserDetails } from "../../../redux/reducers/reducer.user";
const { Title, Text } = Typography;
// eslint-disable-next-line react/prop-types
const VerifyOtp = ({ onVerified, canResend, resendTimer, onClick, CompanyName }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const userPhone = useSelector((state) => state?.user?.profile?.phone);

  const handleVerifyOTP = async (values) => {
    const { otp } = values;
    if (!otp || otp.length !== 6) {
      message.error("Please enter a valid 6-digit OTP");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axiosInstance.post("auth/lock-pin/verify-otp", {
        auth_type: "phone",
        phone: userPhone,
        otp: otp,
      });
      if (data?.status) {
        message.success(data?.message || "OTP verified successfully");
        dispatch(setUserDetails(data));
        onVerified();
      } else {
        message.error(data?.message || "OTP verification failed");
      }
    } catch (error) {
      message.error("An error occurred during OTP verification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <ConfigProvider
        theme={{
          components: {
            Input: {
              borderRadius: 6,
              controlHeight: 45,
              inputFontSize: 30,
              fontSize: 20,
            },
          },
        }}
      >
        <Card style={{border:"none"}}>
          <Form
            form={form}
            layout="vertical"
            autoComplete="off"
            onFinish={handleVerifyOTP}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Title level={4} style={{ margin: 0 }}>
                {CompanyName ?? "Company"}
              </Title>
              <Title level={5}>Enter OTP</Title>
              <Text style={{ marginBottom: 24 }}>
                Enter the 6-digit verification code sent to {userPhone}
              </Text>
              <Form.Item
                name="otp"
                rules={[{ required: true, message: "Please enter the OTP" }]}
              >
                <Input.OTP
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  onPressEnter={handleVerifyOTP}
                />
              </Form.Item>
              <Button
                type="primary"
                block
                htmlType="submit"
                loading={loading}
              >
                Verify OTP
              </Button>
              <Button
                type="link"
                icon={<RedoOutlined />}
                onClick={onClick}
                disabled={!canResend}
                style={{ marginTop: 16 }}
              >
                Resend OTP {!canResend && `(${resendTimer}s)`}
              </Button>
            </div>
          </Form>
        </Card>
      </ConfigProvider>
    </React.Fragment>
  );
};

export default VerifyOtp;

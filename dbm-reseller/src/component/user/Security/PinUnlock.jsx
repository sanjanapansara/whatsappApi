import React, { useMemo, useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  ConfigProvider,
  Typography,
  Modal,
  Flex,
  Image,
  Row,
} from "antd";
import axiosInstance from "../../../util/axiosInstance";
import PinFlow from "./PinFlow";
import { useDispatch, useSelector } from "react-redux";
import { setIsDisplayLock, setIsLockPinEnter } from "../../../redux/reducers/reducer.app";
import { getMediaPath } from "../../../lib";
const { Title } = Typography;
const PinUnlock = () => {
  const dispatch = useDispatch()
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPinFlow, setShowPinFlow] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const panel = useSelector((state) => state?.setting?.resellerPenal);
  const Logo = useMemo(() => panel?.reseller?.logo ?? "", [panel]);
  const CompanyName = useMemo(() => panel?.billingDetails?.companyName ?? "", [panel]);

  const handleUnlockPin = async (values) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post("reseller/check-pin", {
        pin: Number(values.checkPin),
      });
      if (data?.status) {
        message.success(data?.message);
        setIsModalVisible(false);
        dispatch(setIsDisplayLock(false));
        dispatch(setIsLockPinEnter(true))
      } else {
        message.error(data?.message || "Incorrect PIN");
      }
    } catch (error) {
      message.error(error.message || "Incorrect PIN");
    } finally {
      setLoading(false);
      form.resetFields();
    }
  };

  const onForgotPin = () => {
    setShowPinFlow(true);
    setIsForgot(true);
    setIsModalVisible(false);
  };

  return (
    <React.Fragment>
      <Modal
        width={450}
        open={isModalVisible}
        centered
        closeIcon={false}
        footer={null}
      >
        <div
          style={{
            padding: "20px",
          }}
        >
          <Flex justify="center">
            <Image width={"50%"} preview={false} src={getMediaPath(Logo)} style={{ marginBottom: 20 }} alt="logo" />
          </Flex>
          <Form
            form={form}
            layout="vertical"
            autoComplete="off"
            onFinish={handleUnlockPin}
          >
            <div
              className="pin-unlock-content"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "28px", marginBottom: 10 }}>🔒</span>
              <Title level={4} style={{ margin: 0, color: "#4a4a4a" }}>
                {CompanyName}
              </Title>

              <Title level={5} className="pin-unlock-subtitle" style={{ marginBottom: 20, color: "#7a7a7a" }}>
                Enter PIN Lock
              </Title>
              <Form.Item
                name="checkPin"
                rules={[
                  { required: true, message: "Please enter your PIN" },
                  { len: 4, message: "PIN must be 4 digits" },
                ]}
              >
                <Input.OTP
                  mask="*"
                  maxLength={4}
                  length={4}
                  style={{
                    borderRadius: '6px',
                    padding: '10px',
                    borderColor: '#4caf50',
                  }}
                />
              </Form.Item>
              <Row align="middle" justify="end">
                <Button
                  type="link"
                  onClick={onForgotPin}
                  style={{
                    marginBottom: 16,
                    right: "-100%",
                    color: "#1890ff",
                    marginTop: -16,
                    fontSize: "14px",
                  }}
                >
                  Forgot PIN
                </Button>
              </Row>

              <Button
                type="primary"
                block
                htmlType="submit"
                loading={loading}
                style={{
                  backgroundColor: "#1890ff",
                  borderColor: "#1890ff",
                  borderRadius: 6,
                  fontSize: "16px",
                }}
              >
                Unlock
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
      <Modal
        width={450}
        open={showPinFlow}
        centered
        onCancel={() => setShowPinFlow(false)}
        footer={null}
      >
        <PinFlow isForgot={isForgot} />
      </Modal>
    </React.Fragment>
  );
};

export default PinUnlock;

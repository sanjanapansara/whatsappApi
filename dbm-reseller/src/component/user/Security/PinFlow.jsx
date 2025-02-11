import React, { useContext, useEffect, useMemo, useState } from "react";
import SetPin from "./SetPin";
import Success from "./Success";
import { Button, Col, message, Row, Typography } from "antd";
import axiosInstance from "../../../util/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import VerifyOTP from "./VerifyOtp";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { setIsDisplayLock } from "../../../redux/reducers/reducer.app";
import { refreshProfile } from "../../../redux/action";
import PinUnlock from "./PinUnlock";
import { PinContext } from "../../../PinContext";
const { Text, Title } = Typography;

const PinFlow = ({ isForgot }) => {
  const dispatch = useDispatch();
  const pinFlow = useContext(PinContext);
  const profile = useSelector((state) => state?.user?.profile);
  const [loading, setLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDisable, setIsDisable] = useState(false);

  const panel = useSelector((state) => state?.setting?.resellerPenal);
  const CompanyName = useMemo(() => panel?.billingDetails?.companyName ?? "", [panel]);
  useEffect(() => {
    let timer;
    if (resendTimer > 0 && !canResend) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 500);
    } else if (resendTimer === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [resendTimer, canResend]);

  useEffect(() => {
    if (isForgot === true) {
      pinFlow.setCurrentStep("verifyOTP");
      handleSendOTP();
    }
  }, [isForgot]);
  const handleSendOTP = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post("auth/lock-pin/send-otp", {
        auth_type: "phone",
        phone: `${profile?.phone}`,
      });
      if (data?.status) {
        message.success(data?.message);
        pinFlow.setCurrentStep("verifyOTP");
        setResendTimer(30);
        setCanResend(false);
      } else {
        message.error(data?.message || "Failed to send OTP");
      }
    } catch (error) {
      message.error("An error occurred while sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerified = () => {
    pinFlow.setCurrentStep("setPin");
    setIsEditMode(false);
  };

  const handlePinSet = () => {
    dispatch(refreshProfile());
    pinFlow.setCurrentStep("success");
  };

  const handleSuccess = () => {
    setIsDisable(false);
    pinFlow.setCurrentStep("initial");
    dispatch(setIsDisplayLock(false));
  };

  const handleEditPin = () => {
    setIsEditMode(true);
    pinFlow.setCurrentStep("setPin");
  };
  const handleRemovePin = async (pin) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post("reseller/remove-pin", {
        pin: Number(pin),
      });
      if (data?.status) {
        message.success("PIN deleted successfully");
        pinFlow.setCurrentStep("verifyOTP");
        handleSendOTP()
      } else {
        throw new Error(data?.message || "Failed to delete PIN");
      }
    } catch (error) {
      message.error(error.message || "Failed to delete PIN");
    } finally {
      setLoading(false);
    }
  };
  console.log("currentStep flow", pinFlow.currentStep)
  const renderStep = () => {
    switch (pinFlow.currentStep) {
      case "initial":
        return (
          <React.Fragment>
            <Title level={4}>Secure Your Account</Title>
            <Text>
              Enhance your account security by setting up a PIN (Personal
              Identification Number). This PIN will be required to access your
              account in the future.
            </Text>
            <Row
              justify="space-between"
              align="middle"
              style={{
                marginTop: "20px",
                border: "1px solid #a4a4a4",
                borderRadius: "60px",
                padding: "8px 15px",
                width: "100%",
                maxWidth: "50%",
              }}
            >
              <Col flex="1" style={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: "18px" }}>🔒</span>
                <Text style={{ marginLeft: "10px", fontSize: "16px" }}>
                  Lock Pin
                </Text>
              </Col>
              <Col>
                {profile?.pin === null ? (
                  <Button
                    type="primary"
                    style={{ borderRadius: 50 }}
                    onClick={handleSendOTP}
                    loading={loading}
                  >
                    SET UP
                  </Button>
                ) : (
                  <>
                    <Button
                      type="danger"
                      onClick={handleEditPin}
                      icon={<EditOutlined />}
                    />
                    <Button
                      type="danger"
                      onClick={() => {
                        setIsDisable(!isDisable)
                        handleRemovePin(profile?.pin)
                      }}
                      disabled={isDisable}
                      icon={<DeleteOutlined
                        style={{
                          color: isDisable || isDisable === null ? "#d9d9d9" : "#ff4d4f", // Gray for disabled, red for enabled
                          fontSize: "18px",
                        }}
                      />}
                    />
                  </>
                )}
              </Col>
            </Row>
          </React.Fragment>
        );
      case "verifyOTP":
        return (
          <VerifyOTP
            onVerified={handleOTPVerified}
            canResend={canResend}
            resendTimer={resendTimer}
            onClick={handleSendOTP}
            CompanyName={CompanyName}
          />
        );
      case "setPin":
        return <SetPin CompanyName={CompanyName} onPinSet={handlePinSet} isEditMode={isEditMode} />;
      case "success":
        return <Success handleSuccess={handleSuccess} />;
      case "pinUnlock":
        return <PinUnlock />
      default:
        return null;
    }
  };

  return <React.Fragment>{renderStep()}</React.Fragment>;
};

export default PinFlow;

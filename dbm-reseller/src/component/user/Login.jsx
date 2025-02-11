import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import lang from "../../util/lang/lang";
import {
  Tooltip,
  Button,
  Col,
  Form,
  Row,
  Space,
  Image,
  Typography,
  message,
  Input,
  Flex,
  Checkbox,
  Divider,
  Select,
  Card,
  Layout,
  Avatar,
  ConfigProvider,
  theme as antdTheme,
} from "antd";
import {
  EditOutlined,
  ExclamationCircleOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import ReactPhoneInput from "vreact-phone-input";
const PhoneInput = ReactPhoneInput.default
  ? ReactPhoneInput.default
  : ReactPhoneInput;
import "vreact-phone-input/lib/style.css";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../util/axiosInstance";
import { setUserDetails } from "../../redux/reducers/reducer.user";
import { changeLanguage } from "../../redux/reducers/reducer.setting";
import i18next from "i18next";
import { getMediaPath } from "../../lib";
import { useNavigate } from "react-router-dom";
import { setTheme } from "../../redux/reducers/reducer.app";
const { Title, Text, Link } = Typography;

const Login = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const otpRef = useRef(null);
  const setting = useSelector((state) => state?.setting);
  const panel = useSelector((state) => state?.setting?.panel);
  const logo = useMemo(() => panel?.reseller?.logo ?? "", [panel]);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [isValidOTP, setIsValidOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkTerms, setCheckTerms] = useState(true);
  const [tick, setTick] = useState(30);
  const [resend, setResend] = useState(false);
  const theme = useSelector((state) => state?.app?.theme);

  useEffect(() => {
    if (!isLoginPage) {
      otpRef.current.focus();
    }
  }, [isLoginPage]);

  useEffect(() => {
    setLoading(false);

    if (!isLoginPage) {
      var timeOut = setTimeout(() => {
        setTick(tick - 1);
      }, 1000);
      if (tick < 1) {
        clearTimeout(timeOut);
      }

      if (tick === 0) {
        setResend(true);
      }
    }
  }, [isLoginPage, tick]);

  const onSendOtp = async () => {
    try {
      setLoading(true); // Start the loading state
      setTick(30); // Reset the tick count for the timer
      setResend(false); // Reset the resend state to false
      setOtp(""); // Clear the OTP input field

      const { data } = await axiosInstance.post("reseller/send-otp", {
        auth_type: "phone",
        phone: "+" + phone,
      });

      if (data.status) {
        setIsLoginPage(false);
        message.success(data.message);
        dispatch(setUserDetails(data));
      } else {
        message.error(data.message);
      }
    } catch (error) {
      message.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onOtpVerify = async () => {
    try {
      setLoading(true); // Set loading state to true while OTP verification is in progress
      const { data } = await axiosInstance.post("reseller/verify-otp", {
        auth_type: "phone",
        phone: "+" + phone,
        otp: otp,
      });
      if (data.status) {
        message.success(t("login.loginSuccessfully"));
        dispatch(setUserDetails(data));
        navigate("/");
      } else {
        message.error(data.message);
      }
    } catch (error) {
      message.error(error);
    } finally {
      setLoading(false); // Ensure that loading state is set to false after handling the response
    }
  };

  const onResend = () => {
    onSendOtp();
  };

  const onEditPhoneNumber = () => {
    setIsLoginPage(true);
  };

  const toggleTheme = () => {
    dispatch(setTheme(!theme));
  };

  return (
    <React.Fragment>
      <Layout
        style={{
          height: "100vh",
          width: "100vw",
          backgroundImage: `url(${getMediaPath('/media/background/login-bg.svg')})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Flex align="end" justify="end">


        <ConfigProvider
        theme={{
          algorithm: antdTheme.defaultAlgorithm, // Apply light theme here
          token: {

          },
          "components": {
            "Form": {
              "labelColor": "rgba(0,0,0,0.8)"
            }
          },
        }}
      >
          <Form
            layout="inline"
            style={{
              padding: "10px",
              //background: theme ? "#ffffff10" : "#00000020",
            }}

          >
            <Form.Item noStyle>
              {theme ? (
                <Avatar
                style={{
                  backgroundColor: antdTheme.useToken().token.colorPrimary,
                }}
                icon={<MoonOutlined
                  key="MoonOutlined"
                  onClick={toggleTheme}
                />} />
              ) : (
                <Avatar
                style={{
                  backgroundColor: antdTheme.useToken().token.colorPrimary,
                }}
                icon={<SunOutlined
                  key="SunOutlined"
                  onClick={toggleTheme}

                />} />
              )}
            </Form.Item>

            <Form.Item
              style={{
                marginLeft: "20px",
              }}
              label={t("dashboard.selectLanguage")}
              theme={"light"}
            >
              <Select
                defaultValue={setting.lang ?? "en"}
                listHeight={200}
                showSearch
                style={{
                  width: 150,
                }}
                onChange={(value) => {
                  dispatch(changeLanguage(value));
                  i18next.changeLanguage(value);
                }}
                options={lang.map((x) => {
                  return {
                    value: x.key,
                    label: x.name,
                  };
                })}
              />
            </Form.Item>
          </Form>
        </ConfigProvider>
        </Flex>

        <Flex
          align="middle"
          justify="center"
          style={{
            margin: "auto",
          }}
        >
          <Row>
            {isLoginPage ? (
              <Col xs={24} sm={24} md={12} xl={10}>
                <Form
                  onFinish={onSendOtp}
                  layout="vertical"
                  style={{ width: 350 }}
                >
                  <Card>
                    <Flex justify="center">
                      <Image
                        preview={false}
                        src={
                          logo == ""
                            ? getMediaPath("/api/media/panel/logo-long.png")
                            : getMediaPath(logo)
                        }
                        alt="logo"
                        loading="lazy"
                        height={"58px"}
                      />
                    </Flex>

                    <Flex vertical justify="space-around">
                      <Form.Item
                        name="phone"
                        type="text"
                        label={t("setting.mobileNumber")}
                        initialValue={phone}
                        rules={[
                          {
                            required: true,
                            message: t("login.phoneError"),
                          },
                          () => ({
                            validator(rule, value) {
                              const isValid = isValidPhoneNumber("+" + value);

                              if (value && isValid) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                t("login.invalidPhoneNumber")
                              );
                            },
                          }),
                        ]}
                      >
                        <PhoneInput
                          country={"IN".toLowerCase()}
                          value={phone}
                          autoFormat={false}
                          placeholder={t("phoneNumber")}
                          isValid={(value, country) => {
                            if (value.match(/12345/)) {
                              return (
                                "Invalid value: " + value + ", " + country.name
                              );
                            } else if (value.match(/1234/)) {
                              return false;
                            } else {
                              return true;
                            }
                          }}
                          onChange={(phone) => {
                            setPhone(phone);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              onSendOtp();
                            }
                          }}
                          rules={[
                            {
                              required: true,
                              message: t("login.pleaseInput"),
                            },
                          ]}
                        />
                      </Form.Item>
                    </Flex>
                    <Form.Item style={{ maxWidth: "300px" }}>
                      <Checkbox
                        onChange={(e) => setCheckTerms(e.target.checked)}
                        defaultChecked
                      >
                        {t("login.keepmesignedin")}
                      </Checkbox>
                      <Text type="secondary">
                        <Space>
                          <Tooltip title={t("login.tooltip")}>
                            <ExclamationCircleOutlined />
                          </Tooltip>
                        </Space>
                      </Text>
                      <Divider />
                      <Text>
                      By continuing you agree to our <Link
                          href={`/privacy-policy`}
                          target="_blank"
                        >
                          {t("Privacy Policy")}
                          {"  "}
                        </Link>
                        {" & "}
                        <Link
                          href={`/terms-and-conditions`}
                          target="_blank"
                        >
                          {t("Terms And Conditions")}
                        </Link>.
                      </Text>
                    </Form.Item>

                    <Button
                      type="primary"
                      htmlType="submit"
                      className="login-form-button"
                      loading={loading}
                      disabled={!checkTerms || phone == ""}
                      style={{ width: "100%" }}
                    >
                      {t("Send OTP")}
                    </Button>
                  </Card>
                </Form>
              </Col>
            ) : (
              <Col sm={24} md={10} xl={10}>
                <Form
                  layout="vertical"
                  onFinish={onOtpVerify}
                  style={{ width: 350 }}
                >
                  <Card>
                    <Flex justify="center">
                      <Image
                        loading="lazy"
                        preview={false}
                        src={getMediaPath(logo)}
                        style={{ marginBottom: 20 }}
                        alt="logo"
                        height={"58px"}
                      />
                    </Flex>
                    <Space direction="vertical">
                      <Title level={3}>{t("login.enterOTP")}</Title>
                      <Text className="font-regular" type="primary">
                        {t("login.wevesentaverificationcodeto ")}
                        <b>+{phone}</b>
                        <EditOutlined onClick={onEditPhoneNumber} />
                      </Text>{" "}
                      <Form.Item style={{ marginBottom: "0px" }}>
                        <Input.OTP
                          ref={otpRef}
                          id="submitButton"
                          label={t("login.enterOTP")}
                          formatter={(value) => {
                            if (value != "") {
                              setIsValidOTP(value.length == 6);
                            }
                            return value;
                          }}
                          align="start"
                          onChange={(value) => {
                            setOtp(value);
                          }}
                          onPressEnter={() => {
                            onOtpVerify();
                          }}
                          value={otp}
                          inputStyle={{
                            height: "45px",
                            marginBottom: "0px",
                          }}
                        />
                      </Form.Item>
                      <Flex vertical justify="center" align="flex-end">
                        <Text type="secondary">
                          {
                            <Typography.Title
                              style={{ marginTop: "0px" }}
                              level={5}
                              type="secondary"
                            >
                              {tick > 0
                                ? tick >= 10
                                  ? `00:${tick}`
                                  : `00:0${tick}`
                                : ""}
                            </Typography.Title>
                          }
                        </Text>
                      </Flex>
                      <Form.Item>
                        <Button
                          style={{ marginBottom: "10px" }}
                          block
                          type="primary"
                          htmlType="submit"
                          loading={loading}
                          disabled={!isValidOTP}
                        >
                          {t("submit")}
                        </Button>
                      </Form.Item>
                    </Space>
                    <Form.Item>
                      {" "}
                      <Space>
                        <Text>{t("login.dont'tgettheOTP")}</Text>
                        {resend ? (
                          <Button
                            type="link"
                            onClick={onResend}
                            style={{ padding: "0" }}
                          >
                            {t("login.resend")}
                          </Button>
                        ) : (
                          <Text type="secondary" disabled>
                            {t("login.resend")}
                          </Text>
                        )}
                      </Space>
                    </Form.Item>
                  </Card>
                </Form>
              </Col>
            )}
          </Row>
        </Flex>
      </Layout>
    </React.Fragment>
  );
};

export default Login;

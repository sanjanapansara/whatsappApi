import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  message,
  Row,
  Select,
  Upload,
} from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { refreshProfile } from "../../redux/action";
import { LoadingOutlined } from "@ant-design/icons";
import countryCodes from "country-codes-list";
import ReactPhoneInput from "vreact-phone-input";
import axiosInstance from "../../util/axiosInstance";
import { getMediaPath } from "../../lib";
const PhoneInput = ReactPhoneInput.default
  ? ReactPhoneInput.default
  : ReactPhoneInput;

const Profile = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const profile = useSelector((state) => state?.user?.profile);
  const isDarkMode = useSelector((state) => state?.app?.theme);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [zip, setZip] = useState("");

  const [profileUrl, setProfileUrl] = useState("");

  const [isProfileUploading, setIsProfileUploading] = useState(false);
  const [countryList, setCountryList] = useState([]);

  useEffect(() => {
    dispatch(refreshProfile());
    const cList = countryCodes.all();
    setCountryList(cList);
  }, [dispatch]);

  useEffect(() => {
    setName(profile.name);
    setProfileUrl(profile.profile);
    setEmail(profile.email);
    setPhone(profile.phone);
    if (profile.address) {
      setAddressLine1(profile.address.addressLine1);
      setAddressLine2(profile.address.addressLine2);
      setCity(profile?.address?.city);
      setState(profile.address.state);
      setCountry(profile.address.country);
      setZip(profile.address.zip);
    }

    form.setFieldsValue({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      addressLine1: profile.address?.addressLine1,
      addressLine2: profile.address?.addressLine2,
      city: profile.address?.city,
      state: profile.address?.state,
      country: profile.address?.country,
      zip: profile.address?.zip,
    });
  }, [profile]);

  const onProfileSave = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post("auth/profile/save", {
        name: name,
        email: email,
        address: {
          country: country,
          addressLine1: addressLine1,
          addressLine2: addressLine2,
          city: city,
          state: state,
          zip: zip,
        },
        profile: profileUrl,
      });

      if (data.status) {
        message.success(data?.message);
        dispatch(refreshProfile());
      } else {
        message.error(data.message);
      }
    } catch (e) {
      message.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const imageUpload = async (options) => {
    const { file } = options;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "image");
    try {
      setIsProfileUploading(true);
      const { data } = await axiosInstance.post("app/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (data?.status) {
        message.success(data.message);
        setProfileUrl(data?.downloadUrl);
      } else {
        message.error(data.message);
      }
    } catch (error) {
      message.error("Failed to upload image.");
    } finally {
      setIsProfileUploading(false);
    }
  };

  return (
    <React.Fragment>
      <div style={{ padding: 20 }}>
        <Card title={t("profile.Information")}>
          <Form
            form={form}
            onFinish={onProfileSave}
            initialValues={{
              name: name,
              profileUrl: profileUrl,
              phone: phone,
              email: email,
              addressLine1: addressLine1,
              addressLine2: addressLine2,
              city: city,
              state: state,
              country: country,
              zip: zip,
            }}
            loading={loading}
            layout="vertical"
            autoComplete="off"
          >
            <Row gutter={[16, 0]}>
              <Col xs={24} sm={24} md={9} lg={6} xl={6}>
                <Form.Item label={t("profile")} name="logo">
                  <Flex justify="center" align="center">
                    <Upload
                      multiple={false}
                      showUploadList={false}
                      customRequest={imageUpload}
                    >
                      {isProfileUploading ? (
                        <LoadingOutlined />
                      ) : (
                        <Avatar
                          shape="circle"
                          size={100}
                          src={
                            profileUrl !== ""
                              ? getMediaPath(profileUrl)
                              : `${getMediaPath("/media/avatar.png")}`
                          }
                          alt="avatar"
                        />
                      )}
                    </Upload>
                  </Flex>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={15} lg={18} xl={18} xxl={18}>
                <Row gutter={[16, 0]}>
                  <Col md={12} sm={12} xl={12} xs={24}>
                    <Form.Item
                      label={t("name")}
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: t("pleaseEnterYourName"),
                        },
                      ]}
                    >
                      <Input
                        name="name"
                        placeholder={t("profile.enterYourName")}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Form.Item>
                  </Col>

                  <Col md={12} sm={12} xl={12} xs={24}>
                    <Form.Item
                      label={t("phone")}
                      name="phone"
                      rules={[
                        {
                          required: true,
                          message: t("login.phoneError"),
                        },
                      ]}
                    >
                      <PhoneInput
                        name="phone"
                        inputStyle={{
                          width: "100%",
                          background: isDarkMode ? "#333" : "#fff",
                          color: isDarkMode ? "#fff" : "#333",
                        }}
                        country={"IN".toLowerCase()}
                        placeholder={t("profile.enterYourPhone")}
                        disabled
                        value={profile?.phone}
                      />
                    </Form.Item>
                  </Col>

                  <Col md={24} sm={24} xl={24} xs={24}>
                    <Form.Item
                      label={t("emailAddress")}
                      name="email"
                      rules={[
                        {
                          type: "email",
                          message: t("theinputisnotvalidEmail"),
                        },
                        {
                          required: true,
                          message: t("pleaseinputyourEmail"),
                        },
                      ]}
                    >
                      <Input
                        name="email"
                        type="email"
                        placeholder={t("profile.EnterYourEmail")}
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  label={t("profile.addressLine1")}
                  name="addressLine1"
                  rules={[
                    {
                      required: true,
                      message: t("pleaseenterwebsiteURL"),
                    },
                  ]}
                >
                  <Input
                    name="addressLine1"
                    placeholder={t("enterAddress")}
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  label={t("profile.addressLine2")}
                  name="addressLine2"
                  rules={[
                    {
                      required: true,
                      message: t("pleaseenterwebsiteURL"),
                    },
                  ]}
                >
                  <Input
                    name="addressLine2"
                    placeholder={t("enterAddressLine2")}
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  name="city"
                  label={t("profile.yourCity")}
                  rules={[
                    {
                      required: true,
                      message: t("pleaseenterCity"),
                    },
                  ]}
                >
                  <Input
                    name="city"
                    placeholder={t("profile.enterYourCity")}
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  name="state"
                  label={t("profile.yourState")}
                  rules={[
                    {
                      required: true,
                      message: t("pleaseenterState"),
                    },
                  ]}
                >
                  <Input
                    name="state"
                    placeholder={t("enterYourState")}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  name="country"
                  label={t("profile.country")}
                  rules={[
                    {
                      required: true,
                      message: t("activation.countryError"),
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder={t("select")}
                    value={country}
                    onChange={(value) => setCountry(value)}
                    optionFilterProp="children"
                  >
                    {countryList.map((country, i) => (
                      <Select.Option
                        key={"country-" + i}
                        value={country.countryNameEn}
                      >
                        {country.countryNameEn}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item label={t("profile.zipCode")}>
                  <Input
                    placeholder={t("profile.enterCode")}
                    name="zip"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Flex justify="end">
              <Button
                style={{ width: "20%" }}
                block
                type="primary"
                htmlType="submit"
              >
                {t("save")}
              </Button>
            </Flex>
          </Form>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default Profile;

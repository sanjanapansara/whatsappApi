import { Avatar, Button, Dropdown, Form, Modal, Select, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import lang from "../../util/lang/lang";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { logout, refreshProfile } from "../../redux/action";
import {
  changeCurrency,
  changeLanguage,
} from "../../redux/reducers/reducer.setting";
import { DownOutlined, LaptopOutlined, LockOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";
import i18next from "i18next";
import { PageHeader } from "@ant-design/pro-components";
import ReactCountryFlag from "react-country-flag";
import { useNavigate } from "react-router-dom";
import PinFlow from "../user/Security/PinFlow";
import { getMediaPath } from "../../lib";

const HeaderUI = (props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const profile = useSelector((state) => state?.user?.profile);
  const pageTitle = useSelector((state) => state?.setting?.pageTitle);

  const setting = useSelector((state) => state?.setting);
  const dispatch = useDispatch();

  // const currencies = useSelector((state) => state.setting.currencies);
  const selectedCurrency = useSelector((state) => state?.setting?.currency);
  const resellerCurrency = useSelector((state) => state?.setting?.resellerPenal?.currency ?? []);
  const  DefaultCurrency = useSelector((state) => state?.setting?.resellerPenal)
  const [showSetPineModal, setShowSetPineModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  // const filteredCurrency = resellerCurrency.filter((currencyItem) => currencyItem?.isBase);
  //notifications
  // const [notifications, setNotifications] = useState([]);
  // const [notificationType, setNotificationType] = useState("application");
  // const [notificationPage, setNotificationPage] = useState(1);
  // const [notificationPageTotal, setNotificationPageTotal] = useState(1);
  // const [notificationLoading, setNotificationLoading] = useState(false);
  //Edit Profile

  useEffect(() => {
    dispatch(refreshProfile());
    // loadNotifications();
  }, [dispatch]);

  // useEffect(() => {
  //   setNotificationPage(1);
  // }, [notificationType]);

  // useEffect(() => {
  //   loadNotifications();
  // }, [notificationPage]);

  // const loadNotifications = async () => {
  //   try {
  //     setNotificationLoading(true);
  //     const { data } = await axiosInstance.post("reseller/notifications", {
  //       page: notificationPage - 1,
  //       limit: 10,
  //       type: notificationType,
  //     });

  //     setNotificationLoading(false);

  //     if (data.status) {
  //       setNotifications(data.notifications);
  //     }
  //   } catch (error) {
  //     setNotifications([]);
  //     console.log("setNotifications: Error: " + error);
  //   }
  // };
  // const [currentStep, setCurrentStep] = useState("initial");

  return (
    <>
      <Modal
        title={t("Security")}
        open={showSetPineModal}
        width={650}
        centered
        onCancel={() => {
          setShowSetPineModal(false);
          // setCurrentStep("initial")
          form.resetFields();
        }}
        footer={null}
      >
        <PinFlow setShowSetPineModal={setShowSetPineModal}
        // currentStep={currentStep} setCurrentStep={setCurrentStep}
        />
      </Modal>


      <Modal
        title={t("profile.editProfile")}
        open={showProfileModal}
        width={800}
        centered
        onCancel={() => setShowProfileModal(false)}
        okText={t("save")}
        onOk={() => form.submit()}
      ></Modal>

      <Header className="header" {...props}>
        <PageHeader
          title={t(pageTitle)}
          extra={
            <Space>
              <Dropdown
                key="pay"
                menu={{
                  items: resellerCurrency?.map((currencyItem) => {
                    return {
                      key: currencyItem._id,
                      label: (
                        <Space>
                          <ReactCountryFlag
                            countryCode={currencyItem?.countries[0]?.substring(0, 2)}
                            svg
                          />
                          {currencyItem?.currency}
                        </Space>
                      ),
                      onClick: () => {
                        dispatch(changeCurrency(currencyItem?.currency));
                      },
                    };
                  }),
                }}
              >
                <Button>
                  <Space>
                    <ReactCountryFlag
                      countryCode={
                        resellerCurrency?.find((item) => item?.currency === selectedCurrency)?.countries[0]?.substring(0, 2) || DefaultCurrency?.defaultCurrency}
                      svg
                    />
                    {selectedCurrency}
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>

              <Typography.Text strong>
                {t("dashboard.selectLanguage")}
              </Typography.Text>

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

              {/* <Popover
                placement="topRight"
                title="Notifications"
                content={
                  <Space direction="vertical">
                    <Segmented
                      value={notificationType}
                      options={[
                        { label: "Application", value: "application" },
                        { label: "General", value: "general" },
                      ]}
                      block
                      onChange={(value) => {
                        console.log("Notification Type: " + value);
                        setNotificationType(value);
                      }}
                    />

                    {(notifications ?? []).map((item, index) => {
                      const createdAt = new Date(
                        item.createdAt
                      ).toLocaleString();

                      return (
                        <Card
                          key={"notification-" + item.id}
                          size="small"
                          bordered={false}
                          hoverable={false}
                        >
                          <Meta
                            avatar={<Avatar icon={<NotificationOutlined />} />}
                            title={item.title}
                            description={item.description}
                          />
                        </Card>
                      );
                    })}

                    <Flex justify="center">
                      <Pagination
                        onChange={(page) => {
                          setNotificationPageTotal(page);
                        }}
                        size="small"
                        loading={notificationLoading}
                        page={notificationPage}
                        pageSize={10}
                        total={notificationPageTotal}
                      />
                    </Flex>
                  </Space>
                }
              >
                <Badge count={notifications.length}>
                  <Avatar
                    size="middle"
                    icon={<BellOutlined />}
                    style={{
                      cursor: "pointer",
                    }}
                  />
                </Badge>
              </Popover> */}

              <Dropdown
                menu={{
                  items: [
                    {
                      label: (
                        <>
                          <Typography.Title level={5} style={{ margin: "0px" }}>
                            {profile?.name}
                          </Typography.Title>
                          <Typography.Text type="secondary">
                            {profile?.email}
                          </Typography.Text>
                        </>
                      ),
                    },
                    {
                      type: "divider",
                    },
                    {
                      label: (
                        <Button
                          ghost={true}
                          type="secondary"
                          onClick={() => {
                            navigate("/account-information");
                          }}
                        >
                          {t("layout.editProfile")}
                        </Button>
                      ),
                      key: "2",
                      title: t("layout.editProfile"),
                      icon: <UserOutlined />,
                    },
                    {
                      label: (
                        <Button
                          ghost={true}
                          type="secondary"
                          onClick={() => {
                            navigate("/session");
                          }}
                        >
                          {t("Session")}
                        </Button>
                      ),
                      key: "3",
                      title: t("Session "),
                      icon: <LaptopOutlined />,
                    },
                    {
                      label: (
                        <Button
                          ghost={true}
                          type="secondary"
                          onClick={() => setShowSetPineModal(true)}
                        >
                          {t("Security ")}
                        </Button>
                      ),
                      key: "4",
                      title: t("Security "),
                      icon: <LockOutlined />,
                    },
                    {
                      label: (
                        <Button
                          ghost={true}
                          type="secondary"
                          onClick={() => {
                            dispatch(logout());
                            navigate("/login");
                          }}
                        >
                          {t("layout.logOut")}
                        </Button>
                      ),

                      key: "5",
                      title: t("layout.logOut"),
                      icon: <LogoutOutlined />,
                    },
                  ],
                }}
                placement="bottomRight"
                arrow={{
                  pointAtCenter: true,
                }}
              >
                <Avatar
                  size="middle"
                  gap="middle"
                  src={getMediaPath(profile?.profile)}
                  style={{
                    cursor: "pointer",
                  }}
                />
              </Dropdown>
            </Space>
          }
        />
      </Header>
    </>
  );
};
export default HeaderUI;
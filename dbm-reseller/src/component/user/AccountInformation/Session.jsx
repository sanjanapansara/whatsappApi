import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row, Spin, Typography, Modal, notification } from "antd";
import {
  WindowsOutlined,
  MobileOutlined,
  LogoutOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { sessionAll, sessionLogout } from "./SessionApi";
const { Title, Text } = Typography;

const Session = () => {
  const [sessionData, setSessionData] = useState([]);
  const [loadingButton, setButtonLoading] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    sessionDevices();
  }, []);

  const sessionDevices = async () => {
    try {
      setLoading(true);
      const data = await sessionAll({ status: "all" });
      if (data.status) {
        setSessionData(data.sessions);
      }
    } catch (error) {
      notification.error({ message: "Error", description: "Failed to fetch session data." });
      console.error("Error fetching session devices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionLogout = (id) => {
    Modal.confirm({
      title: "Confirm Logout",
      icon: <InfoCircleOutlined />,
      content: "Are you sure you want to log out from this session?",
      onOk: async () => {
        setButtonLoading((prev) => ({ ...prev, [id]: true }));
        try {
          const data = await sessionLogout({ session_id: id });
          if (data?.status) {
            notification.success({
              message: "Success",
              description: "Session logged out successfully.",
            });
            await sessionDevices();
          }
        } catch (error) {
          notification.error({
            message: "Error",
            description: "Failed to log out session.",
          });
          console.error("Error logging out session devices:", error);
        } finally {
          setButtonLoading((prev) => ({ ...prev, [id]: false }));
        }
      },
    });
  };

  const renderSessions = (sessions, icon, color, title) => (
    <Card
      bordered
      style={{
        marginBottom: "24px",
      }}
    >
      <Row gutter={[16, 24]} align="middle" style={{ marginBottom: 16 }}>
        <Col>
          {React.cloneElement(icon, { style: { fontSize: "28px", color } })}
        </Col>
        <Col>
          <Title level={4} style={{ margin: 0 }}>
            {sessions?.length} {title}
          </Title>
        </Col>
      </Row>
      <div
        style={{
          maxHeight: "450px",
          overflowY: "auto",
          padding: "1rem",
        }}
      >
        {sessions?.map((item) => (
          <div
            key={item._id}
            style={{
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "12px",
              border: "1px solid #ebebeb",
              transition: "box-shadow 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            <Row justify="space-between" align="middle">
              <Col>
                <Text strong style={{ display: "block", fontSize: "16px" }}>
                  {item?.info?.os?.name || "Unknown OS"}
                </Text>
                <Text type="secondary" style={{ fontSize: "14px" }}>
                  {item?.info?.client?.name || "Unknown Browser"}
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Last Active:{" "}
                  {item?.createdAt
                    ? new Date(item.createdAt).toLocaleString()
                    : "N/A"}
                </Text>
              </Col>
              <Col>
                {!item?.logout ? (
                  <Button
                    type="primary"
                    icon={<LogoutOutlined />}
                    loading={loadingButton[item._id]}
                    onClick={() => handleSessionLogout(item._id)}
                  >
                    Logout
                  </Button>
                ) : (
                  <Text type="secondary">Signed Out</Text>
                )}
              </Col>
            </Row>
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <React.Fragment>
      {loading ? (
        <Col
          style={{
            height: "50vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin spinning={loading} />
        </Col>
      ) : (
        <Row
          gutter={[16, 24]}
          style={{
            padding: "20px",
            minHeight: "57vh",
          }}
        >
          <Col xs={24} md={12}>
            {renderSessions(
              sessionData?.filter((item) => item?.info?.os?.name?.toLowerCase() === "windows"),
              <WindowsOutlined />,
              "#52c41a",
              "Windows Sessions"
            )}
          </Col>
          <Col xs={24} md={12}>
            {renderSessions(
              sessionData?.filter((item) => item?.info?.os?.name?.toLowerCase() === "android"),
              <MobileOutlined />,
              "#faad14",
              "Android Sessions"
            )}
          </Col>
        </Row>
      )}
    </React.Fragment>
  );
};

export default Session;

import { WhatsAppOutlined } from '@ant-design/icons';
import { Avatar, Card, ConfigProvider, List, Typography, Empty } from 'antd';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
const { Text } = Typography;

const WhatsApp = () => {
    const panel = useSelector((state) => state?.setting?.panel);
    const whatsappList = panel?.reseller?.support?.whatsApp || [];
    const isDarkMode = useSelector((state) => state?.app?.theme);

    const handleWhatsAppClick = (phoneNumber) => {
        window.open(`https://wa.me/${phoneNumber}`, "_blank");
    };
    return (
        <ConfigProvider>
            <Card
                style={{
                    width: 300,
                    borderRadius: 12,
                    border: isDarkMode ? "1px solid #333" : "1px solid #e0e0e0",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    backgroundColor: isDarkMode ? "#333" : "#fff",
                }}
            >
                {whatsappList.length > 0 ? (
                    <List
                        itemLayout="horizontal"
                        dataSource={whatsappList}
                        renderItem={(user) => (
                            <List.Item
                                style={{
                                    padding: "10px 10px",
                                    borderRadius: "10px",
                                    marginBottom: 6,
                                    border: "1px solid #e0e0e0",
                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                    cursor: "pointer",
                                    transition: "transform 0.3s, box-shadow 0.3s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(1.02)";
                                    e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "scale(1)";
                                    e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
                                }}
                                onClick={() => handleWhatsAppClick(user?.phone)}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <Avatar
                                            src={user?.avatar || "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"}
                                            size="default"
                                            style={{
                                                backgroundColor: "#1890ff",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </Avatar>
                                    }
                                    title={
                                        <Text style={{ fontSize: "12px", fontWeight: "bold", margin: 0,color: isDarkMode ? "#fff" : "#000" }} ellipsis>
                                            {user?.name || "Unknown User"}
                                        </Text>
                                    }
                                    description={
                                        <Text style={{ fontSize: "10px", color: "#888" }} ellipsis>
                                            {user?.phone || "No phone available"}
                                        </Text>
                                    }
                                />
                                <WhatsAppOutlined
                                    style={{
                                        fontSize: "20px",
                                        color: "green",
                                        transition: "color 0.3s ease",
                                    }}
                                />
                            </List.Item>
                        )}
                    />
                ) : (
                    <Empty
                        description={<Text>No contacts available</Text>}
                        style={{
                            marginTop: 40,
                        }}
                    />
                )}
            </Card>
        </ConfigProvider>
    );
};

export default WhatsApp;

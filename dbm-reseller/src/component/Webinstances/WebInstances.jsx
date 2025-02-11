import React, { useState } from "react";
import {
  Card,
  Table,
  Tabs,
  Input,
  Button,
  Space,
  Tag,
  Pagination,
  Row,
  Col,
  Avatar,
  Typography,
  ConfigProvider,
  Dropdown,
  Menu,
  Modal,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  PlusOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
  PoweroffOutlined,
  MoreOutlined,
  CopyOutlined,
  DeleteOutlined,
  TransactionOutlined,
  FolderOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const WebInstance = () => {
  const navigate = useNavigate();
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);

  const showModal2 = () => {
    setIsModalOpen2(true);
  };

  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };

  const handleOk2 = () => {
    setIsModalOpen2(false);
  };

  const showModal3 = () => {
    setIsModalOpen3(true);
  };

  const handleCancel3 = () => {
    setIsModalOpen3(false);
  };

  const handleOk3 = () => {
    setIsModalOpen3(false);
  };

  const data2 = [
    {
      title: "Total web instances",
      count: 1,
      description: "Total web instances being executed",
      icon: <DatabaseOutlined style={{ fontSize: 30, color: "#00C0A3" }} />,
      link: "See >",
      bgColor: "#E6FFFB",
    },
    {
      title: "Connected web instances",
      count: 0,
      description: "Total connected web instances",
      icon: <CheckCircleOutlined style={{ fontSize: 30, color: "#52C41A" }} />,
      link: "See >",
      bgColor: "#F6FFED",
    },
    {
      title: "Disconnected web instances",
      count: 1,
      description: "Total disconnected web instances",
      icon: <PoweroffOutlined style={{ fontSize: 30, color: "#FF4D4F" }} />,
      link: "See >",
      bgColor: "#FFF2F0",
    },
  ];

  // const dataSource = [
  //   {
  //     key: "1",
  //     name: "01D6D6F43E7BAAE7FBE28190",
  //     type: "Pagar.Me",
  //     id: "3D9065C1223090EC9BDE0A...",
  //     token: "01D6D6F43E7BAAE7FBE28190",
  //     status: "Disconnected",
  //     dueDate: "-",
  //     payment: "Pending",
  //   },
  //   {
  //     key: "2",
  //     name: "My number",
  //     type: "Pagar.Me",
  //     id: "3D9061EA825EF0EC4B950A...",
  //     token: "76122851D206B4880B20D76B",
  //     status: "Disconnected",
  //     dueDate: "02/12/2024",
  //     payment: "Trial",
  //   },
  // ];

  const dataSource = Array.from({
    length: 100,
  }).map((_, i) => ({
    key: i,
    name: "01D6D6F43E7BAAE7FBE28190",
      type: "Pagar.Me",
      id: "3D9065C1223090EC9BDE0A...",
      token: "01D6D6F43E7BAAE7FBE28190",
      status: "Disconnected",
      dueDate: "-",
      payment: "Pending",
  }));

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => (
        <Space>
          {text} <Button type="link" icon={<CopyOutlined />} />
        </Space>
      ),
    },
    {
      title: "Token",
      dataIndex: "token",
      key: "token",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Connected" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
    },
    {
      title: "Payment",
      dataIndex: "payment",
      key: "payment",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: () => (
        <Dropdown overlay={menu2} trigger={["click"]} placement="bottomRight">
          <MoreOutlined
            style={{ fontSize: "25px", cursor: "pointer" }}
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
        // <Button icon={<MoreOutlined onClick={() => navigate("/payment")} />} />
      ),
    },
  ];

  const menu2 = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <Text
              onClick={(e) => {
                e.stopPropagation(); // Stop row click event
                navigate("/webpaymentlist");
              }}
            >
              <Space>
                <FolderOutlined style={{ fontSize: "18px" }} />
                Payment
              </Space>
            </Text>
          ),
        },
        {
          key: "2",
          label: (
            <Text disabled>
              <Space>
                <PrinterOutlined style={{ fontSize: "18px" }} />
                Print Receipt
              </Space>
            </Text>
          ),
        },
        {
          key: "3",
          label: (
            <Text onClick={(e) => {
              e.stopPropagation();
              showModal3();
            }}>
              <Space>
                <TransactionOutlined style={{ fontSize: "18px" }} />
                Migrate instance
              </Space>
            </Text>
          ),
        },
        {
          key: "4",
          label: (
            <Text onClick={(e) => {
              e.stopPropagation();
              showModal2();
            }}>
              <Space>
                <DeleteOutlined style={{ fontSize: "18px" }} />
                Delete
              </Space>
            </Text>
          ),
        },
      ]}
    />
  );

  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: <Text>Download CSV</Text>,
        },
      ]}
    />
  );
  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Tabs: {
              lineWidth: 2,
              colorBorderSecondary: "rgb(217,217,217)",
              inkBarColor: "rgb(82,196,26)",
              itemSelectedColor: "rgb(82,196,26)",
            },
          },
        }}
      >
        <Row gutter={[16, 16]}>
          {data2.map((item, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <Card
                style={{
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                }}
                bodyStyle={{ padding: "20px" }}
              >
                <Row align="middle" gutter={16} justify="space-between">
                  <Col>
                    <Title
                      level={5}
                      style={{ textAlign: "justify", margin: "0px" }}
                    >
                      {item.title}
                    </Title>
                    <Title
                      level={2}
                      style={{ margin: 0, textAlign: "justify" }}
                    >
                      {item.count}
                    </Title>
                    <Text type="secondary">{item.description}</Text>
                  </Col>
                  <Col>
                    <Avatar
                      shape="square"
                      size={70}
                      style={{
                        backgroundColor: item.bgColor,
                        color: "#f56a00",
                      }}
                    >
                      {item.icon}
                    </Avatar>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
        <br />
        <Row align="middle" gutter={[16, 16]}>
          <Col xs={24} sm={8} md={15}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="All" key="1" />
              <TabPane tab="Connected" key="2" />
              <TabPane tab="Disconnected" key="3" />
            </Tabs>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Input placeholder="Search here..." prefix={<SearchOutlined />} />
          </Col>
          <Col xs={24} sm={8} md={2}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/webinstanceView")}
            >
              Add
            </Button>
          </Col>
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
            <MoreOutlined
              style={{ fontSize: "25px", cursor: "pointer" }}
              onClick={(e) => e.preventDefault()}
            />
          </Dropdown>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              style={{ cursor: "pointer" }}
              dataSource={dataSource}
              columns={columns}
              pagination={{
                pageSize: 10,
              }}
              scroll={{
                x: "max-content",
              }}
              onRow={() => ({
                onClick: () => navigate("/webinstancedata"),
              })}
            />
          </Col>
        </Row>
      
      </ConfigProvider>

      <Modal
        title=""
        open={isModalOpen2}
        onOk={handleOk2}
        onCancel={handleCancel2}
        okText="Confirm"
        cancelText="Cancel"
        centered
        width={500}
        footer={[
          <Button key="back" onClick={handleCancel2}>
            Cancel
          </Button>,
        ]}
      >
        <Row
          justify="center"
          align="middle"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <DeleteOutlined style={{ fontSize: "24px" }} />
          <Row>
            <Text style={{ color: "#00ac5a" }}>
              Do you really wish to cancel?
            </Text>
          </Row>
          <Text>
            The web instance will be deleted, but the subscription will not be
            refunded, remaining active until expiration.
          </Text>
          <Text>Type to continue confirm cancelation In the field below</Text>
          <Input
            placeholder="Type here a confirmation text"
            style={{ width: "70%" }}
          />
          <Row>
            <Col md={24}>
              <Button type="primary" block style={{ width: "150px" }}>
                Delete
              </Button>
            </Col>
          </Row>
        </Row>
      </Modal>

      <Modal
        title=""
        open={isModalOpen3}
        onOk={handleOk3}
        onCancel={handleCancel3}
        okText="Confirm"
        cancelText="Cancel"
        centered
        width={500}
        footer={[
          <Button key="back" onClick={handleCancel3}>
            Cancel
          </Button>,
        ]}
      >
        <Row
          justify="center"
          align="middle"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <DeleteOutlined style={{ fontSize: "24px" }} />
          <Row>
            <Text style={{ color: "#00ac5a" }}>
              Do you really want to migrate this instance?
            </Text>
          </Row>
          <Text>
            Upon confirmation, the instance will be automatically disconnected
            and migrated to a mobile instance
          </Text>
          <Text>To continue type migrate to mobile in the field below</Text>
          <Input
            placeholder="Type here a confirmation text"
            style={{ width: "70%" }}
          />
          <Row>
            <Col md={24}>
              <Button type="primary" block style={{ width: "150px" }}>
                Delete
              </Button>
            </Col>
          </Row>
        </Row>
      </Modal>
    </>
  );
};

export default WebInstance;

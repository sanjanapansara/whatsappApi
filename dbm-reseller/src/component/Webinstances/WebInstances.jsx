import React, { useEffect, useMemo, useState } from "react";
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
  Form,
  Radio,
  Modal,
  Flex,
  Badge,
  Select,
  DatePicker,
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
  RedoOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  DownloadOutlined,
  EditOutlined,
  FileProtectOutlined,
  RightCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;
import countryCodes from "country-codes-list";

import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import { useDispatch } from "react-redux";
// import { Search } from "@ant-design/pro-components";
const { Search, TextArea } = Input;

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const names = [
  "John",
  "Alice",
  "Emma",
  "Robert",
  "Olivia",
  "Michael",
  "Sophia",
  "Daniel",
  "Emily",
  "David",
  "Ella",
  "James",
  "Ava",
  "William",
  "Mia",
  "Henry",
  "Amelia",
  "Alexander",
  "Isabella",
  "Lucas",
];
const dataSource = Array.from({ length: 100 }).map((_, i) => ({
  key: i,
  name: names[Math.floor(Math.random() * names.length)], // Random name from the list
  status: i < 20 ? "Active" : "Expire",
  sn: i + 1,
  id: "3D9065C1223090EC9BDE0A...",
  token: "01D6D6F43E7BAAE7FBE28190",
  instancesstatus: i < 20 ? "Connected" : "Disconnected", // First 20 as "Connected"
  activeat: "8 Feb 2025, 3:01 PM",
  expireat: "11 Feb 2025, 3:01 PM",
}));

const WebInstance = ({ isLogin }) => {
  const dispatch = useDispatch();

  console.log("isLogin", isLogin);
  const [formTrial] = Form.useForm(); // Initialize form instance

  const navigate = useNavigate();
  const [countryList, setCountryList] = useState([]);

  const [filteredData, setFilteredData] = useState(dataSource);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("create_at");
  //Filter
  const [filterType, setFilterType] = useState("all-time"); // Default value is 'specific'
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [country, setCountry] = useState("all");
  const [status, setStatus] = useState("all");
  const [renew, setRenew] = useState("all");
  const [isApplyFilter, setIsApplyFilter] = useState(false);
  //pagination
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    if (status === "all") {
      setFilteredData(dataSource);
    } else {
      setFilteredData(
        dataSource.filter(
          (item) => item.instancesstatus.toLowerCase() === status
        )
      );
    }
  };
  console.log("table data-->", dataSource);

  useEffect(() => {
    const cList = countryCodes.all();
    setCountryList(cList);
  }, [dispatch]);

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

  const resetFilterParameters = () => {
    setSearch("");
    setIsApplyFilter(false);
    setSortBy(t("create_at"));
    setFilterType("all-time");
    setStartDate(null);
    setEndDate(null);
    setCountry(t("all"));
    setStatus(t("all"));
    setRenew(t("all"));
    setPage(1);
    setPageSize(10);
    setShowFilterModal(false);
  };

  const sortByItems = [
    {
      key: "1",
      label: t("sortbyName"),
      value: "name",
    },
    {
      key: "2",
      label: t("sortbyEmail"),
      value: "email",
    },
    {
      key: "3",
      label: t("sortbyPhoneNumber"),
      value: "phone",
    },
    {
      key: "4",
      label: t("sortbyActivate"),
      value: "active_at",
    },
    {
      key: "5",
      label: t("sortbyExpireAt"),
      value: "expire_at",
    },
    {
      key: "6",
      label: t("sortbyCreateAt"),
      value: "create_at",
    },
  ];

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

  const isFilterApply = useMemo(() => {
    // return (
    //   isApplyFilter &&
    //   !(
    //     filterType == "all-time" &&
    //     country == "all" &&
    //     status == "all" &&
    //     renew == "all"
    //   )
    // );
  }, []);

  const columns = [
    {
      title: "SN",
      dataIndex: "sn",
      key: "sn",
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
      title: "Name",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Token",
      dataIndex: "token",
      key: "token",
      render: (text) => (
        <Space>
          {text} <Button type="link" icon={<CopyOutlined />} />
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Instances Status",
      dataIndex: "instancesstatus",
      key: "instancesstatus",
      render: (status) => (
        <Tag color={status === "Connected" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Active At",
      dataIndex: "activeat",
      key: "activeat",
    },
    {
      title: "Expire At",
      dataIndex: "expireat",
      key: "expireat",
    },

    {
      title: "Actions",
      dataIndex: "actions",
      fixed: "right",
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
                navigate("/webpayment-list");
              }}
            >
              <Space>
                <EditOutlined style={{ fontSize: "18px" }} />
                Edit
              </Space>
            </Text>
          ),
        },
        {
          key: "2",
          label: (
            <Text disabled={isLogin === false}>
              <Space>
                <PrinterOutlined style={{ fontSize: "18px" }} />
                Log Out
              </Space>
            </Text>
          ),
        },
        {
          key: "3",
          label: (
            <Text
              disabled={isLogin === true}
              onClick={(e) => {
                e.stopPropagation();
                showModal3();
              }}
            >
              <Space>
                <TransactionOutlined style={{ fontSize: "18px" }} />
                Log in
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
        <Card>
          <Row gutter={[16, 24]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={10} xxl={10}>
              <Flex gap="small" justify="space-evenly">
                <Button
                  type={statusFilter == "all" ? "primary" : "default"}
                  onClick={() => {
                    // setStatusFilter("all"),
                    handleFilterChange("all");
                  }}
                  block
                >
                  {t("All")}
                </Button>
                <Button
                  type={statusFilter == "connected" ? "primary" : "default"}
                  onClick={() => handleFilterChange("connected")}
                  block
                >
                  {t("Connected")}
                </Button>
                <Button
                  type={statusFilter == "disconnected" ? "primary" : "default"}
                  onClick={() => {
                    handleFilterChange("disconnected");
                  }}
                  block
                >
                  {t("Disconnected")}
                </Button>
              </Flex>
            </Col>

            <Col xs={0} sm={0} md={0} lg={0} xl={8} xxl={8}></Col>

            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={6}
              xxl={6}
              style={{ marginBottom: 10 }}
            >
              <Flex gap="small" justify="space-evenly">
                <Button
                  type={statusFilter == "claim trial" ? "primary" : "default"}
                  onClick={() => setStatusFilter("available")}
                  icon={<CheckCircleOutlined />}
                  block
                >
                  {t("Claim trial")}
                </Button>
                <Button
                  type={statusFilter == "add" ? "primary" : "default"}
                  onClick={() => setStatusFilter("active")}
                  block
                  icon={<PlusOutlined />}
                >
                  {t("Add")}
                </Button>
                {/* <Button
                  type={statusFilter == "expired" ? "primary" : "default"}
                  // onClick={() => setStatusFilter("expired")}
                  block
                >
                  {t("expired")}
                </Button>
                <Button
                  type={statusFilter == "renew" ? "primary" : "default"}
                  // onClick={() => setStatusFilter("renew")}
                  block
                >
                  {t("renew")}
                </Button> */}
              </Flex>
            </Col>
          </Row>

          <Row gutter={[16, 24]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={10} xxl={10}>
              {/* <Search
                placeholder={t("search")}
                enterButton={<SearchOutlined />}
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              // size="small"
              /> */}
              {/* <Input placeholder="default size" prefix={<SearchOutlined />} /> */}
              <Search
                placeholder={t("search")}
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                enterButton
                // size="large"
              />
            </Col>

            <Col xs={0} sm={0} md={0} lg={0} xl={4} xxl={4}></Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={10} xxl={10}>
              <Flex align="end" gap="small" justify="space-evenly">
                <Button
                  block
                  onClick={() => {
                    resetFilterParameters();
                  }}
                >
                  <RedoOutlined /> {t("reset")}
                </Button>
                <Badge dot={isFilterApply} color="blue">
                  <Button
                    onClick={() => {
                      setShowFilterModal(true);
                    }}
                    block
                  >
                    <FilterOutlined /> {t("filter")}
                  </Button>
                </Badge>

                <Select
                  value={sortBy}
                  optionFilterProp="children"
                  menuItemSelectedIcon={<SortAscendingOutlined />}
                  onChange={(value) => setSortBy(value)}
                  options={sortByItems}
                  block
                />

                <Button
                  type={"primary"}
                  // onClick={() => onExport()}
                  block
                >
                  <DownloadOutlined /> {t("export")}
                </Button>
              </Flex>
            </Col>
          </Row>
        </Card>
        <br />
        <Card>
          <Table
            size="small"
            // scroll={{ x: 1200 }}
            style={{ cursor: "pointer" }}
            dataSource={filteredData}
            columns={columns}
            pagination={{
              pageSize: 10,
            }}
            scroll={{
              x: "max-content",
            }}
            onRow={() => ({
              onClick: () => navigate("/webinstance-data"),
            })}
          />
        </Card>
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

      <Modal
        title={t("filterLicenses")}
        open={showFilterModal}
        centered
        onCancel={() => resetFilterParameters(false)}
        okText={t("apply")}
        onOk={() => {
          setShowFilterModal(false);
          setIsApplyFilter(true);
        }}
      >
        <Form layout="vertical">
          <Form.Item>
            <Radio.Group
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <Radio value={"all-time"}>{t("activities.allTime")}</Radio>

              <Radio value={"specific"}>{t("specificTime")}</Radio>
            </Radio.Group>
          </Form.Item>

          {filterType == "specific" && (
            <Form.Item label={t("filterbyDate")}>
              <RangePicker
                maxDate={dayjs()}
                style={{
                  width: "100%",
                }}
                // onChange={(dates) => {
                //   const [start, end] = dates;
                //   setStartDate(start); // Update startDate state
                //   setEndDate(end); // Update endDate state
                // }}
              />
            </Form.Item>
          )}

          {/* Country filter */}
          <Form.Item label={t("filterbyCountry")}>
            <Select
              showSearch
              placeholder={t("select")}
              value={country}
              defaultValue={country}
              onChange={(value) => setCountry(value)}
              optionFilterProp="children"
            >
              <Select.Option key={"all"} value={"all"}>
                {t("allCountries")}
              </Select.Option>

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

          <Form.Item label={t("filterbyStatus")}>
            <Select
              value={status}
              onChange={(status) => {
                setStatus(status);
              }}
            >
              <Option value="all">{t("all")}</Option>
              <Option value="enable">{t("enable")}</Option>
              <Option value="disable">{t("disable")}</Option>
            </Select>
          </Form.Item>

          <Form.Item label={t("filterbyRenewal")}>
            <Select
              value={renew}
              // onChange={(renew) => {
              //   setRenew(renew);
              // }}
            >
              <Option value="all">{t("all")}</Option>
              <Option value="yes">{t("yes")}</Option>
              <Option value="no">{t("no")}</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default WebInstance;

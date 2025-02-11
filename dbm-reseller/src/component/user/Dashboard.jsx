import {
  PieChart,
  Pie,
  Cell,
  Sector,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  Button,
  Flex,
  Space,
  Row,
  Col,
  Card,
  Typography,
  Avatar,
  Table,
  Modal,
  Image,
  Form,
} from "antd";
import {
  CaretUpOutlined,
  CaretDownOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";

import React, { useState, useEffect } from "react";
import key from "../image/key.png";
import axiosInstance from "../../util/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { t } from "i18next";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  // getActivationChartData,
  // getLicenseChartData,
  getStatistics,
} from "../../redux/action.jsx";
import moment from "moment";
// import randomColor from 'randomcolor';
// import { setCloseOffer, setIsOffer } from "../../redux/reducers/reducer.app.jsx";

const { Text, Title } = Typography;

const legendData = [
  { title: t("dashboard.availableKeys"), value: 420 },
  { title: t("dashboard.activeKeys"), value: 240 },
  { title: t("dashboard.renewalKeys"), value: 190 },
  { title: t("dashboard.expiredKeys"), value: 150 },
];

const RADIAN = Math.PI / 180;
const renderActiveShape = (props, activeIndex, isDarkMode) => {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";
  let textContent;
  if (activeIndex === 0) {
    textContent = t("available");
  } else if (activeIndex === 1) {
    textContent = t("active");
  } else if (activeIndex === 2) {
    textContent = t("renew");
  } else {
    textContent = t("expired");
  }

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.title}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill={isDarkMode ? "#fff" : "#000"}
      >
        {textContent}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${t("dashboard.rate")} ${(percent * 100)?.toFixed(2)}%)`}
      </text>
    </g>
  );
};

const DashBoard = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const statistics = useSelector((state) => state.app.statistics);
  const licenseChartData = useSelector((state) => state.app.chart.license);
  const activationChartData = useSelector(
    (state) => state.app.chart.activation
  );
  const isDarkMode = useSelector((state) => state?.app?.theme);
  // const isOffer = useSelector((state) => state?.app?.isOffer);
  // const isCloseOffer = useSelector((state) => state?.app?.isCloseOffer);
  // const [offerBanner, setOfferBanner] = useState(true);

  const FILTER = [
    { label: <span>{t("today")}</span>, value: "today" },
    { label: <span>{t("week")}</span>, value: "week" },
    {
      label: <span>{t("month")}</span>,
      value: "month",
    },
    { label: <span>{t("year")}</span>, value: "year" },
  ];

  const [period1, setPeriod1] = useState("today");
  const [period2, setPeriod2] = useState("today");

  const [customers, setCustomers] = useState([]);

  const [pieActiveIndex, setPieActiveIndex] = useState(0);

  const COLORS = ["#F1C40F", "#884EA0", "#DC7633", "#1E8449"];

  const getCustomers = async () => {
    try {
      const { data } = await axiosInstance.post("reseller/customers", {
        page: 0,
        limit: 5,
      });

      if (data.status) {
        setCustomers(data.customers);
      }
    } catch (e) {
      console.log("getCustomers Error:", e);
    }
  };

  // const handleClose = () => {
  //   dispatch(setCloseOffer(true))
  //   dispatch(setIsOffer(true));
  //   setOfferBanner(false);
  // };
  // console.log("isCloseOffer", isCloseOffer)
  useEffect(() => {
    // if (isCloseOffer) {
    //   dispatch(setIsOffer(false))
    // }else {
    //   dispatch(setIsOffer(true))
    // }
    dispatch(getStatistics());
    // dispatch(getLicenseChartData(period1));
    // dispatch(getActivationChartData(period2));
    // getCustomers();
  }, [dispatch, period1, period2]);

  const [activeTab, setActiveTab] = useState("sent");
  const [instance, setInstance] = useState("web");
  const data2 = [
    {
      title: `Total ${
        instance === "web" ? "web instances" : "Mobile instances"
      }`,
      count: 1,
      description: `Total ${
        instance === "web" ? "web instances" : "Mobile instances"
      } being executed`,
      icon: <DatabaseOutlined style={{ fontSize: 30, color: "#00C0A3" }} />,
      link: "See >",
      bgColor: "#E6FFFB",
    },
    {
      title: `Connected ${
        instance === "web" ? "web instances" : "Mobile instances"
      }`,
      count: 0,
      description: `Total connected ${
        instance === "web" ? "web instances" : "Mobile instances"
      }`,
      icon: <CheckCircleOutlined style={{ fontSize: 30, color: "#52C41A" }} />,
      link: "See >",
      bgColor: "#F6FFED",
    },
    {
      title: `Disconnected ${
        instance === "web" ? "web instances" : "Mobile instances"
      }`,
      count: 1,
      description: `Total disconnected ${
        instance === "web" ? "web instances" : "Mobile instances"
      }`,
      icon: <PoweroffOutlined style={{ fontSize: 30, color: "#FF4D4F" }} />,
      link: "See >",
      bgColor: "#FFF2F0",
    },
  ];
  const options = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Menu",
      value: "menu",
    },
  ];
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];
  const messagedata = [
    { label: "Texts", count: 0 },
    { label: "Buttons", count: 0 },
    { label: "Links", count: 0 },
    { label: "Options", count: 0 },
    { label: "Documents", count: 0 },
    { label: "Audios", count: 0 },
    { label: "Videos", count: 0 },
    { label: "Contacts", count: 0 },
    { label: "Images", count: 0 },
    { label: "Location", count: 0 },
    { label: "Stickers", count: 0 },
  ];

  return (
    <React.Fragment>
      <Card>
        {/* <Typography.Title style={{ margin: "0px" }} level={5}>
          {t("dashboard.statistics")}
        </Typography.Title>
        <br /> */}
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Flex gap={10}>
              <Button
                type={instance === "web" ? "primary" : "default"}
                onClick={() => setInstance("web")}
                block
                // style={{
                //   backgroundColor: instance === "web" ? "#00C0A3" : undefined,
                // }}
              >
                Web Instance
              </Button>
              <Button
                type={instance === "mobile" ? "primary" : "default"}
                onClick={() => setInstance("mobile")}
                block
                // style={{
                //   backgroundColor:
                //     instance === "mobile" ? "#00C0A3" : undefined,
                // }}
              >
                Mobile Instance
              </Button>
            </Flex>
          </Col>
          <Col>
            <Text strong>Latest update : {moment().format("llll")} </Text>
          </Col>
        </Row>
        <br />
        <Row gutter={[16, 16]}>
          {data2.map((item, index) => (
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={8}
              key={index}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Card
                style={{
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                }}
                bodyStyle={{ padding: "10px 20px 10px 20px" }}
              >
                <Row align="middle" gutter={16} justify="space-between">
                  <Col>
                    <Title
                      level={5}
                      style={{ textAlign: "justify", margin: 0 }}
                    >
                      {item.title}345
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
                      size={50}
                      style={{
                        backgroundColor: item.bgColor,
                        color: "#f56a00",
                      }}
                    >
                      {item.icon}
                    </Avatar>
                  </Col>
                </Row>
                <div style={{ textAlign: "right", marginTop: "0px" }}>
                  <a
                    href={
                      instance === "web" ? "/webinstances" : "/mobileInstances"
                    }
                  >
                    {item.link}
                  </a>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
      <br />
      <Card>
        <Row gutter={[16, 24]}>
          <Col xs={24} sm={24} md={24} xl={16} xxl={16}>
            <Card bodyStyle={{ padding: "10px" }}>
              <Form.Item
                label={
                  instance === "web" ? "web instances" : "Mobile instances"
                }
                layout="vertical"
                style={{ marginBottom: "0px" }}
              >
                <Select
                  style={{
                    width: "100%",
                    textAlign: "left",
                  }}
                  placeholder="select one country"
                  defaultValue={["all"]}
                  onChange={handleChange}
                  options={options}
                />
              </Form.Item>
            </Card>
          </Col>
          <Col
            xs={12}
            sm={12}
            md={12}
            xl={4}
            xxl={4}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Card
              bodyStyle={{ padding: "10px" }}
              style={{
                backgroundColor: "#DAF7A6",
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Title level={5} style={{ margin: "5px", flex: 1 }}>
                Total sent
              </Title>
              <Title level={5} style={{ margin: "5px" }}>
                0
              </Title>
            </Card>
          </Col>

          <Col xs={12} sm={12} md={12} xl={4} xxl={4}>
            <Card
              style={{ backgroundColor: "#FFC300 " }}
              bodyStyle={{ padding: "10px" }}
            >
              <Title level={5} style={{ margin: "5px" }}>
                Total received
              </Title>

              <Title
                level={5}
                style={{ margin: "5px" }}
                bodyStyle={{ padding: "10px" }}
              >
                0
              </Title>
            </Card>
          </Col>
        </Row>
      </Card>
      <br />
      <Card>
      <Row gutter={[16, 24]}>
        <Col md={24} xl={16}>
          <Card bodyStyle={{ paddingBottom: "5px" }}>
            <Flex justify="space-between">
              <Text level={4} style={{ margin: "0px" }}>
                {" "}
                Total received/sent in the last month
              </Text>
              <Form.Item label="Period">
                <Select
                  defaultValue="this_month"
                  style={{
                    width: 200,
                    textAlign: "left",
                  }}
                  onChange={handleChange}
                  options={[
                    {
                      value: "this_month",
                      label: "this_month",
                    },
                    {
                      value: "last_month",
                      label: "last_month",
                    },
                    {
                      value: "yesterday",
                      label: "yesterday",
                    },
                    {
                      value: "today",
                      label: "today",
                    },
                  ]}
                />
              </Form.Item>
            </Flex>

            <ResponsiveContainer width={"100%"} height={400}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="pv"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col md={24} xl={8}>
          <Card bodyStyle={{ paddingBottom: "5px" }}>
            <Row
              justify="space-between"
              align="middle"
              style={{ marginBottom: "20px" }}
              gutter={[16, 16]}
            >
              <Col xs={24} sm={13} md={13} xl={24} xxl={10}>
                <Title level={5} style={{ margin: 0, textAlign: "justify" }}>
                  Messages {activeTab === "sent" ? "Sent" : "Received"}
                </Title>
              </Col>
              <Col xs={24} sm={11} md={11} xl={24} xxl={14}>
                <Flex gap={10}>
                  <Button
                    type={activeTab === "sent" ? "primary" : "default"}
                    onClick={() => setActiveTab("sent")}
                    block
                    // style={{
                    //   backgroundColor:
                    //     activeTab === "sent" ? "#00C0A3" : undefined,
                    // }}
                  >
                    Sent
                  </Button>
                  <Button
                    block
                    type={activeTab === "received" ? "primary" : "default"}
                    onClick={() => setActiveTab("received")}
                    // style={{
                    //   backgroundColor:
                    //     activeTab === "received" ? "#00C0A3" : undefined,
                    // }}
                  >
                    Received
                  </Button>
                </Flex>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              {messagedata.map((item, index) => (
                <Col span={24} key={index}>
                  <Row justify="space-between">
                    <Col>
                      <Text>{item.label}</Text>
                    </Col>
                    <Col>
                      <Text strong style={{ color: "#00C0A3" }}>
                        {item.count}
                      </Text>
                    </Col>
                  </Row>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
      </Card>
      {/* <Typography.Title style={{ margin: "0px" }} level={4}>
        {t("dashboard.reports")}
      </Typography.Title>
      <Row gutter={(16, 24)}>
        <Col
          xs={24}
          sm={24}
          md={12}
          lg={12}
          xl={12}
          xxl={12}
          style={{ marginTop: "20px" }}
        >
          <Card style={{ width: "100%" }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Typography.Title style={{ margin: "0px" }} level={5}>
                  {t("dashboard.licenseKey")}
                </Typography.Title>
              </Col>
              <Col>
                <Select
                  style={{
                    width: 150,
                  }}
                  value={period1}
                  onChange={(value) => setPeriod1(value)}
                  options={FILTER}
                />
              </Col>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart width={500} height={350}>
                  <Pie
                    activeIndex={pieActiveIndex}
                    activeShape={(props) =>
                      renderActiveShape(props, pieActiveIndex, isDarkMode)
                    }
                    data={licenseChartData ?? []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    labelLine={false}
                    outerRadius={80}
                    fill="#000"
                    dataKey="value"
                  //onMouseEnter={onPieEnter}
                  >
                    {licenseChartData.map((items, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  {legendData?.map((items, index) => (
                    <Legend name={items.title} key={index} />
                  ))}
                </PieChart>
              </ResponsiveContainer>
            </Row>
          </Card>
        </Col>

        <Col
          xs={24}
          sm={24}
          md={12}
          lg={12}
          xl={12}
          xxl={12}
          style={{ marginTop: "20px" }}
        >
          <Card>
            <Row justify="space-between" align="middle">
              <Typography.Title style={{ margin: "0px" }} level={5}>
                {t("dashboard.activation")}
              </Typography.Title>
              {/* <Col> </Col> */}
      {/* <Col>
                <Select
                  style={{
                    width: 150,
                  }}
                  value={period2}
                  onChange={(value) => setPeriod2(value)}
                  options={FILTER}
                />
              </Col>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activationChartData} width={500} height={400}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{ backgroundColor: isDarkMode ? "#333" : "#fff", }}
                    labelStyle={{
                      background: isDarkMode ? "#333" : "#fff",
                      color: isDarkMode ? "#fff" : "#000",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="trial"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    name={t("dashboard.trial")}
                  />
                  <Line
                    type="monotone"
                    dataKey="paid"
                    stroke="#82ca9d"
                    name={t("dashboard.paid")}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Row>
          </Card>
        </Col>
      </Row> */}

      {/* <br /> */}

      {/* <Row gutter={[12, 12]} align="middle">
        <Col xs={24} sm={12} md={12}>
          <Typography.Title style={{ margin: " 0px" }} level={4}>
            {t("dashboard.newCustomer")}
          </Typography.Title>
        </Col>

        <Col xs={24} sm={12} md={12} align={"right"}>
          <Button type="link">
            <Typography.Title style={{ margin: " 0px", color: "" }} level={5}>
              <Link to="/customers">{t("dashboard.viewall")}</Link>
            </Typography.Title>
          </Button>
        </Col>
      </Row>
      <br /> */}
      {/* <Card>
        <Table
          columns={columns}
          dataSource={customers}
          scroll={{ x: 1300, y: 350 }}
          rowKey={(record) => record.id}
        />
      </Card> */}
    </React.Fragment>
  );
};

export default DashBoard;

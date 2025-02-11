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
import { Select, Button, Flex, Space, Row, Col, Card, Typography, Avatar, Table, Modal, Image } from "antd";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";

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
// import randomColor from 'randomcolor';
// import { setCloseOffer, setIsOffer } from "../../redux/reducers/reducer.app.jsx";

const { Text } = Typography;

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
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} >
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
  const activationChartData = useSelector((state) => state.app.chart.activation);
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

  // useEffect(() => {
    // dispatch(getLicenseChartData(period1));
  // }, [period1]);

  // useEffect(() => {
    // dispatch(getActivationChartData(period2));
  // }, [period2]);

  // const columns = [
  //   {
  //     title: t("name"),
  //     dataIndex: "name",
  //     key: "name",
  //     render: (text, record) => {
  //       const avatarColor = randomColor();
  //       const spaceIndex = text.indexOf(" ");
  //       const firstLetter = text.charAt(0);
  //       const letterAfterSpace =
  //         spaceIndex !== -1 && spaceIndex < text.length - 1
  //           ? text.charAt(spaceIndex + 1)
  //           : "";
  //       return (
  //         <Space>
  //           <Avatar style={{ backgroundColor: avatarColor }}>
  //             {firstLetter + letterAfterSpace}
  //           </Avatar>
  //           <p>{record.name}</p>
  //         </Space>
  //       );
  //     },
  //   },
  //   {
  //     title: t("number"),
  //     dataIndex: "number",
  //     key: "number",
  //     render: (text, record) => <Text>{record.phone}</Text>,
  //   },
  //   {
  //     title: t("email"),
  //     dataIndex: "email",
  //     key: "email",
  //   },
  //   {
  //     title: t("city"),
  //     dataIndex: "city",
  //     key: "city",
  //   },
  //   {
  //     title: t("country"),
  //     dataIndex: "country",
  //     key: "country",
  //   },
  // ];

  return (
    <React.Fragment>

      <Card>
        <Typography.Title style={{ margin: "0px" }} level={5}>
          {t("dashboard.statistics")}
        </Typography.Title>
        <br />

        <Row gutter={[16, 24]}>
          <Col xs={24} sm={24} md={6} lg={12} xl={6} xxl={6}>
            <Card
              style={{ backgroundColor: "#915EFE2E" }}
              styles={{ body: { padding: "15px" } }}
            >
              <Row gutter={[16, 24]}>
                <Col xs={12} sm={12} md={9}>
                  <Avatar
                    size={{
                      xs: 55,
                      sm: 55,
                      md: 55,
                      lg: 55,
                      xl: 60,
                      xxl: 70,
                    }}
                    style={{
                      backgroundColor: "#958AF1",
                    }}
                  >
                    <Image src={key} alt="key" />
                  </Avatar>
                </Col>
                <Col sm={12} md={15}>
                  <Flex vertical align="end">
                    <Typography.Title style={{ fontSize: "40px", margin: "0px" }}>
                      {statistics?.total ?? 0}
                    </Typography.Title>
                    <Typography.Title
                      level={5}
                      style={{ margin: "0px" }}
                      type="secondary"
                    >
                      {t("dashboard.totalKeys")}
                    </Typography.Title>
                  </Flex>
                </Col>
              </Row>
              {/* <Row gutter={[16, 24]}>
                <Flex>
                  <CaretUpOutlined
                    style={{
                      fontSize: "20px",
                      color: "#52c41a",
                    }}
                  />
                  <Typography.Title
                    level={5}
                    style={{ fontSize: "15px", margin: "0px" }}
                    type="success"
                  >
                    70.5%
                  </Typography.Title>
                </Flex>
              </Row> */}
            </Card>
          </Col>
          <Col xs={24} sm={24} md={6} lg={12} xl={6} xxl={6}>
            <Card
              style={{ backgroundColor: "#BDDEFF2E", padding: "0px" }}
              styles={{ body: { padding: "15px" } }}
            >
              <Row gutter={[16, 24]}>
                <Col xs={12} sm={12} md={9}>
                  <Avatar
                    size={{
                      xs: 55,
                      sm: 55,
                      md: 55,
                      lg: 55,
                      xl: 60,
                      xxl: 70,
                    }}
                    style={{
                      backgroundColor: "#45A6FF",
                    }}
                  >
                    <Image src={key} alt="key" />
                  </Avatar>
                </Col>
                <Col sm={12} md={15}>
                  <Flex vertical align="end">
                    <Typography.Title style={{ fontSize: "40px", margin: "0px" }}>
                      {statistics?.available ?? 0}
                    </Typography.Title>
                    <Typography.Title
                      level={5}
                      style={{ margin: "0px" }}
                      type="secondary"
                    >
                      {t("dashboard.availableKeys")}
                    </Typography.Title>
                  </Flex>
                </Col>
              </Row>
              {/* <Row gutter={[16, 24]}>
                <Flex>
                  <CaretUpOutlined
                    style={{
                      fontSize: "20px",
                      color: "#52c41a",
                    }}
                  />
                  <Typography.Title
                    level={5}
                    style={{ fontSize: "15px", margin: "0px" }}
                    type="success"
                  >
                    70.5%
                  </Typography.Title>
                </Flex>
              </Row> */}
            </Card>
          </Col>
          <Col xs={24} sm={24} md={6} lg={12} xl={6} xxl={6}>
            <Card
              style={{ backgroundColor: "#E5970014", padding: "0px" }}
              styles={{ body: { padding: "15px" } }}
            >
              <Row gutter={[16, 24]}>
                <Col xs={12} sm={12} md={9}>
                  <Avatar
                    size={{
                      xs: 55,
                      sm: 55,
                      md: 55,
                      lg: 55,
                      xl: 60,
                      xxl: 70,
                    }}
                    style={{
                      backgroundColor: "#E59700",
                    }}
                  >
                    <Image src={key} alt="key" />
                  </Avatar>
                </Col>
                <Col sm={12} md={15}>
                  <Flex vertical align="end">
                    <Typography.Title style={{ fontSize: "40px", margin: "0px" }}>
                      {statistics?.active ?? 0}
                    </Typography.Title>
                    <Typography.Title
                      level={5}
                      style={{ margin: "0px" }}
                      type="secondary"
                    >
                      {t("dashboard.activeKeys")}
                    </Typography.Title>
                  </Flex>
                </Col>
              </Row>
              {/* <Row gutter={[16, 24]}>
                <Flex>
                  <CaretDownOutlined
                    style={{
                      fontSize: "20px",
                      color: "#ff4d4f",
                    }}
                  />
                  <Typography.Title
                    level={5}
                    style={{ margin: "0px" }}
                    type="danger"
                  >
                    70.5%
                  </Typography.Title>
                </Flex>
              </Row> */}
            </Card>
          </Col>
          <Col xs={24} sm={24} md={6} lg={12} xl={6} xxl={6}>
            <Card
              style={{
                backgroundColor: "#ff9bbc",
                padding: "0px",
              }}
              styles={{ body: { padding: "15px" } }}
            >
              <Row gutter={[16, 24]}>
                <Col xs={12} sm={12} md={9}>
                  <Avatar
                    size={{
                      xs: 55,
                      sm: 55,
                      md: 55,
                      lg: 55,
                      xl: 60,
                      xxl: 70,
                    }}
                    style={{
                      backgroundColor: "#F58274",
                    }}
                  >
                    <Image src={key} alt="key" />
                  </Avatar>
                </Col>
                <Col sm={12} md={15}>
                  <Flex vertical align="end">
                    <Typography.Title style={{ fontSize: "40px", margin: "0px" }}>
                      {statistics?.expire ?? 0}
                    </Typography.Title>
                    <Typography.Title
                      level={5}
                      style={{ margin: "0px" }}
                      type="secondary"
                    >
                      {t("dashboard.expiredKeys")}
                    </Typography.Title>
                  </Flex>
                </Col>
              </Row>
              {/* <Row gutter={[16, 24]}>
                <Flex>
                  <CaretDownOutlined
                    style={{
                      fontSize: "20px",
                      color: "#ff4d4f",
                    }}
                  />
                  <Typography.Title
                    level={5}
                    style={{ margin: "0px" }}
                    type="danger"
                  >
                    70.5%
                  </Typography.Title>
                </Flex>
              </Row> */}
            </Card>
          </Col>
          <Col xs={24} sm={24} md={6} lg={12} xl={6} xxl={6}>
            <Card
              style={{ backgroundColor: "#E5970014", padding: "0px" }}
              styles={{ body: { padding: "15px" } }}
            >
              <Row gutter={[16, 24]}>
                <Col xs={12} sm={12} md={9}>
                  <Avatar
                    size={{
                      xs: 55,
                      sm: 55,
                      md: 55,
                      lg: 55,
                      xl: 60,
                      xxl: 70,
                    }}
                    style={{
                      backgroundColor: "#E59700",
                    }}
                  >
                    <Image src={key} alt="key" />
                  </Avatar>
                </Col>
                <Col sm={12} md={15}>
                  <Flex vertical align="end">
                    <Typography.Title style={{ fontSize: "40px", margin: "0px" }}>
                      {statistics?.renew ?? 0}
                    </Typography.Title>
                    <Typography.Title
                      level={5}
                      style={{ margin: "0px" }}
                      type="secondary"
                    >
                      {t("dashboard.renewalKeys")}
                    </Typography.Title>
                  </Flex>
                </Col>
              </Row>
              {/* <Row gutter={[16, 24]}>
                <Flex>
                  <CaretDownOutlined
                    style={{
                      fontSize: "20px",
                      color: "#ff4d4f",
                    }}
                  />
                  <Typography.Title
                    level={5}
                    style={{ margin: "0px" }}
                    type="danger"
                  >
                    70.5%
                  </Typography.Title>
                </Flex>
              </Row> */}
            </Card>
          </Col>
          <Col xs={24} sm={24} md={6} lg={12} xl={6} xxl={6}>
            <Card
              style={{
                backgroundColor: "#ff9bbc",
                padding: "0px",
              }}
              styles={{ body: { padding: "15px" } }}
            >
              <Row gutter={[16, 24]}>
                <Col xs={12} sm={12} md={9}>
                  <Avatar
                    size={{
                      xs: 55,
                      sm: 55,
                      md: 55,
                      lg: 55,
                      xl: 60,
                      xxl: 70,
                    }}
                    style={{
                      backgroundColor: "#F58274",
                    }}
                  >
                    <Image src={key} alt="key" />
                  </Avatar>
                </Col>
                <Col sm={12} md={15}>
                  <Flex vertical align="end">
                    <Typography.Title style={{ fontSize: "40px", margin: "0px" }}>
                      {statistics?.trial ?? 0}
                    </Typography.Title>
                    <Typography.Title
                      level={5}
                      style={{ margin: "0px" }}
                      type="secondary"
                    >
                      {t("dashboard.trialKeys")}
                    </Typography.Title>
                  </Flex>
                </Col>
              </Row>
              {/* <Row gutter={[16, 24]}>
                <Flex>
                  <CaretDownOutlined
                    style={{
                      fontSize: "20px",
                      color: "#ff4d4f",
                    }}
                  />
                  <Typography.Title
                    level={5}
                    style={{ margin: "0px" }}
                    type="danger"
                  >
                    70.5%
                  </Typography.Title>
                </Flex>
              </Row> */}
            </Card>
          </Col>
        </Row>
      </Card>
      <br />

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

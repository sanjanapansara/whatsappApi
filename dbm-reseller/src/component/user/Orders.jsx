import {
  Button,
  Card,
  Col,
  Form,
  Image,
  message,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { Flex, Input, Modal, Radio, Select, DatePicker } from "antd";
import axiosInstance from "../../util/axiosInstance";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { CURRENCIES_SYMBOL, formatDate, getPaymentGatewayImage } from "../../util/common.utils";
import { Link } from "react-router-dom";
import {
  DownloadOutlined,
  FilterOutlined,
  RedoOutlined,
  SearchOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import { exportToExcel } from "react-json-to-excel";
import countryCodes from "country-codes-list";
import { getMediaPath } from "../../lib";
import { useDebounce } from "../../util/useDebounce";
const { Text } = Typography;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

const Orders = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // const rates = useSelector((state) => state?.setting?.currencyRates);
  const currency = useSelector((state) => state.setting.currency);

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterType, setFilterType] = useState("all-time");
  const [country, setCountry] = useState("all");
  const [countryList, setCountryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isApplyFilter, setIsApplyFilter] = useState(false);
  const [status, setStatus] = useState("all");
  const [orders, setOrders] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortBy, setSortBy] = useState("created_at");

  //pagination
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const cList = countryCodes.all();
    setCountryList(cList);
  }, [dispatch]);

  const debounce = useDebounce(search, 700)

  useEffect(() => {
    getAllOrders();
  }, [debounce, dispatch, page, pageSize, isApplyFilter, sortBy]);

  const getAllOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post("order/reseller/all", {
        page: page - 1,
        limit: pageSize,
        search: search,
        sort_by: sortBy,
        filter_by: isApplyFilter
          ? {
            date_type: filterType,
            date: {
              start_date: startDate ? startDate.format("YYYY-MM-DD") : null,
              end_date: endDate ? endDate.format("YYYY-MM-DD") : null,
            },
            country: country,
            status: status,
          }
          : null,
      });
      setLoading(false);
      if (data.status) {
        setOrders(data?.orders);
        setTotal(data?.total);
      } else {
        message.error(data?.message);
      }
    } catch (err) {
      console.log("getAllOrders:", err);
    } finally {
      setLoading(false);
    }
  };

  const orderType = (record) => {
    if (record.type === "buy-product") {
      return <Tag>Products</Tag>;
    } else if (record.type === "pack") {
      return <Tag>Packs</Tag>;
    } else if (record.type === "remove-device") {
      return <Tag>Remove Device</Tag>;
    } else if (record.type === "buy-license-keys") {
      return <Tag>License Keys</Tag>;
    } else if (record.type === "buy-rebranding") {
      return <Tag>Buy Rebranding</Tag>;
    } else {
      return <></>;
    }
  };

  const orderStatus = (record) => {
    if (record?.status === "processing") {
      return (
        <Tag icon={<SyncOutlined spin />} color="processing">
          processing
        </Tag>
      );
    } else if (record?.status === "pending-payment") {
      return (
        <Tag icon={<ExclamationCircleOutlined />} color="warning">
          Pending Payment
        </Tag>
      );
    } else if (record?.status === "failed") {
      return <Tag color="error">Failed</Tag>;
    } else if (record?.status === "on-hold") {
      return (
        <Tag icon={<ExclamationCircleOutlined />} color="warning">
          On Hold
        </Tag>
      );
    } else if (record?.status === "completed") {
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Completed
        </Tag>
      );
    } else if (record?.status === "cancelled") {
      return <Tag color="default">Cancelled</Tag>;
    } else if (record?.status === "refunded") {
      return <Tag color="default">Refunded</Tag>;
    } else {
      return <></>;
    }
  };

  const columns = [
    {
      title: t("sn"),
      dataIndex: "SN",
      key: "SN",
      fixed: "left",
      render: (value, item, index) => (page - 1) * pageSize + (1 + index),
    },
    {
      title: t("orderId"),
      dataIndex: "id",
      key: "id",
      render: (_, record) => (
        <Link to={"/invoice?orderId=" + record.id}>#{record.id}</Link>
      ),
    },
    {
      title: t("type"),
      dataIndex: "type",
      key: "action",
      render: (_, record) => orderType(record),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (_, record) => orderStatus(record),
    },
    {
      title: t("payment"),
      dataIndex: "payment",
      key: "payment",
      render: (_, record) =>
        record?.paymentId?.status == "paid" ? (
          <Tag color="#87d068">PAID</Tag>
        ) : (
          <Tag color="#f50">UNPAID</Tag>
        ),
    },
    {
      title: t("amount"),
      dataIndex: "amount",
      key: "amount",
      render: (_, record) => {
        return <Text>{`${CURRENCIES_SYMBOL[record?.paymentId?.currency]}${record?.total?.toFixed(2)}`}</Text>
      }
    },
    {
      title: t("paymentMethod"),
      dataIndex: "gateway",
      key: "gateway",
      render: (_, record) => (
        <Image
          preview={false}
          src={getPaymentGatewayImage(record?.paymentId?.gateway)}
          alt={record?.paymentId?.gateway}
          width={80}
        />
      ),
    },
    {
      title: t("created"),
      dataIndex: "Created",
      key: "Created",
      render: (_, record) => {
        return <Text>{formatDate(record?.createdAt)}</Text>;
      },
    },
    {
      title: t("action"),
      dataIndex: "action",
      width: 50,
      key: "action",
      render: () => <>Action</>,
    },
  ];
  const resetFilterParameters = () => {
    setSearch("");
    setIsApplyFilter(false);
    setSortBy(t("created_at"));
    setFilterType("all-time");
    setStartDate(null);
    setEndDate(null);
    setPage(1);
    setPageSize(10);
    setShowFilterModal(false);
  };
  const sortByItems = [
    {
      key: "1",
      label: t("sortbyamount"),
      value: "amount",
    },
    {
      key: "2",
      label: t("sortbycreateat"),
      value: "createdAt",
    },
  ];
  const onExport = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post("orders/all", {
        page: 0,
        limit: total,
        search: search,
        sort_by: sortBy,
        filter_by: isApplyFilter
          ? {
            date_type: filterType,
            date: {
              start_date: startDate ? startDate.format("YYYY-MM-DD") : null,
              end_date: endDate ? endDate.format("YYYY-MM-DD") : null,
            },
            country: country,
            status: status,
          }
          : null,
      });

      if (data?.status) {
        const allOrders = data?.orders;
        const exportData = allOrders?.map((ord) => ({
          orderId: ord?.id,
          name: ord?.name,
          type: ord?.type,
          status: ord?.status,
          createdAt: ord?.createdAt,
        }));
        exportToExcel(exportData, "all_Orders.xlsx");
      } else {
        message.error(data?.message || "Failed to fetch orders for export");
      }
    } catch (error) {
      console.error("Error exporting orders:", error);
      message.error("An error occurred while exporting orders");
    } finally {
      setLoading(false);
    }
  };
  return (
    <React.Fragment>
      <Space
        direction="vertical"
        style={{
          width: "100%",
        }}
      >
        <Card>
          <Row gutter={[16, 24]}>
            <Col xs={24} sm={24} md={6} lg={6} xl={8} xxl={8}>
              <Search
                placeholder={t("search")}
                enterButton={<SearchOutlined />}
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
            </Col>
            <Col xs={0} sm={0} md={0} lg={0} xl={4} xxl={6}></Col>

            <Col xs={24} sm={24} md={18} lg={18} xl={12} xxl={10}>
              <Flex align="end" gap="small" justify="space-evenly">
                <Button
                  block
                  onClick={() => {
                    resetFilterParameters();
                  }}
                >
                  <RedoOutlined /> {t("reset")}
                </Button>
                <Button
                  block
                  onClick={() => {
                    setShowFilterModal(true);
                  }}
                >
                  <FilterOutlined /> {t("filter")}
                </Button>
                <Select
                  value={sortBy}
                  optionFilterProp="children"
                  menuItemSelectedIcon={<SortAscendingOutlined />}
                  onChange={(value) => setSortBy(value)}
                  options={sortByItems.map((item) => ({
                    value: item.value,
                    label: item.label,
                  }))}
                  block
                />
                <Button
                  type={"primary"}
                  onClick={() => onExport()}
                  block
                >
                  <DownloadOutlined /> {t("export")}
                </Button>
              </Flex>
            </Col>
          </Row>
        </Card>
        <Card>
          <Table
            columns={columns}
            dataSource={orders}
            pagination={{
              total: total,
              current: page,
              pageSize: pageSize,
              onChange(p, ps) {
                if (p != page) {
                  setPage(p);
                }
                if (ps != pageSize) {
                  setPageSize(ps);
                }
              },
            }}
            loading={loading}
          />
        </Card>
      </Space>
      <Modal
        title={t("filterorders")}
        open={showFilterModal}
        centered
        onCancel={() => setShowFilterModal(false)}
        okText={t("apply")}
        cancelText={t("cancel")}
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
            <Form.Item label={t("filterbydate")}>
              <RangePicker
                maxDate={dayjs()}
                style={{
                  width: "100%",
                }}
                onChange={(dates) => {
                  const [start, end] = dates;
                  setStartDate(start); // Update startDate state
                  setEndDate(end); // Update endDate state
                }}
              />
            </Form.Item>
          )}

          {/* Country filter */}
          {/* <Form.Item label={t("filterbycountry")}>
            <Select
              showSearch
              placeholder={t("select")}
              value={country}
              onChange={(value) => setCountry(value)}
              optionFilterProp="children"
            >
              <Select.Option key={"all"} value={"all"}>
                {t("allcountries")}
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
          </Form.Item> */}

          <Form.Item label={t("filterbystatus")}>
            <Select
              value={status}
              onChange={(status) => {
                setStatus(status);
              }}
            >
              <Option value="all">{t("all")}</Option>
              <Option value="processing">{t("processing")}</Option>
              <Option value="pending-payment">{t("pending-payment")}</Option>
              <Option value="failed">{t("failed")}</Option>
              <Option value="on-hold">{t("on-hold")}</Option>
              <Option value="completed">{t("completed")}</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default Orders;

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Flex,
  Input,
  Badge,
  Typography,
  Space,
  Table,
  Col,
  Row,
  Select,
  Form,
  Modal,
  DatePicker,
  Radio,
  ConfigProvider,
  Popover,
  Image,
  message,
  Card,
} from "antd";
import {
  FilterOutlined,
  DownloadOutlined,
  SearchOutlined,
  RedoOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
const { Search } = Input;
const { Text } = Typography;
import axiosInstance from "../../util/axiosInstance";
import { exportToExcel } from "react-json-to-excel";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import Link from "antd/es/typography/Link";

import countryCodes from "country-codes-list";
import { formatDate } from "../../util/common.utils";
const { Option } = Select;

const { RangePicker } = DatePicker;
const Activities = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [countryList, setCountryList] = useState([]);

  const products = useSelector((state) => state.app.products);
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState("");

  //Filter
  const [filterType, setFilterType] = useState("all-time"); // Default value is 'specific'
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [country, setCountry] = useState("all");
  const [status, setStatus] = useState("all");
  const [renew, setRenew] = useState("all");

  const [isApplyFilter, setIsApplyFilter] = useState(false);

  //renew
  const [sortBy, setSortBy] = useState("create_at");

  //pagination
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const productName = useCallback(
    (productId) => {
      const product = products.find((x) => x.id === productId);
      if (product) {
        return product.name;
      } else {
        return "";
      }
    },
    [products]
  );

  const productImage = useCallback(
    (productId) => {
      const product = products.find((x) => x.id === productId);
      if (product) {
        return product.image;
      } else {
        return "";
      }
    },
    [products]
  );

  useEffect(() => {
    getAllActivities();
  }, [page, pageSize, isApplyFilter, sortBy]);

  useEffect(() => {
    const cList = countryCodes.all();
    setCountryList(cList);
  }, [dispatch]);

  const isFilterApply = useMemo(() => {
    return (
      isApplyFilter &&
      !(
        filterType == "all-time" &&
        country == "all" &&
        status == "all" &&
        renew == "all"
      )
    );
  }, [filterType, status, renew, country, isApplyFilter]);

  const getAllActivities = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post("reseller/activities", {
        search: search,
        page: page - 1,
        limit: pageSize,
        sort_by: sortBy,
        filter_by: isFilterApply
          ? {
            date_type: filterType,
            date: {
              start_date: startDate ? startDate.format("YYYY-MM-DD") : null,
              end_date: endDate ? endDate.format("YYYY-MM-DD") : null,
            },
            country: country,
            status: status,
            is_renewal: renew,
          }
          : null,
      });

      if (data.status) {
        setActivities(data.activities);
        setTotal(data.total);
      } else {
        setActivities([]);
        setTotal(0);
      }
    } catch (error) {
      message.error(error)
    } finally {
      setLoading(false);
    }
  };

  const licStatus = (record) => {
    if (record.status === 0) {
      return <Badge status="success" text={t("available")} />;
      //return <Tag color="success">{t("available")}</Tag>
    } else if (record.status === 1) {
      //return <Tag color="processing">{t("active")}</Tag>
      return <Badge status="processing" text={t("active")} />;
    } else if (record.status === 3) {
      //return <Tag color="error">{t("expiry")}</Tag>
      return <Badge status="error" text={t("expiry")} />;
    } else if (record.status === 4) {
      //return <Tag color="warning">{t("renew")}</Tag>
      return <Badge status="warning" text={t("renew")} />;
    } else {
      return <></>;
    }
  };

  const columns = [
    {
      title: t("sn"),
      dataIndex: "SN",
      key: "SN",
      width: 25,
      fixed: "left",
      render: (value, item, index) => (page - 1) * pageSize + (1 + index),
    },

    {
      title: t("activities.key"),
      dataIndex: "key",
      key: "key",
      fixed: "left",
      width: 100,
      render: (_, record) => <Text copyable>{record.licId.key}</Text>,
    },

    {
      title: t("user"),
      dataIndex: "name",
      key: "User",
      width: 100,
      render: (_, record) =>
        record.name != "" ? (
          <Popover
            content={
              <>
                {" "}
                <Link type={"default"} href={"tel:" + record.licId.phone}>
                  <PhoneOutlined />
                  {"  "}
                  {record.licId.phone}
                </Link>
                <br />
                <Link type={"default"} href={"mailto:" + record.licId.email}>
                  <MailOutlined />
                  {"  "}
                  {record.licId.email}
                </Link>
                <br />
                <Text>
                  <EnvironmentOutlined />
                  {"  "}
                  {record.licId.place} - {record.licId.country}
                </Text>
              </>
            }
            title={record.licId.name}
          >
            <Space style={{ cursor: "pointer" }}>
              <Text>
                <EyeOutlined /> {record.licId.name}
              </Text>{" "}
            </Space>
          </Popover>
        ) : (
          <>N/A</>
        ),
    },
    {
      title: t("product"),
      dataIndex: "product",
      key: "product",
      width: 150,
      render: (_, record) => {
        const pName = productName(record.licId.productId);
        return (
          <Space>
            <Image
              preview={false}
              src={productImage(record.licId.productId)}
              alt={pName}
              style={{ width: 40 }}
            />
            {pName}
          </Space>
        );
      },
    },

    {
      title: t("valid"),
      dataIndex: "valid",
      key: "Valid",
      width: 50,
      render: (_, record) => (
        <Text>
          {record.licId.valid} {t("days")}
        </Text>
      ),
    },

    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      width: 50,
      render: (_, record) => (
        <ConfigProvider
          theme={{
            components: {
              Badge: {
                dotSize: 30,
              },
            },
          }}
        >
          <Text code type="text">
            {licStatus(record.licId)}
          </Text>
        </ConfigProvider>
      ),
    },
    {
      title: t("title.active"),
      dataIndex: "activateAt",
      key: "Active",
      width: 100,
      render: (_, record) => {
        const activateAt = record?.licId?.activateAt
        return <Text>{formatDate(activateAt)}</Text>;
      },
    },
    {
      title: t("Expired"),
      dataIndex: "expire",
      key: "Expire",
      width: 100,
      render: (_, record) => {
        return <Text>{formatDate(record?.licId?.expireAt)}</Text>;
      },
    },
    {
      title: t("created"),
      dataIndex: "Created",
      key: "Created",
      width: 100,
      render: (_, record) => {
        const createdAt = record?.licId?.createdAt
        return <Text>{formatDate(createdAt)}</Text>;
      },
    },

    {
      title: t("logAt"),
      dataIndex: "logAt",
      key: "logAt",
      width: 100,
      render: (_, record) => {
        const createdAt = record.createdAt
        return <Text>{formatDate(createdAt)}</Text>;
      },
    },
  ];

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
      label: t("sortbyExpire"),
      value: "expire_at",
    },
    {
      key: "6",
      label: t("sortbyCreateAt"),
      value: "create_at",
    },
  ];

  const onExport = () => {
    var data = activities.map((lic) => {
      return {
        name: lic.name,
        key: lic.key,
        valid: lic.valid,
        status: lic.status,
        enable: lic.enable,
        activateAt: lic.activateAt,
      };
    });

    exportToExcel(data, "license-keys.xlsx");
  };

  return (
    <>
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
                onChange={(dates) => {
                  const [start, end] = dates;
                  setStartDate(start); // Update startDate state
                  setEndDate(end); // Update endDate state
                }}
              />
            </Form.Item>
          )}

          {/* Country filter */}
          <Form.Item label={t("filterbyCountry")}>
            <Select

              showSearch
              placeholder={t("select")}
              value={country}
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
              onChange={(renew) => {
                setRenew(renew);
              }}
            >
              <Option value="all">{t("all")}</Option>
              <Option value="yes">{t("yes")}</Option>
              <Option value="no">{t("no")}</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Space
        direction="vertical"
        style={{
          width: "100%",
        }}
      >
        <Card>
          <Row gutter={[16, 24]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={10} xxl={10}>
              <Search
                placeholder={t("search")}
                // size="small"
                enterButton={<SearchOutlined />}
                onChange={(e) => setSearch(e.target.value)}
                value={search}
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
            dataSource={activities}
            scroll={{ x: 1600 }}
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
    </>
  );
};

export default Activities;

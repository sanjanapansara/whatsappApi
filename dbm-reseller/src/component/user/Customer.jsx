import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FilterOutlined,
  DownloadOutlined,
  SearchOutlined,
  RedoOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Radio,
  Input,
  Space,
  Avatar,
  Row,
  Form,
  Select,
  DatePicker,
  Flex,
  Typography,
  Modal,
  Col,
  message,
  Card,
} from "antd";
import { Table } from "antd";
import axiosInstance from "../../util/axiosInstance";
import { useDispatch } from "react-redux";
import { exportToExcel } from "react-json-to-excel";
import countryList from "../../countryList.json";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import randomColor from "randomcolor";
const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text } = Typography;

const Customer = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
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

  const getInitials = useCallback(
    (fullName) => {
      if (!fullName) return "";
      const words = fullName.split(/\s+/).filter(Boolean); // Split by spaces
      const initials = words?.map((word) => word.charAt(0).toUpperCase()).join("");
      return initials;
    },
    [dispatch]
  );

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
      title: t("name"),
      dataIndex: "name",
      key: "name",
      width: 100,
      render: (text, record) => {
        const avatarColor = randomColor({
          luminosity: "dark",
          //hue: "green",
        }); // Generate a random color
        const name = getInitials(record.name);
        return (
          <Space>
            <Avatar style={{ backgroundColor: avatarColor }}>{name}</Avatar>
            {record.name}
          </Space>
        );
      },
    },
    {
      title: t("number"),
      dataIndex: "number",
      key: "number",
      width: 100,
      render: (text, record) => <Text>{record.phone}</Text>,
    },
    {
      title: t("email"),
      dataIndex: "email",
      width: 100,
      key: "email",
    },
    {
      title: t("city"),
      dataIndex: "city",
      key: "city",
      width: 100,
      // width: 3,
    },
    {
      title: t("country"),
      dataIndex: "country",
      key: "country",
      width: 100,
      // width: 3,
    },
  ];

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("create_at");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    getAllCustomers();
  }, [page, pageSize, isApplyFilter, sortBy, dispatch]);

  const getAllCustomers = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post("reseller/customers", {
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
        setCustomers(data.customers);
        setTotal(data.total);
      } else {
        setCustomers([]);
        setTotal(0);
      }
    } catch (e) {
      message.error(e.message);
    } finally {
      setLoading(false)
    }
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

  const onExport = () => {
    var data = customers.map((lic) => {
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
    <React.Fragment>
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
              //defaultValue={country}
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
                  //labelRender={labelRender}
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
            dataSource={customers}
            rowKey={(record) => record.id}
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
    </React.Fragment>
  );
};
export default Customer;

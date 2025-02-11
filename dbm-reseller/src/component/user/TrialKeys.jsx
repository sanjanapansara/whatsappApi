import { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Radio,
  Input,
  message,
  Badge,
  Typography,
  Space,
  Table,
  Col,
  Switch,
  Row,
  Select,
  Form,
  Modal,
  TimePicker,
  DatePicker,
  InputNumber,
  ConfigProvider,
  Popover,
  Image,
} from "antd";
import {
  FilterOutlined,
  DownloadOutlined,
  SearchOutlined,
  PlusOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import bulk from "../image/bulk.webp";
const { Search, TextArea } = Input;
const { Text } = Typography;
import axiosInstance from "../../util/axiosInstance";
import moment from "moment";
import { exportToExcel } from "react-json-to-excel";
import countryList from "../../countryList.json";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
// import FormData from "form-data";

const { Option } = Select;
const PickerWithType = ({ type, onChange }) => {
  if (type === "time") return <TimePicker onChange={onChange} />;
  if (type === "date")
    return <DatePicker onChange={onChange} defaultValue={moment()} />;
  return <DatePicker picker={type} onChange={onChange} />;
};
const { RangePicker } = DatePicker;
const TrialKeys = () => {
  const { t, i18n } = useTranslation();
  const productDetails = useSelector((state) => state.product.productData);
  const selectedProductName = useSelector(
    (state) => state.product.selectedProductName
  );

  const [allLicenses, setAllLicenses] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("all");
  const [card1, setCard1] = useState();
  // const [code, setCode] = useState("bulk-whatsapp")
  const [licenseKey, setLicenseKey] = useState(""); // State to store license key input value

  const [page, setPage] = useState(1);
  const [id, setid] = useState(
    productDetails && productDetails[0] ? productDetails[0].id : ""
  );
  const [key, setKey] = useState("all");
  const [productName, setProductName] = useState(
    productDetails && productDetails[0] ? productDetails[0].name : ""
  );

  const [selectedProduct, setSelectedProduct] = useState(
    productDetails && productDetails[0] ? productDetails[0].code : undefined
  );
  const [selectedProduct2, setSelectedProduct2] = useState(
    productDetails && productDetails[0] ? productDetails[0].code : undefined
  );

  const [searchValue, setSearchValue] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [showAllTimeModal, setShowAllTimeModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [endDate, setEndDate] = useState(null);
  const [activeb, setActiveb] = useState("Reset");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filterBy, setFilterBy] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [country, setCountry] = useState("all");
  const [status, setStatus] = useState("all");
  const [renew, setRenew] = useState("all");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [show, setShow] = useState(false);
  const [filter_by, setFilter_by] = useState();

  const showModal2 = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleCancel2 = () => {
    setIsModalVisible(false);
  };

  // const [selectedProductCode, setSelectedProductCode] = useState('');
  const [dateType, setDateType] = useState("specific"); // Default value is 'specific'

  const [selectedFilters, setSelectedFilters] = useState({
    date: "",
    country: "",
    status: "",
    isRenewal: "",
  });
  const [selectedSort, setSelectedSort] = useState({
    Name: "",
    Email: "",
    Phone: "",
    Type: "",
    status: "",
    activeat: "",
    expireat: "",
    Createat: "",
  });
  const card = useSelector((state) => state.card);
  const license = useSelector((state) => state.license);

  // const dispatch = useDispatch();
  const [activeButton, setActiveButton] = useState("All");
  const [size, setSize] = useState("all");
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const [sortBy, setSortBy] = useState("");
  const [count, setCount] = useState();
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const constructJSON = () => {
    if (dateType === "specific") {
      return {
        date_type: "specific",
        date: {
          start_date: startDate,
          end_date: endDate,

          // start_date: start ? moment(start).format("DD/MM/YYYY ") : null,
          // end_date:  end ? moment(start).format("DD/MM/YYYY ") : null
        },
        country: country,
        status: status,
        is_renewal: renew,
      };
    } else {
      return {
        date_type: "alltime",
        country: country,
        status: status,
        is_renewal: renew,
      };
    }
  };

  const yourJSONObject = constructJSON();

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };
  const isButtonActive = (buttonName) => {
    return activeButton === buttonName ? "primary" : "default";
  };

  const functionclick = (button) => {
    setActiveb(button);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);
  };

  const countrySelect = (value) => {
    const selectedCountry = value;
    AllLicenses(selectedCountry, endDate, startDate, country, renew, status);

    console.log(`selected ${value}`);
  };
  const handleCloseModal = () => {
    setShowAllTimeModal(false);
  };
  const handleCloseModal2 = () => {
    AllLicenses(
      filter,
      selectedProduct,
      searchValue,
      selectedFilters,
      page,
      endDate,
      country,
      status,
      renew,
      startDate,
      size, // Pass the value of 'size' from the modal
      sortBy // Pass the value of 'sortBy' from wherever it's available
    );
    setShowFilterModal(false);
  };

  const applyFilters = () => {
    // Apply filters logic here
    console.log("Selected Filters:", selectedFilters);

    // Close the modal after applying filters
    setShowFilterModal(false);
  };
  const applySort = () => {
    // Apply sort logic here
    console.log("Selected Sort:", selectedSort);

    // Close the modal after applying sort
    setShowSortModal(false);
  };

  const handleSize = (e) => {
    const value = e.target.value;
    setSize(value);
    console.log("all time value--->", value);
    setShowDatePicker(value === "specific"); // Agar value 2 hai to datepicker dikhao, nahi to chhupao
    setFilterBy(value);
  };
  const handleSizeChange = (e) => {
    const value = e.target.value;
    setSize(value);
    setShowDatePicker(value === 2); // Agar value 2 hai to datepicker dikhao, nahi to chhupao
  };
  const onExport = () => {
    console.log("onExport");
    exportToExcel(allLicenses);
  };

  useEffect(() => {
    console.log(
      "start date-->",
      startDate ? startDate.format("DD/MM/YYYY") : null
    );

    console.log(
      "end date-->",
      endDate ? moment(endDate).format("DD/MM/YYYY") : null
    );
  }, [startDate, endDate]);
  console.log("set page value--->", page);
  console.log("selected country-->", country);
  console.log("stutas-->", status);
  console.log("json", yourJSONObject);

  const AllLicenses = (
    filters,
    code,
    searchValue,
    page,
    filterObject,
    sortBy
  ) => {
    setLoading(true);
    axiosInstance
      .post("reseller/all-licenses/", {
        product_code: code, // Use selected product code here
        filter: filter,
        search: searchValue,
        is_trial: true,
        page: pageNumber,
        limit: pageSize,
        ...(sortBy ? { sort_by: sortBy } : {}),
        ...(filter_by ? { filter_by: filter_by } : {}),
      })
      .then(function (response) {
        setAllLicenses(response.data.keys);
        setLoading(false);
        setCount(response.data.total);
      })
      .catch(function (error) {
        console.log("error--->", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      AllLicenses(
        filter,
        selectedProduct,
        searchValue,
        page,
        filter_by,
        sortBy
      );
    }, 1000);
    return () => clearTimeout(debounceTimer);
  }, [filter, selectedProduct, searchValue, page, filter_by, sortBy]);

  const ChangeLicensesStatus = (productId, checked) => {
    console.log("product id-->", productId);
    axiosInstance
      .post("reseller/change-lic-status", {
        license_id: productId,
        status: checked,
      })
      .then(function (response) {
        console.log("response--->change-licenses_status", response);
        console.log("response status--->", response.status);
        message.success(response.data.message);
      })
      .catch(function (error) {
        console.log("error--->", error);
        message.error(response.data.message);
      });
  };
  const RemoveLicensesDevice = (id) => {
    axiosInstance
      .post("reseller/remove-lic-device", {
        license_id: id,
        // status:true,
      })
      .then(function (response) {
        message.success(response.data.message);
        console.log("response--->remove-lic-device", response);
        console.log("response status--->", response.status);
      })
      .catch(function (error) {
        console.log("error--->", error);
        message.error(response.data.message);
      });
  };
  const RenewLicensesDevice = (id) => {
    console.log("renew licenseKey-->", id);
    console.log("renew licenseKey2-->", licenseKey);

    axiosInstance
      .post("reseller/renew-license-key", {
        license_id: id,
        renew_key: licenseKey,
      })
      .then(function (response) {
        message.success(response.data.message);
        console.log("response--->renew-lic-device", response);
        console.log("response status--->", response.status);
      })
      .catch(function (error) {
        console.log("error--->", error);
        message.error(response.data.message);
      });
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const GenrateKey = (productId, key, note) => {
    axiosInstance
      .post("reseller/generate-trial-key", {
        product_id: productId,
        total_keys: key,
        note: note,
      })
      .then(function (response) {
        message.success(response.data.message);
      })
      .catch(function (error) {
        console.log("error--->", error);
        message.error(response.data.message);
      });
  };

  const handleOk2 = () => {
    setOpen(false);
    RenewLicensesDevice(id, licenseKey);
  };

  const handleCancel = () => {
    setOpen(false);
    setOpen2(false);
  };
  const getContent = (record) => (
    <div>
      <p>
        <strong>{t("name")}:</strong> {record.name}
      </p>
      <p>
        <strong>{t("key")}:</strong> {record.key}
      </p>
    </div>
  );
  const columns = [
    {
      title: t("sn"),
      dataIndex: "SN",
      key: "SN",
      width: 1,
      render: (value, item, index) => (page - 1) * 10 + 1 + index,
    },
    {
      title: t("trial.key"),
      dataIndex: "key",
      width: 3,
      key: "key",
      render: (_, record) => <Text copyable>{record.key}</Text>,
    },
    {
      title: t("user"),
      dataIndex: "name",
      key: "User",
      width: 3,
      render: (_, record) => (
        <>
          <Popover
            content={getContent(record)}
            title="User Details"
            trigger="click"
          >
            <Text>{record.name == "" ? "-----" : record.name}</Text>
          </Popover>
        </>
      ),
    },
    {
      title: t("shop.validity"),
      dataIndex: "valid",
      key: "Valid",
      width: 1,
      render: (_, record) => (
        <Text>
          {record.valid} {t("days")}
        </Text>
      ),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      width: 2,
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
          <Text>
            {" "}
            {record.status === 0 ? (
              <>
                {/* <Avatar shape="square"> */}
                <Text code type="text">
                  <Badge status="success" text={t("available")} />
                </Text>
                {/* </Avatar> */}
              </>
            ) : record.status === 1 ? (
              <Text code type="text">
                <Badge status="processing" text={t("active")} />
              </Text>
            ) : record.status === 3 ? (
              <Text code type="text">
                <Badge status="error" text={t("expiry")} />
              </Text>
            ) : (
              <Text code type="text">
                <Badge status="warning" text={t("expiry")} />
              </Text>
            )}
          </Text>
        </ConfigProvider>
      ),
    },
    {
      title: t("enable"),
      dataIndex: "Enable",
      width: 1,
      render: (text, record) => (
        <>
          {record.enable ? (
            <Switch
              defaultChecked
              onChange={(checked) => {
                onChange(record.key);
                ChangeLicensesStatus(record.id, checked); // Call ChangeLicensesStatus with productId
              }}
            />
          ) : (
            <Switch
              onChange={(checked) => {
                onChange(record.key);
                ChangeLicensesStatus(record.id, checked); // Call ChangeLicensesStatus with productId
              }}
            />
          )}
        </>
      ),
      responsive: ["md"],
    },
    // {
    //   title: t("title.active"),
    //   dataIndex: "activateAt",
    //   key: "Active",
    //   width: 3,
    //   render: (_, record) => {
    //     const activateAt = record.activateAt
    //       ? new Date(record.activateAt).toLocaleString()
    //       : "-----";
    //     return <Text>{activateAt}</Text>;
    //   },
    // },
    // {
    //   title: t("expire"),
    //   dataIndex: "expireAt",
    //   key: "Expire",
    //   width: 3,
    //   render: (_, record) => {
    //     const expireAt = record.expireAt
    //       ? new Date(record.expireAt).toLocaleString()
    //       : "-----";
    //     return <Text>{expireAt}</Text>;
    //   },
    // },
    {
      title: t("created"),
      dataIndex: "Created",
      key: "Created",
      width: 3,
      render: (_, record) => {
        const createdAt = record.createdAt
          ? new Date(record.createdAt).toLocaleString()
          : "-----";
        return <Text>{createdAt}</Text>;
      },
    },
  ];
  const onSearch = (value, _e, info) => {
    setSearch(value);
    console.log("search value--->", value);
  };

  //----------avtiveat----------------
  const onChange = (value) => {
    setSortBy(value);
  };

  useEffect(() => {
    // Set the default value when the language changes
    setSortBy(t("sortbynone"));
  }, [i18n.language, t]);

  // Function to close the modal
  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const resetFilterParameters = () => {
    handleButtonClick("All");
    setSortBy(t("sortbynone"));
    setFilter_by(null);
    setFilter("all");
    setSize(null);
    setStartDate(null);
    setEndDate(null);
    setCountry(t("all"));
    setStatus(t("all"));
    setRenew(t("all"));
    setPageNumber(0);
    setPageSize(10);
    setPage(1);
    setShow(false);
    setSearchValue("");
  };
  const [form] = Form.useForm(); // Initialize form instance
  const items = [
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

  const labelRender = (props) => {
    const { label } = props;
    return label ? label : <span>{t("sortbynone")}</span>;
  };

  const labelRender2 = (props) => {
    const { label, value } = props;
    if (label) {
      return label; // Display the label of the selected item
    }
    return <span>{t("all")}</span>;
  };

  const renew_key = (value) => {
    // Function to store the input value
    setLicenseKey(value);
  };

  return (
    <>
      <Space
        direction="vertical"
        size="middle"
        style={{
          display: "flex",
        }}
      >
        <Flex
          justify="space-between"
          style={{ width: "100%" }}
          wrap="wrap"
          gap="middle"
        >
          <Flex gap="small" align="flex-end" justify="end" vertical>
            <Flex gap="small" wrap="wrap">
              <Button
                size="middle"
                type={isButtonActive("All")}
                onClick={() => {
                  handleButtonClick("All");
                  setFilter("all");
                }}
              >
                {t("all")}
              </Button>
              <Button
                size="middle"
                type={isButtonActive("Available")}
                onClick={() => {
                  handleButtonClick("Available");
                  setFilter("available");
                }}
              >
                {t("available")}
              </Button>
              <Button
                size="middle"
                type={isButtonActive("Active")}
                onClick={() => {
                  handleButtonClick("Active");
                  setFilter("active");
                }}
              >
                {t("active")}
              </Button>
              <Button
                size="middle"
                type={isButtonActive("Expired")}
                onClick={() => {
                  handleButtonClick("Expired");
                  setFilter("expired");
                }}
              >
                {t("expired")}
              </Button>
              <Button
                size="middle"
                type={isButtonActive("Renew")}
                onClick={() => {
                  handleButtonClick("Renew");
                  setFilter("renew");
                }}
              >
                {t("renew")}
              </Button>
            </Flex>
          </Flex>

          <Col
            xs={24}
            sm={{
              span: 24,
            }}
            md={{
              span: 24,
            }}
            lg={{
              span: 9,
            }}
            xl={{
              span: 8,
            }}
            xxl={{
              span: 6,
              offset: 8,
            }}
          >
            <Flex gap="small" align="flex-end" vertical>
              {/* <Flex gap="small" wrap="wrap"> */}
              <Button
                size="middle"
                type="primary"
                onClick={() => {
                  setShowAddModal(true);
                }}
              >
                <PlusOutlined />
                {t("templates.add")}
              </Button>

              <Select
                placeholder={t("selectaproduct")}
                size="middle"
                style={{
                  width: "100%",
                }}
                defaultValue={selectedProduct}
                onChange={(value) => {
                  setSelectedProduct(value);
                  AllLicenses(filter, value, "", 1, {});
                  const selectedProduct = productDetails.find(
                    (product) => product.code === value
                  );
                  if (selectedProduct) {
                    setProductName(selectedProduct.name);
                  }
                }}
              >
                {productDetails &&
                  productDetails.map((product) => (
                    <Option key={product.id} value={product.code}>
                      <Space>
                        <Image
                          preview={false}
                          src={product.image}
                          alt="no"
                          style={{ width: 40 }}
                        />

                        {product.name}
                      </Space>
                    </Option>
                  ))}
              </Select>
            </Flex>
          </Col>
        </Flex>

        <Row align="middle" gutter={[16, 24]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={10} xxl={9}>
            <Flex justify="space-between" style={{ width: "100%" }} wrap="wrap">
              <Search
                placeholder={t("search")}
                size="middle"
                enterButton={<SearchOutlined />}
                onChange={handleChange}
                value={searchValue}
              />
            </Flex>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24} xl={14} xxl={15}>
            <Flex gap="small" align="flex-end" vertical>
              <Flex gap="small" wrap="wrap">
                <Button
                  size="middle"
                  onClick={() => {
                    resetFilterParameters();
                  }}
                >
                  <RedoOutlined /> {t("reset")}
                </Button>
                <Badge dot={show} color="blue">
                  <Button
                    size="middle"
                    onClick={() => {
                      functionclick("Filter");
                      setShowFilterModal(true);
                    }}
                  >
                    <FilterOutlined /> {t("filter")}
                  </Button>
                </Badge>
                <Select
                  size="middle"
                  value={sortBy}
                  labelRender={labelRender}
                  optionFilterProp="children"
                  style={{ width: "30%" }}
                  onChange={onChange}
                  options={items}
                />
                <Button
                  size="middle"
                  onClick={() => {
                    exportToExcel(allLicenses, "TrailKey");
                  }}
                >
                  <DownloadOutlined /> {t("export")}
                </Button>
              </Flex>
            </Flex>
          </Col>
        </Row>

        {/* </Row> */}
        <Table
          size="small"
          columns={columns}
          dataSource={allLicenses}
          rowHoverable="true"
          scroll={{ x: 1600, y: 350 }}
          pagination={{
            total: count,
            current: page,
            pageSize: pageSize,
            onChange(current, pageSize) {
              setPage(current);
              setPageNumber(current - 1);
              setPageSize(pageSize);
            },
          }}
          loading={loading}
          onRow={(record) => ({
            onClick: () => showModal2(record),
            style: { cursor: "pointer" },
          })}
        />
      </Space>

      <Modal
        open={open2}
        title={t("licenseKey")}
        onOk={handleOk2}
        centered
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            {t("discard")}
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk2}>
            {t("renew")}
          </Button>,
        ]}
      >
        {" "}
        <Flex justify="space-around">
          <div>
            <Flex vertical>
              <Text type="secondary">{t("licenseKey")}</Text>
              <Text>{key}</Text>
            </Flex>
          </div>
          <div>
            <Flex vertical>
              <Text type="secondary">{t("product")}</Text>
              <Text> {productName}</Text>
            </Flex>
          </div>
        </Flex>
        <Form
          layout="vertical"
          style={{
            maxWidth: 500,
          }}
        >
          <Form.Item label={t("enterLicenseKey")}>
            <Input
              placeholder="xxxx-xxxx-xxxx-xxxx"
              onChange={(e) => {
                renew_key(e.target.value); // Call renew_key function with the input value
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
      {/* <Pagination defaultCurrent={6} total={100} />; */}
      <Modal
        title={t("filterLicenses")}
        open={showFilterModal}
        centered
        onCancel={() => setShowFilterModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowFilterModal(false)}>
            {t("cancel")}
          </Button>,
          <Button
            key="apply"
            type="primary"
            onClick={() => {
              // Construct the filter object
              const filterObject = {
                date_type: size,
                date: {
                  start_date: startDate ? startDate.format("YYYY-MM-DD") : null,
                  end_date: endDate ? endDate.format("YYYY-MM-DD") : null,
                },
                country: country,
                status: status,
                is_renewal: renew,
              };
              setFilter_by(filterObject);
              setShowFilterModal(false); // Close the modal after applying filters
              setShow(true);
            }}
          >
            {t("apply")}
          </Button>,
        ]}
      >
        <Form layout="vertical">
          {/* Date filter */}
          <div>
            <Radio.Group defaultValue={1} onChange={handleSize}>
              <Radio value={1} defaultChecked>
                {t("activities.allTime")}
              </Radio>

              {/* <Radio value={"all"}>All Time</Radio> */}
              <Radio value={"specific"}>{t("specificTime")}</Radio>
              {showDatePicker && (
                <RangePicker
                  size={size}
                  maxDate={dayjs()}
                  onChange={(dates) => {
                    if (dates && dates.length === 2) {
                      setStartDate(dates[0]);
                      setEndDate(dates[1]);
                    }
                  }}
                />
              )}
            </Radio.Group>
          </div>
          <br />
          {/* Country filter */}
          <Form.Item label={t("filterbyCountry")}>
            <Select
              size="middle"
              labelRender={labelRender2}
              value={country}
              showSearch
              placeholder={t("selectaperson")}
              optionFilterProp="children"
              onSearch={onSearch}
              filterOption={filterOption}
              style={{ width: "100%" }}
              onChange={(country) => {
                setCountry(country);
              }}
              options={countryList.map((item, index) => ({
                value: item.countryNameEn,
                label: item.countryNameEn,
              }))}
            />
          </Form.Item>

          {/* Status filter */}
          <Form.Item label={t("filterbyStatus")}>
            <Select
              size="middle"
              labelRender={labelRender2}
              value={status}
              onChange={(status) => {
                setStatus(status);
              }}
            >
              <Option value="enble">{t("enable")}</Option>
              <Option value="disable">{t("disable")}</Option>
              <Option value="All">{t("all")}</Option>

              {/* Add status options */}
            </Select>
          </Form.Item>

          {/* Renewal filter */}
          <Form.Item label={t("filterbyRenewal")}>
            <Select
              size="middle"
              labelRender={labelRender2}
              value={renew}
              onChange={(renew) => {
                setRenew(renew);
              }}
            >
              <Option value="yes">{t("yes")}</Option>
              <Option value="no">{t("no")}</Option>
              <Option value="All">{t("all")}</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={t("allTimeFilter")}
        open={showAllTimeModal}
        centered
        onCancel={handleCloseModal}
        footer={[
          <Button key="cancel" onClick={handleCloseModal}>
            {t("cancel")}
          </Button>,
          <Button key="apply" type="primary" onClick={handleCloseModal}>
            {t("apply")}
          </Button>,
        ]}
      >
        <br />
        {/* Your content for the modal */}
        <div>
          <Radio.Group defaultValue={1} onChange={handleSizeChange}>
            <Radio value={1}>{t("activities.allTime")}</Radio>
            <Radio value={2}>{t("specificTime")}</Radio>
          </Radio.Group>
          {showDatePicker && <RangePicker size={size} />}
        </div>
      </Modal>
      <Modal
        title={t("addLicenseKey")}
        open={showAddModal}
        centered
        onCancel={closeAddModal}
        footer={[
          <Button
            key={t("submit")}
            type="primary"
            htmlType="submit"
            onClick={() => {
              form.submit();
            }}
          >
            {t("submit")}
          </Button>,
          <Button key="cancel" onClick={closeAddModal}>
            {t("discard")}
          </Button>,
        ]}
        width={400} // Set the width to 400px
        styles={{ body: { height: "400px", overflow: "auto" } }}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={(values) => {
            const noteValue = values.note;
            const Key = values.totalKey;
            GenrateKey(id, Key, noteValue);
          }}
        >
          <Form.Item label={t("product")}>
            {/* <ProductDropdown onProductChange={handleProductChange} /> */}
            <Select
              placeholder="Select a product"
              size="middle"
              style={{ width: "100%" }}
              defaultValue={selectedProduct}
              onChange={(value) => {
                setSelectedProduct2(value);

                // Find the selected product object from the product details list
                const selectedProductObj = productDetails.find(
                  (product) => product.code === value
                );

                if (selectedProductObj) {
                  setProductName(selectedProductObj.name);
                  setid(selectedProductObj.id);
                  // You can now use selectedProductObj.id wherever needed
                }
              }}
            >
              {productDetails &&
                productDetails.map((product) => (
                  <Option key={product.id} value={product.code}>
                    <Space>
                      <Image
                        preview={false}
                        src={product.image}
                        alt="no"
                        style={{ width: 40 }}
                      />
                      {product.name}
                    </Space>
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item label={t("totalkey")} name="totalKey">
            <InputNumber />
          </Form.Item>
          <Form.Item label={t("note")} name="note">
            <TextArea rows={4} placeholder={t("note")} />
          </Form.Item>
          <Form.Item>
            <Space></Space>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="User Details"
        open={isModalVisible}
        centered
        onCancel={handleCancel2}
        footer={[
          <Button key="back" onClick={handleCancel2}>
            {t("close")}
          </Button>,
        ]}
      >
        {selectedRecord && (
          <div>
            {/* <p><strong>Name:</strong> {selectedRecord.name}</p> */}
            <p>
              <strong>{t("email")}:</strong>{" "}
              {selectedRecord.email ? selectedRecord.email : "-------"}
            </p>

            <p>
              <strong>{t("phone")}:</strong>{" "}
              {selectedRecord.phone ? selectedRecord.phone : "-------"}
            </p>
            <p>
              <strong>{t("city")}:</strong>{" "}
              {selectedRecord.place ? selectedRecord.place : "-------"}
            </p>
            <p>
              <strong>{t("country")}:</strong>{" "}
              {selectedRecord.country ? selectedRecord.country : "-------"}
            </p>

            {/* Add other fields as needed */}
          </div>
        )}
      </Modal>

      {countryList.map((item) => null)}
    </>
  );
};

export default TrialKeys;

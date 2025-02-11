import React, { useCallback, useEffect, useMemo, useState } from "react";
import axiosInstance from "../../util/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  Button,
  Flex,
  Input,
  Dropdown,
  message,
  Badge,
  Typography,
  Space,
  Table,
  Radio,
  Col,
  Switch,
  Row,
  Select,
  Form,
  Modal,
  DatePicker,
  ConfigProvider,
  Popover,
  Card,
  Image,
  Alert,
} from "antd";
import {
  FilterOutlined,
  DownloadOutlined,
  MoreOutlined,
  RedoOutlined,
  EyeOutlined,
  PlusOutlined,
  SortAscendingOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { exportToExcel } from "react-json-to-excel";
import { useTranslation } from "react-i18next";
import ProductDropdown from "../site/ProductDropdown";
const { Text, Link } = Typography;
const { Search, TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
import countryCodes from "country-codes-list";
import { useDebounce } from "../../util/useDebounce";
import ReactPhoneInput from "vreact-phone-input";
import { getMediaPath } from "../../lib";
import { formatDate } from "../../util/common.utils";
import useRazorpay from "react-razorpay";
const PhoneInput = ReactPhoneInput.default
  ? ReactPhoneInput.default
  : ReactPhoneInput;

const LicenseKey = ({ isTrial = false }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [Razorpay] = useRazorpay();
  const [loading, setLoading] = useState(false);
  const [countryList, setCountryList] = useState([]);

  const products = useSelector((state) => state?.app?.products);
  const [selectedProduct, setSelectedProduct] = useState("select");
  const [licenseKeys, setLicenseKeys] = useState([]);
  const [search, setSearch] = useState("");

  //status filter
  const [statusFilter, setStatusFilter] = useState("all");

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
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [sortBy, setSortBy] = useState("create_at");
  const [renewKey, setRenewKey] = useState("");
  const [selectedLicense, setSelectedLicense] = useState(null);
  //pagination
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  //generate trial keys
  const [formTrial] = Form.useForm(); // Initialize form instance
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [trialSelectedProduct, setTrialSelectedProduct] = useState("select");
  const [trialKeys, setTrialKeys] = useState(1);
  const [trialNote, setTrialNote] = useState("");
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState(null);
  const panel = useSelector((state) => state?.setting?.panel);
  const currency = useSelector((state) => state?.setting?.currency);
  const [razorpayInstance, setRazorpayInstance] = useState(null);
  const [resetModel, setResetModel] = useState(false)

  const paymentGateways = useMemo(() => {
    const currencyData = panel?.currencies?.find((cur) => cur?.code === currency);
    if (currencyData) {
      return currencyData?.paymentGateways;
    } else {
      return [];
    }
  }, [panel, currency]);

  useEffect(() => {
    if (paymentGateways.length > 0) {
      setSelectedPaymentGateway(paymentGateways[0]);
    } else {
      setSelectedPaymentGateway(null);
    }
  }, [panel, currency, paymentGateways]);

  useEffect(() => {
    if (products?.length > 0 && selectedProduct === "select") {
      const enabledProducts = products?.filter(product => product?.enable);
      if (enabledProducts?.length > 0) {
        setSelectedProduct(enabledProducts[0]);
        if (isTrial) {
          setTrialSelectedProduct(enabledProducts[0]);
        }
      }
    }
  }, [isTrial, products, selectedProduct]);

  const debounce = useDebounce(search, 700)

  useEffect(() => {
    if (selectedProduct && selectedProduct !== "select") {
      getAllLicenseKeys();
    }
  }, [debounce, selectedProduct, statusFilter, page, pageSize, isApplyFilter, sortBy, isTrial,]);

  useEffect(() => {
    const cList = countryCodes.all();
    setCountryList(cList);
  }, [dispatch]);

  const onSelectedProductChange = (value) => {
    if (value) {
      setSelectedProduct(value);
      if (isTrial) {
        setTrialSelectedProduct(value);
      }
    }
  };

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

  const productName = useCallback(
    (productId) => {
      const product = products?.find((x) => x?._id === productId);
      if (product) {
        return (
          <>
            <Image src={getMediaPath(product?.image)} alt={getMediaPath(product?.image)} width={40} preview={false} />
            {product?.name || "N/A"}
          </>
        );
      } else {
        return "";
      }
    },
    [products]
  );
  const handleRenewKeys = (record) => {
    setSelectedLicense(record);
    setShowRenewModal(true);
  }
  const getAllLicenseKeys = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post("license/reseller/all", {
        product_id: selectedProduct?.id,
        status: statusFilter,
        search: search,
        is_trial: isTrial,
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
            renewal: renew,
          }
          : null,
      });
      if (data.status) {
        setLicenseKeys(data?.license_keys);
        setTotal(data?.total);
      } else {
        setLicenseKeys([0]);
        setTotal(0);
      }
    } catch (error) {
      message.error(error)
    } finally {
      setLoading(false);
    }
  };

  const onChangeLicenseStatus = async (record, status) => {
    try {
      const index = licenseKeys.findIndex(key => key.id === record.id);

      if (index === -1) {
        message.error("License key not found");
        return;
      }

      const { data } = await axiosInstance.post("license/reseller/change-status", {
        license_id: record.id,
        status: status,
      });

      if (data.status) {
        const updatedLicenseKeys = [...licenseKeys];
        updatedLicenseKeys[index].enable = status;
        setLicenseKeys(updatedLicenseKeys);
        message.success(data.message);
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.log("License key error", error);
      message.error("Failed to update license status");
    }
  };

  const onRemoveLicensesDevice = async (record) => {
    if (record?.reset == 3) {
      resetModelOpen();
      return;
    }
    try {
      const { data } = await axiosInstance.post("license/reseller/remove-device", {
        license_id: record?.id,
        gateway: selectedPaymentGateway,
        currency: currency,
      });
      return data;
      // if (data.status) {
      //   message.success(data.message);
      //   licenseKeys[record.id].status = 0;
      //   licenseKeys[record.id].deviceId = "";
      // } else {
      //   message.error(data.message);
      // }
    } catch (error) {
      console.log("Remove License key error", error);
    }
  };

  const razorpayVerification = async (order_id, payment_id, signature, orderId) => {

    try {
      setLoading(true);
      const { data } = await axiosInstance.post("order/razorpay-verification",
        { order_id, payment_id, signature }
      );
      if (data.status) {
        message.success(data?.message || "Payment verified successfully");
        navigate(`/payment-success?id=${orderId}`);
        setShowProductModal(false);
      } else {
        message.error(data.message || "Verify payment failed");
        navigate(`/payment-failed?id=${orderId}`);
      }
    } catch (e) {
      message.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const displayRazorpay = (orderResponse) => {

    if (razorpayInstance) {
      const existingRazorpayForm = document.getElementById('razorpay-form');
      if (existingRazorpayForm) {
        existingRazorpayForm.remove();
      }
    }

    const options = {
      key: orderResponse?.result?.razorPay?.keyId,
      amount: orderResponse?.result?.order?.total,
      currency: orderResponse?.result?.currency,
      name: panel?.reseller?.name,
      description: "Order #" + orderResponse.result?.order?.id,
      image: `${getMediaPath(panel?.reseller?.logo)}`,
      order_id: orderResponse.result?.razorPay?.orderId,
      handler: (response) => {
        razorpayVerification(
          response.razorpay_order_id,
          response.razorpay_payment_id,
          response.razorpay_signature,
          orderResponse.result?.order?.id
        );
      },
      prefill: {
        name: profile ? profile.name : "",
        email: profile ? profile.email : "",
        contact: profile ? profile.phone : "",
      },
      notes: {
        //address: "Buy License Keys",
      },
      theme: {
        //color: "#1677FF",
      },
    };

    const newRazorpayInstance = new Razorpay(options);
    setRazorpayInstance(newRazorpayInstance);

    newRazorpayInstance.on("payment.failed", function (response) {
      message.error(response.error.code + ": " + response.error.description);
    });

    newRazorpayInstance.open();
  };
  const handlePaymentMethod = async () => {
    try {
      setLoading(true);
      const orderResponse = await onRemoveLicensesDevice();
      if (orderResponse?.status) {
        if (selectedPaymentGateway === "razorPay") {
          displayRazorpay(orderResponse);
        } else if (selectedPaymentGateway === "payPal") {
          if (orderResponse?.result?.payPal?.url) {
            window.location.href = orderResponse?.result?.payPal?.url;
          }
        } else if (selectedPaymentGateway === "stripe") {
          if (orderResponse?.result?.stripe?.url) {
            window.location.href = orderResponse?.result?.stripe?.url;
          }
        }
      } else {
        message.error(orderResponse?.message);
      }
    } catch (error) {
      console.error("Payment error:", error);
      message.error("An error occurred while processing your payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onRenewLicensesDevice = async () => {

    try {
      const { data } = await axiosInstance.post("license/reseller/renew", {
        license_id: selectedLicense?.id,
        renew_key: renewKey,
      });

      if (data.status) {
        message.success(data?.message);
      } else {
        message.error(data?.message);
      }
    } catch (error) {
      console.log("Renew License key error", error);
    }
  };

  const resetModelOpen = () => {
    setResetModel(true)
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
      title: t("license.key"),
      dataIndex: "key",
      key: "key",
      fixed: "left",
      width: 100,
      render: (_, record) => <Text copyable>{record?.key}</Text>,
    },
    {
      title: t("user"),
      dataIndex: "name",
      key: "User",
      width: 80,
      render: (_, record) =>
        record.name != "" ? (
          <Popover
            content={
              <>
                {" "}
                <Link type={"default"} href={"tel:" + record?.phone}>
                  <PhoneOutlined />
                  {"  "}
                  {record?.phone}
                </Link>
                <br />
                <Link type={"default"} href={"mailto:" + record?.email}>
                  <MailOutlined />
                  {"  "}
                  {record?.email}
                </Link>
                <br />
                <Text>
                  <EnvironmentOutlined />
                  {"  "}
                  {record?.place} - {record?.country}
                </Text>
              </>
            }
            title={record?.name}
          >
            <Space style={{ cursor: "pointer" }}>
              <Text>
                <EyeOutlined /> {record?.name}
              </Text>{" "}
            </Space>
          </Popover>
        ) : (
          <>N/A</>
        ),
    },
    {
      title: t("valid"),
      dataIndex: "valid",
      key: "Valid",
      width: 40,
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
            {licStatus(record)}
          </Text>
        </ConfigProvider>
      ),
    },
    {
      title: t("Reset"),
      dataIndex: "reset",
      key: "reset",
      width: 30,
      render: (_, record) => (
        <Text>
          {3 - (record.reset ?? 0)} {t("left")}
        </Text>
      ),
    },
    {
      title: t("enable"),
      dataIndex: "enable",
      key: "Enable",
      width: 40,
      render: (_, record) => (
        <>
          <Switch
            value={record?.enable}
            checked={record?.enable}
            onChange={(checked) => {
              onChangeLicenseStatus(record, checked);
            }}
          />
        </>
      ),
      responsive: ["md"],
    },
    // {
    //   title: t("title.active"),
    //   dataIndex: "activateAt",
    //   key: "Active",
    //   width: 60,
    //   render: (_, record) => {
    //     const activateAt = record?.activateAt
    //       ? formatDate(record?.activateAt)
    //       : "N/A";
    //     return <Text>{activateAt}</Text>;
    //   },
    // },
    // {
    //   title: t("expire"),
    //   dataIndex: "expireAt",
    //   key: "Expire",
    //   width: 60,
    //   render: (_, record) => {
    //     const expireAt = record?.expireAt
    //       ? formatDate(record?.expireAt)
    //       : "N/A";
    //     return <Text>{expireAt}</Text>;
    //   },
    // },
    {
      title: t("created"),
      dataIndex: "Created",
      key: "Created",
      width: 70,
      render: (_, record) => {
        const createdAt = formatDate(record?.createdAt)
          ? formatDate(record?.createdAt)
          : "N/A";
        return <Text>{createdAt}</Text>;
      },
    },
    {
      title: t("action"),
      dataIndex: "action",
      fixed: "right",
      width: 40,
      key: "action",

      render: (_, record) => (
        <>
          <Dropdown
            menu={{
              items: [
                ...(record.status == 1
                  ? [
                    {
                      key: "1",
                      label: (
                        <a
                          onClick={() => {
                            onRemoveLicensesDevice(record);
                          }}
                        >
                          {t("removeDevice")}
                        </a>
                      ),
                    },
                  ]
                  : []),
                {
                  key: "2",
                  label: (
                    <a
                      onClick={() => {
                        handleRenewKeys(record)
                      }}
                    >
                      {t("renew")}
                    </a>
                  ),
                },
                // {
                //   key: "3",
                //   label: (
                //     <a onClick={() => record?.reset === 0 && handleShowModal(record)}>
                //       {t("Remove Device")}
                //     </a>
                //   )
                // }
              ],
            }}
            trigger={["click"]}
          >
            <a
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <MoreOutlined style={{ fontSize: "20px" }} />
            </a>
          </Dropdown>
        </>
      ),
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
    var data = licenseKeys.map((lic) => {
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

  const resetTrialForm = () => {
    setShowTrialModal(false);
    if (products.length > 0) {
      setTrialSelectedProduct(products[0]);
    }
    setTrialKeys(1);
    setTrialNote("");
    setCity("");
    setEmail("");
    setName("");
    setCountry("");
    setPhone("+91");
    formTrial.setFieldsValue({
      totalKeys: "1",
      note: "",
      name: "",
      email: "",
      city: "",
      phone: "+91",
      country: "",
    });
  };

  //generate trial license keys
  const onGenerateTrialKeys = async () => {
    if (!trialSelectedProduct) {
      message.error(t("Please select a product"));
      return;
    }
    try {
      const { data } = await axiosInstance.post("license/reseller/generate-trial", {
        name: name,
        phone: phone,
        email: email,
        city: city,
        country: country,
        product_id: selectedProduct?.id,
        keys: trialKeys,
        note: trialNote,
      });
      if (data.status) {
        message.success(data.message);
        getAllLicenseKeys()
        resetTrialForm();
      } else {
        message.error(data.message);
      }
    } catch (e) {
      message.error(e.message);
    }
  };

  const handleChangeTrialKeys = (e) => {
    const value = parseInt(e.target.value);
    // Only set the value if it's less than 100
    if (value <= 1 || value > 101) {
      message.error(t("Not more than 100"));
      return;
    }
    setTrialKeys(value);
  };


  return (
    <React.Fragment>
      <Modal
        open={resetModel}
        title={t("Remove Licenses Device")}
        centered
        okText={t("Pay")}
        footer={[
          <Button key="cancel" onClick={() => setResetModel(false)}>
            {t("cancel")}
          </Button>,
          <Button
            key="pay"
            type="primary"
            loading={loading}
            onClick={handlePaymentMethod}
          >
            {t("Pay")}
          </Button>,
        ]}
        closable={!loading}
        maskClosable={!loading}
      >
        <Form layout="vertical">

          <Form.Item label={t('Payment Method')}>
            {selectedPaymentGateway === null ? <Alert type="warning" message={`Payment method is not available for currency ${currency}`} /> :
              <Radio.Group
                optionType="button"
                size="large"
                block
                onChange={(e) => setSelectedPaymentGateway(e.target.value)}
                value={selectedPaymentGateway}
              >
                <Space>
                  {paymentGateways?.map((gateway) => (
                    <Radio.Button
                      key={gateway}
                      value={gateway}
                      style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                    >
                      <Image
                        src={getMediaPath(`/media/payment-gateway/${gateway}.png`)}
                        preview={false}
                        alt={gateway}
                        width={80}
                      />
                    </Radio.Button>
                  ))}
                </Space>
              </Radio.Group>
            }
          </Form.Item>
          <Text>{selectedLicense?.key}</Text>

        </Form>

      </Modal>
      <Modal
        open={showRenewModal}
        title={t("renewLicenseKey")}
        centered
        onOk={() => onRenewLicensesDevice()}
        onCancel={() => setShowRenewModal(false)}
        okText={t("renew")}
      >
        <Form
          layout="vertical"
          style={{
            maxWidth: 500,
          }}
        >
          <Row gutter={[16, 24]} >
            <Col md={10} sm={24} xs={24}>
              <Flex vertical>
                <Text type="secondary">{t("licenseKey")}</Text>
                <Text>{selectedLicense?.key}</Text>
              </Flex>
            </Col>
            <Col md={14} sm={24} xs={24}>
              <Flex vertical>
                <Text type="secondary">{t("product")}</Text>
                <Text style={{ backgroundColor: "#dedede", borderRadius: 5 }}>{productName(selectedLicense?.productId?._id || "N/A")}</Text>
              </Flex>
            </Col>
          </Row>
          <Form.Item label={t("enterLicenseKey")}>
            <Input
              placeholder="xxxx-xxxx-xxxx-xxxx"
              onChange={(e) => setRenewKey(e.target.value)}
            />
          </Form.Item>
        </Form>
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

      <Modal
        title={t("addLicenseKey")}
        open={showTrialModal}
        okText={t("add")}
        centered
        onCancel={() => {
          setShowTrialModal(false);
          resetTrialForm();
        }}
        onOk={() => {
          formTrial.validateFields()
            .then(() => {
              onGenerateTrialKeys();
            })
            .catch((info) => {
              console.log("Validation Failed:", info);
            });
        }}
      >
        <Form
          layout="vertical"
          form={formTrial}
          initialValues={{
            totalKeys: trialKeys,
            note: trialNote,
          }}
          onFinish={onGenerateTrialKeys}
        >
          <Row gutter={[16, 0]}>
            <Col md={24} sm={24} xs={24}>
              <Form.Item label={t("product")}>
                <ProductDropdown
                  setSelectedProduct={setSelectedProduct}
                  selectedProduct={selectedProduct}
                  onProductChange={onSelectedProductChange}
                />
              </Form.Item>
            </Col>
            <Col md={12} sm={24} xs={24}>
              <Form.Item
                label={t("totalkey")}
                name="totalKeys"
                rules={[
                  {
                    required: true,
                    message: t("keysRequired"),
                  },
                  {
                    validator: (_, value) => {
                      if (value > 101) {
                        return Promise.reject(new Error(t("Not greater than 100")));
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Input
                  type="text"
                  placeholder="e.g 1"
                  min={1}
                  max={100} // Set the maximum allowed value to 99
                  addonAfter={<>{t("keys")}</>}
                  value={trialKeys}
                  style={{
                    width: "100%",
                  }}
                  onChange={handleChangeTrialKeys}
                />
              </Form.Item>
            </Col>
            <Col md={12} sm={24} xs={24}>
              <Form.Item
                label={t("name")}
                name="name"
              >
                <Input
                  placeholder={t("enterName")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Item>
            </Col>

            <Col md={12} sm={24} xs={24}>
              <Form.Item
                label={t("phone")}
                name="phone"
                rules={[
                  {
                    required: true,
                    message: t("login.phoneError"),
                  },
                ]}
              >
                <PhoneInput
                  inputStyle={{
                    width: "100%",
                    // background: isDarkMode ? "#333" : "#fff",
                    // color: isDarkMode ? "#fff" : "#333",
                  }}
                  country={"IN".toLowerCase()}
                  placeholder={t("profile.enterYourPhone")}
                  value={phone}
                  onChange={(phone) => {
                    setPhone(phone);
                  }}
                />
              </Form.Item>
            </Col>
            <Col md={12} sm={24} xs={24}>
              <Form.Item
                label={t("emailAddress")}
                required
                name="email"
              >
                <Input
                  type="email"
                  placeholder={t("enterEmailAddress")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col md={12} sm={24} xs={24}>
              <Form.Item
                label={t("city")}
                name="city"
              >
                <Input
                  placeholder={t("Enter Your city")}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
              <Form.Item
                name="country"
                label={t("country")}
                rules={[
                  {
                    required: true,
                    message: t("activation.countryError"),
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder={t("select")}
                  value={country}
                  onChange={(value) => setCountry(value)}
                  optionFilterProp="children"
                >
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
            </Col>

            <Col md={24} sm={24} xs={24}>
              <Form.Item
                label={t("note")}
                name="note"
                rules={[
                  {
                    required: true,
                    message: t("noteRequired"),
                  },
                ]}>
                <TextArea
                  rows={4}
                  value={trialNote}
                  onChange={(e) => setTrialNote(e.target.value)}
                  placeholder={t("note")}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Space
        direction="vertical"
        size="small"
        style={{
          width: "100%",
        }}
      >
        <Card>
          <Row gutter={[16, 24]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={10} xxl={10}>
              <Flex gap="small" justify="space-evenly">
                <Button
                  type={statusFilter == "all" ? "primary" : "default"}
                  onClick={() => setStatusFilter("all")}
                  block
                >
                  {t("all")}
                </Button>
                <Button
                  type={statusFilter == "available" ? "primary" : "default"}
                  onClick={() => setStatusFilter("available")}
                  block
                >
                  {t("available")}
                </Button>
                <Button
                  type={statusFilter == "active" ? "primary" : "default"}
                  onClick={() => setStatusFilter("active")}
                  block
                >
                  {t("active")}
                </Button>
                <Button
                  type={statusFilter == "expired" ? "primary" : "default"}
                  onClick={() => setStatusFilter("expired")}
                  block
                >
                  {t("expired")}
                </Button>
                <Button
                  type={statusFilter == "renew" ? "primary" : "default"}
                  onClick={() => setStatusFilter("renew")}
                  block
                >
                  {t("renew")}
                </Button>
              </Flex>
            </Col>

            <Col xs={0} sm={0} md={0} lg={0} xl={4} xxl={4}></Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={10} xxl={10} style={{ marginBottom: 10 }}>
              <Flex gap="middle" justify="center" align="flex-end">
                <ProductDropdown
                  setSelectedProduct={setSelectedProduct}
                  selectedProduct={selectedProduct}
                  onProductChange={(value) => setSelectedProduct(value)}
                />

                {isTrial && (
                  <Button
                    type="primary"
                    onClick={() => {
                      setShowTrialModal(true);
                    }}
                  >
                    <PlusOutlined />
                    {t("templates.add")}
                  </Button>
                )}
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
            dataSource={licenseKeys}
            scroll={{ x: 1200 }}
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

export default LicenseKey;

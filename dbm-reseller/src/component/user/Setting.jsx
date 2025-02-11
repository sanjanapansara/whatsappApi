import React, { useEffect, useMemo, useState } from "react";
import {
  Col,
  Row,
  Select,
  Space,
  Button,
  Typography,
  message,
  Input,
  Flex,
  // ColorPicker,
  Form,
  Switch,
  Card,
  Modal,
  Spin,
  Alert,
  // Steps,
  Image,
  Divider,
  Radio,
  Badge,
  Tag,
  ConfigProvider,
} from "antd";
const { Text } = Typography;
import { Upload } from "antd";
import { ArrowRightOutlined, LoadingOutlined, SyncOutlined, UploadOutlined } from "@ant-design/icons";
import ReactPhoneInput from "vreact-phone-input";
const PhoneInput = ReactPhoneInput.default
  ? ReactPhoneInput.default
  : ReactPhoneInput;
import "vreact-phone-input/lib/style.css";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../util/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import ProductDropdown from "../site/ProductDropdown";
import { beforeUpload, CURRENCIES_SYMBOL, currencyAmount, customRequest, formatDate } from "../../util/common.utils";
import { getMediaPath } from "../../lib";
// import PaymentModalRebranding from "./PaymentModalRebranding";
import useRazorpay from "react-razorpay";
import lang from "../../util/lang/lang.json";
import { changeLanguage } from "../../redux/reducers/reducer.setting";
import i18next from "i18next";
import ThemeCustomizes from "./ThemeCustomizes";
import { getExchangeRates, getPanelDetails } from "../../redux/action";
const { Dragger } = Upload;
import countryCodes from "country-codes-list";
import { useNavigate } from "react-router-dom";

// const { Title } = Typography

const Setting = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const products = useSelector((state) => state?.app?.products);
  const [selectedProduct, setSelectedProduct] = useState("select");
  const isDarkMode = useSelector((state) => state?.app?.theme);
  const rates = useSelector((state) => state?.setting?.currencyRates);
  const currency = useSelector((state) => state?.setting?.currency);
  const panel = useSelector((state) => state?.setting?.panel);
  const profile = useSelector((state) => state?.user?.profile);
  const setting = useSelector((state) => state?.setting);
  const [form] = Form.useForm();
  const [Razorpay] = useRazorpay();
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoLong, setLogoLong] = useState("");
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("#1677ff");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [demoVideoUrl, setDemoVideoUrl] = useState("");
  const [downloadURL, setDownloadURL] = useState("");
  const [version, setVersion] = useState(1);

  //banner
  const [showAd, setShowAd] = useState(true);
  const [adBannerUrl, setAdBannerUrl] = useState("");
  const [adUrl, setAdUrl] = useState("");
  const [rebrand, setRebrand] = useState(null);
  const [order, setOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [statusRebranding, setStatusRebranding] = useState(null);
  //uploading image
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  const [isLogoLongUploading, setIsLogoLongUploading] = useState(false);
  const [isIconUploading, setIsIconUploading] = useState(false);
  const [isBannerUploading, setIsBannerUploading] = useState(false);
  const [singleProductKeys, setSingleProductKeys] = useState();
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState(null);
  const [razorpayInstance, setRazorpayInstance] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [country, setCountry] = useState("IN");
  const [dialCode, setDialCode] = useState('91');
  const [language, setLanguage] = useState('');

  const filteredProducts = products?.filter(product =>
    product?.name?.includes('Data Extractor') || product?.name?.includes('Data Extractor Desktop')
  );
  const showDownloadButton = filteredProducts?.some(product => product?.name === selectedProduct?.name);

  const [themeConfig, setThemeConfig] = useState({
    mode: 'light',
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 6,
    },
  });

  useEffect(() => {
    const cList = countryCodes.all();
    setCountryList(cList);
  }, [dispatch]);

  const handleThemeConfigChange = (newConfig) => {
    setThemeConfig(newConfig);
  };


  useEffect(() => {
    if (products?.length > 0 && selectedProduct === "select") {
      const enabledProducts = products?.filter(product => product?.enable);
      if (enabledProducts?.length > 0) {
        setSelectedProduct(enabledProducts[0]);
      }
    }
  }, [products, selectedProduct]);

  useEffect(() => {
    setThemeConfig(themeConfig)
  }, [themeConfig]);

  useEffect(() => {
    if (selectedProduct && selectedProduct !== "select") {
      getRebrandingSetting();
    }
  }, [selectedProduct]);


  useEffect(() => {
    dispatch(getPanelDetails());
    dispatch(getExchangeRates());
    if (selectedProduct) {
      setStatusRebranding(rebrand?.status)
      setLogoUrl(rebrand?.logo);
      setName(rebrand?.name);
      setEmail(rebrand?.email);
      setColor(rebrand?.color);
      setCompanyName(rebrand?.name);
      setPhone(rebrand?.phone);
      setSiteUrl(rebrand?.siteUrl);
      setLogoLong(rebrand?.logoLong);
      setIcon(rebrand?.icon)
      setShowAd(rebrand?.showAd);
      setDemoVideoUrl(rebrand?.demoVideoUrl);
      setAdUrl(rebrand?.adUrl);
      setAdBannerUrl(rebrand?.adBannerUrl ?? '');
      setLanguage(rebrand?.language)
      setCountry(rebrand?.country)
      setDialCode(rebrand?.dialCode)
      form.setFieldsValue({
        logo: rebrand?.logo,
        name: rebrand?.name,
        color: rebrand?.color,
        companyName: rebrand?.name,
        phone: rebrand?.phone,
        email: rebrand?.email,
        siteUrl: rebrand?.siteUrl,
        demoVideoUrl: rebrand?.demoVideoUrl,
        adBannerUrl: rebrand?.adBannerUrl ?? "",
        adUrl: rebrand?.adUrl,
        showAd: rebrand?.showAd,
        logoLong: rebrand?.logoLong,
        icon: rebrand?.icon,
        language: rebrand?.language,
        country: rebrand?.country,
        dialCode: rebrand?.dialCode
      });
    }
  }, [dispatch, selectedProduct, rebrand]);

  const RebrandingPrice = useMemo(() => {
    const rebrandingPrice = products?.find((product) => product?._id === selectedProduct?._id);
    if (rebrandingPrice) {
      return rebrandingPrice?.rebrandingCost;
    }
  }, [products]);
  const getRebrandingSetting = async () => {
    try {
      setLoading(true);
      // Check if selectedProduct is valid
      if (!selectedProduct?._id) {
        message.error("No product selected");
      }
      const { data } = await axiosInstance.get(`reseller/rebranding/${selectedProduct?._id}`);

      if (data?.status) {
        setRebrand(data?.detail);
      } else {
        message.error(data?.message);
        setRebrand(null);
      }
    } catch (e) {
      console.error(e);
      message.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const onSaveRebrandingSettings = async () => {
    try {
      const { data } = await axiosInstance.post("reseller/rebranding/save", {
        product_id: selectedProduct?.id,
        name: name,
        logo: logoUrl,
        logo_long: logoLong,
        icon: icon,
        company_name: companyName,
        color: color,
        phone: "+" + phone,
        email: email,
        show_ad: showAd,
        ad_banner_url: adBannerUrl,
        ad_url: adUrl,
        site_url: siteUrl,
        demo_video_url: demoVideoUrl,
        theme: themeConfig,
        dial_code: dialCode,
        language: language,
        country: country,
      });

      if (data.status) {
        message.success(data.message);
        getRebrandingSetting();
      } else {
        message.error(data.message);
      }
    } catch (e) {
      message.error(e.message);
    }
  };

  const handleDownload = () => {
    const baseUrl = import.meta.env.VITE_MODE === "production" ? "/api/" : import.meta.env.VITE_API_URL;
    const rebrandId = rebrand?._id;
    const downloadUrl = `${baseUrl}reseller/download-software/${rebrandId}`;
    window.open(downloadUrl, '_blank');
  };

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

  const createOrder = async () => {
    try {
      const { data } = await axiosInstance.post("order/reseller/buy-rebranding", {
        product_id: selectedProduct?.id,
        gateway: selectedPaymentGateway,
        currency: currency,
      });
      if (data.status) {
        return data;
      } else {
        message.error(data.message);
      }
    } catch (e) {
      message.error(e.message);
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
      const orderResponse = await createOrder();
      if (orderResponse?.status) {

        if (selectedPaymentGateway === "razorPay") {
          displayRazorpay(orderResponse);
        } else if (selectedPaymentGateway === "payPal") {
          if (orderResponse?.paypal_approval_url) {
            window.location.href = orderResponse?.paypal_approval_url;
          }
        } else if (selectedPaymentGateway === "stripe") {
          if (orderResponse?.result) {
            window.location.href = orderResponse?.result;
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

  const onSelectedChange = (value) => {
    setSelectedProduct(value);
  }

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((new Date() - startDate) / (1000 * 60 * 60 * 24));
    const remainingDays = totalDays - elapsedDays;

    const progress = Math.min((elapsedDays / totalDays) * 100, 100);

    return { totalDays, elapsedDays, remainingDays, progress };
  };
  // const { activateAt, expireAt } = rebrand || {};
  // const { remainingDays } = calculateDays();

  useEffect(() => {
    if (selectedProduct && selectedProduct !== "select") {
      TotalKey()
    }
  }, [selectedProduct]);

  const TotalKey = async () => {
    try {
      const { data } = await axiosInstance.post("license/reseller/statistics", {
        product_id: selectedProduct?.id
      })
      if (data.status) {
        setSingleProductKeys(data?.statistics)
      }
    } catch (error) {
      message.error(error)
    }
  }
  // const calculate = (length) => {
  //   return (singleProductKeys / length) * 100
  // }

  // const

  const handleOpen = () => {
    setShowProductModal(true)
  }

  const statusUI = () => {
    let tagColor = 'default'; // Default color
    let message = ''
    let type = 'warning';
    let icon = null

    if (!rebrand) {
      return <Form.Item
        label={('Status')}
      ><Spin /></Form.Item>
    }

    if (rebrand.status === 'pending') {
      tagColor = 'warning';
      message = `Buy rebranding at ${CURRENCIES_SYMBOL[currency]}${RebrandingPrice}.`
      type = 'warning'

    } else if (rebrand.status === 'processing') {
      tagColor = 'processing';
      message = 'Your rebranding under processing.'
      type = 'info'
      icon = <SyncOutlined spin />
    } else if (rebrand.status === 'active') {
      tagColor = 'success';
      message = `Rebranding is active till ${CURRENCIES_SYMBOL[currency]}${formatDate(rebrand.expireAt)}`
      type = 'success'
    } else if (rebrand.status === 'inactive') {
      tagColor = 'warning';
      message = `Your rebranding was inactive. Please contact the admin.`
      type = 'warning'
    } else if (rebrand.status === 'rejected') {
      tagColor = 'error';
      message = `Your rebranding was rejected by admin.`
      type = 'error'
    } else if (rebrand.status === 'expired') {
      tagColor = 'error';
      message = "Your rebranding was expired."
      type = 'error'
    }

    return <Form.Item
      label={('Status')}
    >
      <ConfigProvider
        theme={{
          components: {
            Alert: {
              defaultPadding: "4px 10px",
            }
          }
        }
        }
      >
        <Alert
          message={message}
          type={type}
          showIcon
          action={<Tag icon={icon} color={tagColor}>{rebrand.status}</Tag>}
        />
      </ConfigProvider>

    </Form.Item>

  }

  return (
    <React.Fragment>
      <Modal
        open={showProductModal}
        centered
        onCancel={() => !loading && setShowProductModal(false)}
        width={650}
        title={selectedProduct?.name ?? ""}
        footer={[
          <Button key="cancel" onClick={() => setShowProductModal(false)}>
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
        <Divider />
        <Typography style={{ marginBottom: 10 }}><strong>Payment Method</strong></Typography>
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
      </Modal>
      <Modal
        title="Order Completed Successfully"
        open={showOrderModal}
        onOk={() => setShowOrderModal(false)}
        onCancel={() => setShowOrderModal(false)}
      >
        <p>Your order has been placed successfully!</p>
        <p></p>
        <div>
          <strong>Order Summary:</strong>
          <p>Order ID: {order?.id}</p>
          <p>
            Total:{" "}
            {currencyAmount(
              typeof order?.amount === 'number' ? (order?.amount / 100).toFixed(2) : '0.00',
              CURRENCIES_SYMBOL[currency]
            )}
          </p>
        </div>
      </Modal>
      <Form
        form={form}
        layout="vertical"
        loading={loading}
        disabled={loading}
        initialValues={{
          name: name,
          color: color,
          companyName: companyName,
          phone: phone,
          email: email,
          siteUrl: siteUrl,
          demoVideoUrl: demoVideoUrl,
          adBannerUrl: adBannerUrl,
          adUrl: adUrl,
          showAd: showAd,
        }}
        onFinish={() => onSaveRebrandingSettings()}
      >
        <Space
          style={{
            width: "100%",
          }}
          direction="vertical"
        >
          <Card>
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label={t("Product")}
                >
                  <Flex align="end" gap={5}>
                    <ProductDropdown
                      setSelectedProduct={setSelectedProduct}
                      selectedProduct={selectedProduct}
                      onProductChange={onSelectedChange}
                    />
                    {
                      (rebrand?.status === 'pending' || rebrand?.status === 'expired') && (
                        <Button
                          type="primary"
                          onClick={handleOpen}
                        >
                          Buy
                        </Button>
                      )
                    }
                  </Flex>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={8}>
                {statusUI()}
              </Col>

              <Col xs={24} sm={24} md={8}>
                {rebrand && (
                  <>
                    <Form.Item
                      label={t("Version")}
                    >
                      <Flex>
                        <Select
                          style={{
                            width: "100%",
                          }}
                          disabled
                          value={version}
                          onChange={(value) => setVersion(value)}
                          options={[
                            {
                              value: 1,
                              label: "v1",
                            },
                            {
                              value: 2,
                              label: "v2",
                            },
                            {
                              value: 3,
                              label: "v3",
                            },
                          ]}
                        />
                        {showDownloadButton && (
                          <Button onClick={handleDownload} type="primary" style={{ marginLeft: 10 }}>
                            Download
                          </Button>
                        )}
                      </Flex>
                    </Form.Item>
                  </>
                )}
              </Col>
            </Row>
          </Card>
          {loading ? (
            <Row justify="center" align="middle" style={{ height: '50vh' }}>
              <Col>
                <Spin style={{ position: "absolute", zIndex: 1, top: "50%", left: "50%", transform: "translate(-50% , -50%)" }} />
              </Col>
            </Row>
          ) : (
            <Card>
              <Row gutter={[16, 10]}>
                <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
                  <Form.Item
                    label={t("Logo")}
                    required
                    name="logo"
                  >
                    <Dragger
                      listType="picture-card"
                      className="avatar-uploader"
                      multiple={false}
                      showUploadList={false}
                      customRequest={customRequest}
                      beforeUpload={beforeUpload}
                      onChange={(info) => {
                        if (info.file.status == "uploading") {
                          setIsLogoUploading(true);
                        } else if (info.file.status == "done") {
                          setIsLogoUploading(false);
                          if (info.file.response) {
                            if (info.file.response.status) {
                              setLogoUrl(info.file.response.downloadUrl);
                            } else {
                              message.error(info.file.response.message);
                            }
                          }
                        }
                      }}
                    >
                      <Card
                        cover={
                          logoUrl ? (
                            <Flex
                              justify="center"
                              align="center"
                            >
                              <Image
                                src={getMediaPath(logoUrl)}
                                alt='logo'
                                style={{
                                  width: "100%",
                                  height: "22vh",
                                  objectFit: "contain",
                                }}
                                preview={false}
                              />
                            </Flex>
                          ) : null
                        }
                      >
                        {isLogoUploading ? (
                          <div>
                            <p className="ant-upload-drag-icon">
                              <LoadingOutlined />
                            </p>
                            <p className="ant-upload-text">Uploading...</p>
                          </div>
                        ) : (
                          !logoUrl && (
                            <div>
                              <p className="ant-upload-drag-icon">
                                <UploadOutlined />
                              </p>
                              <p className="ant-upload-text">
                                Click or drag file to this area to upload
                              </p>
                            </div>
                          )
                        )}
                      </Card>
                    </Dragger>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
                  <Form.Item
                    label={t("Logo Long")}
                    required
                    name="logoLong"
                  >
                    <Dragger
                      listType="picture-card"
                      className="avatar-uploader"
                      multiple={false}
                      showUploadList={false}
                      customRequest={customRequest}
                      beforeUpload={beforeUpload}
                      onChange={(info) => {
                        if (info.file.status == "uploading") {
                          setIsLogoLongUploading(true);
                        } else if (info.file.status == "done") {
                          setIsLogoLongUploading(false);
                          if (info.file.response) {
                            if (info.file.response.status) {
                              setLogoLong(info.file.response.downloadUrl);
                            } else {
                              message.error(info.file.response.message);
                            }
                          }
                        }
                      }}
                    >
                      <Card
                        cover={
                          logoLong ? (
                            <Flex
                              justify="center"
                              align="center"
                            >
                              <Image
                                alt={getMediaPath(logoLong)}
                                src={getMediaPath(logoLong)}
                                style={{
                                  width: "100%",
                                  height: "22vh",
                                  objectFit: "contain",
                                }}
                                preview={false}
                              />
                            </Flex>
                          ) : null
                        }
                      >
                        {isLogoLongUploading ? (
                          <div>
                            <p className="ant-upload-drag-icon">
                              <LoadingOutlined />
                            </p>
                            <p className="ant-upload-text">Uploading...</p>
                          </div>
                        ) : (
                          !logoLong && (
                            <div>
                              <p className="ant-upload-drag-icon">
                                <UploadOutlined />
                              </p>
                              <p className="ant-upload-text">
                                Click or drag file to this area to upload
                              </p>
                            </div>
                          )
                        )}
                      </Card>
                    </Dragger>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
                  <Form.Item
                    label={t("Icon")}
                    required
                    name="icon"
                  >
                    <Dragger
                      listType="picture-card"
                      className="avatar-uploader"
                      multiple={false}
                      showUploadList={false}
                      customRequest={customRequest}
                      beforeUpload={beforeUpload}
                      onChange={(info) => {
                        if (info.file.status == "uploading") {
                          setIsIconUploading(true);
                        } else if (info.file.status == "done") {
                          setIsIconUploading(false);
                          if (info.file.response) {
                            if (info.file.response.status) {
                              setIcon(info.file.response.downloadUrl);
                            } else {
                              message.error(info.file.response.message);
                            }
                          }
                        }
                      }}
                    >
                      <Card
                        cover={
                          icon ? (
                            <Flex
                              justify="center"
                              align="center"
                            >
                              <Image
                                alt={getMediaPath(icon)}
                                src={getMediaPath(icon)}
                                style={{
                                  width: "100%",
                                  height: "22vh",
                                  objectFit: "contain",
                                }}
                                preview={false}
                              />
                            </Flex>
                          ) : null
                        }
                      >
                        {isIconUploading ? (
                          <div>
                            <p className="ant-upload-drag-icon">
                              <LoadingOutlined />
                            </p>
                            <p className="ant-upload-text">Uploading...</p>
                          </div>
                        ) : (
                          !icon && (
                            <div>
                              <p className="ant-upload-drag-icon">
                                <UploadOutlined />
                              </p>
                              <p className="ant-upload-text">
                                Click or drag file to this area to upload
                              </p>
                            </div>
                          )
                        )}
                      </Card>
                    </Dragger>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col md={8} sm={12} xs={24}>
                  <Form.Item
                    label={t("setting.softwareName")}
                    tooltip={t("setting.thisisarequiredSoftwareName")}
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: t("pleaseentersoftwarename"),
                      },
                    ]}
                  >
                    <Input
                      placeholder={t("setting.softwareName")}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col md={8} sm={12} xs={24}>
                  <Form.Item
                    label={t("setting.companyName")}
                    name="companyName"
                    required
                    tooltip={t("setting.thisisarequiredCompanyName")}
                    rules={[
                      {
                        required: true,
                        message: t("pleaseentercompanyname"),
                      },
                    ]}
                  >
                    <Input
                      placeholder={t("setting.companyName")}
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col md={8} sm={12} xs={24}>
                  <Form.Item
                    label={t("Language")}
                    name="language"
                    required
                    rules={[
                      {
                        required: true,
                        message: t("select Language"),
                      },
                    ]}
                  >
                    <Select
                      defaultValue={setting?.lang ?? "en"}
                      listHeight={200}
                      showSearch
                      value={language}
                      style={{
                        height: 35,
                        width: "100%",
                      }}
                      onChange={(value) => setLanguage(value)}
                      options={lang?.map((x) => ({
                        value: x.key,
                        label: x.name
                      }))}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col md={8} sm={12} xs={24}>
                  <Form.Item
                    name="country"
                    label={t("profile.country")}
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
                      defaultValue={'IN'}
                    >
                      {countryList.map((country, i) => (
                        <Select.Option
                          key={"country-" + i}
                          value={country?.countryCode}
                        >
                          {country.countryNameEn}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col md={8} sm={12} xs={12}>
                  <Form.Item
                    name="dialCode"
                    label={t("Dial Code")}
                    rules={[
                      {
                        required: true,
                        message: t("Dial Code"),
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder={t("select")}
                      value={dialCode}
                      onChange={(value) => setDialCode(value)}
                      optionFilterProp="children"
                      defaultValue={'91'}
                    >
                      {countryList.map((country, i) => (
                        <Select.Option
                          key={"country-" + i}
                          value={country?.countryCallingCode}
                        >
                          +{country.countryCallingCode} ({country?.countryNameEn})
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col md={8} sm={12} xs={24}>
                </Col>
              </Row>
              <Divider />
              <Form.Item
                label={t("Theme")}
              >
                <ThemeCustomizes themeConfig={themeConfig} onThemeConfigChange={handleThemeConfigChange} rebrand={rebrand} />
              </Form.Item>
              <Divider />
              <Form.Item
                label={t("Supports")}
              // style={{ height: 12 }}
              >
                <Row gutter={[16, 24]}>
                  <Col md={8} sm={12} xs={24}>
                    <Form.Item
                      name="phone"
                      type="text"
                      label={t("setting.mobileNumber")}
                      rules={[
                        {
                          required: true,
                          message: t("login.phoneError"),
                        },
                      ]}
                    >
                      <PhoneInput
                        country={"in"}
                        inputStyle={{
                          width: "100%",
                          background: isDarkMode ? "#333" : "#fff",
                          color: isDarkMode ? "#fff" : "#333",
                        }}
                        value={phone}
                        autoFormat={false}
                        placeholder={t("phoneNumber")}
                        isValid={(value, country) => {
                          if (value.match(/12345/)) {
                            return (
                              "Invalid value: " + value + ", " + country.name
                            );
                          } else if (value.match(/1234/)) {
                            return false;
                          } else {
                            return true;
                          }
                        }}
                        onChange={(phone) => setPhone(phone)}
                        rules={[
                          {
                            required: true,
                            message: t("login.pleaseInput"),
                          },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <Col md={8} sm={24} xs={24}>
                    <Form.Item
                      label={t("emailAddress")}
                      required
                      tooltip={t("setting.thisisarequiredEmailAddress")}
                      name="email"
                      rules={[
                        {
                          type: "email",
                          message: t("theinputisnotvalidEmail"),
                        },
                        {
                          required: true,
                          message: t("pleaseinputyourEmail"),
                        },
                      ]}
                    >
                      <Input
                        type="email"
                        placeholder={t("enterEmailAddress")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={8}>
                    <Form.Item
                      label={t("setting.websiteURL")}
                      required
                      tooltip={t("setting.thisisarequiredWebsiteURL")}
                      name="siteUrl"
                      rules={[
                        {
                          required: true,
                          message: t("pleaseenterwebsiteURL"),
                        },
                      ]}
                    >
                      <Input
                        placeholder={t("setting.websiteURL")}

                        name="siteUrl"
                        value={siteUrl}
                        // value={formData.siteUrl}
                        onChange={(e) => setSiteUrl(e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={8}>
                    <Form.Item
                      label={t("setting.videoDemoURL")}
                      tooltip={t("setting.thisisarequiredDemoURL")}
                      name="demoVideoUrl"
                    >
                      <Input
                        placeholder={t("demoURL")}
                        value={demoVideoUrl}
                        onChange={(e) => setDemoVideoUrl(e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={8}>
                  </Col>
                </Row>
              </Form.Item>
              <Divider />
              <Form.Item
                label={t("Advertisement")}
              // style={{ height: 12 }}
              >
                <Row gutter={[16, 24]}>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      label={
                        <Flex
                          justify="space-between"
                          align="center"
                          style={{
                            width: "600px",
                          }}
                        >
                          <Text>{t("Banner")}</Text>{" "}
                          <Switch
                            name="showAd"
                            value={showAd}
                            onChange={(checked) => setShowAd(checked)}
                          />
                        </Flex>
                      }
                      required
                      name="showAd"
                    >
                      <Dragger
                        listType="picture-card"
                        className="avatar-uploader"
                        multiple={false}
                        showUploadList={false}
                        customRequest={customRequest}
                        beforeUpload={beforeUpload}
                        onChange={(info) => {
                          if (info.file.status == "uploading") {
                            setIsBannerUploading(true);
                          } else if (info.file.status == "done") {
                            setIsBannerUploading(false);
                            if (info.file.response) {
                              if (info.file.response.status) {
                                setAdBannerUrl(info.file.response.downloadUrl);
                                form.setFieldValue(
                                  "adBannerUrl",
                                  info.file.response.downloadUrl
                                );
                              } else {
                                message.error(info.file.response.message);
                              }
                            }
                          }
                        }}
                      >
                        <Card
                          cover={
                            adBannerUrl ? (
                              <Flex
                                justify="center"
                                align="center"
                              // style={{
                              //   height: "160px",
                              // }}
                              >
                                <Image
                                  alt="example"
                                  src={getMediaPath(adBannerUrl)}
                                  style={{
                                    width: "100%",
                                    height: "24vh",
                                    objectFit: "contain",
                                  }}
                                  preview={false}
                                />
                              </Flex>
                            ) : null
                          }
                        >
                          {isBannerUploading ? (
                            <div>
                              <p className="ant-upload-drag-icon">
                                <LoadingOutlined />
                              </p>
                              <p className="ant-upload-text">Uploading...</p>
                            </div>
                          ) : (
                            !adBannerUrl && (
                              <div>
                                <p className="ant-upload-drag-icon">
                                  <UploadOutlined />
                                </p>
                                <p className="ant-upload-text">
                                  Click or drag file to this area to upload
                                </p>
                              </div>
                            )
                          )}
                        </Card>
                      </Dragger>
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      label={t("setting.adsBannerURL")}
                      required={showAd}
                      tooltip={t("setting.thisisarequiredBannerURL")}
                      name="adBannerUrl"
                      rules={[
                        {
                          required: showAd,
                          message: t("pleaseenterbannerURL"),
                        },
                      ]}
                    >
                      <Input
                        placeholder={t("bannerURL")}
                        value={adBannerUrl}
                        disabled={!showAd}
                        onChange={(e) => setAdBannerUrl(e.target.value)}
                      />
                    </Form.Item>

                    <Form.Item
                      label={t("setting.adsActionURL")}
                      required={showAd}
                      tooltip={t("setting.thisisarequiredActionURL")}
                      name="adUrl"
                      rules={[
                        {
                          required: showAd,
                          message: t("pleaseenteractionURL"),
                        },
                      ]}
                    >
                      <Input

                        placeholder={t("actionURL")}
                        value={adUrl}
                        disabled={!showAd}
                        onChange={(e) => setAdUrl(e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>
              <Row gutter={[16, 24]} justify="end">
                <Col md={3} sm={6} xs={6} style={{ marginTop: "20px" }}>
                  <Button
                    block
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                  >
                    {t("save")}
                  </Button>
                </Col>
              </Row>
            </Card>
          )}
        </Space>
      </Form>
    </React.Fragment>
  );
};

export default Setting;

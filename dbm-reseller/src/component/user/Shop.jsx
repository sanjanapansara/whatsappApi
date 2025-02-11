import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../util/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Row,
  Typography,
  Col,
  Card,
  Image,
  Button,
  Modal,
  Flex,
  message,
  Radio,
  Space,
  Alert,
  Divider,
  Spin,
  Form,
} from "antd";
import { getAllProducts, getExchangeRates, getPanelDetails } from "../../redux/action";
import useRazorpay from "react-razorpay";
import { CURRENCIES_SYMBOL } from "../../util/common.utils";
import { getMediaPath } from "../../lib";
import { useNavigate } from "react-router-dom";
const { Text } = Typography;

const Shop = () => {
  const dispatch = useDispatch();
  const [Razorpay] = useRazorpay();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { form } = Form.useForm();
  const profile = useSelector((state) => state?.user?.profile);
  const products = useSelector((state) => state?.app?.products);

  const rates = useSelector((state) => state?.setting?.currencyRates);
  const currency = useSelector((state) => state?.setting?.currency);
  const panel = useSelector((state) => state?.setting?.panel);

  const [loading, setLoading] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState(10);
  const [selectedValidity, setSelectedValidity] = useState(365);
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState(null);
  const [razorpayInstance, setRazorpayInstance] = useState(null);
  const isDarkMode = useSelector((state) => state?.app?.theme);

  useEffect(() => {
    dispatch(getPanelDetails());
    dispatch(getExchangeRates());
  }, [dispatch]);

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
      const payment = {
        currency: currency,
        product_id: selectedProduct.id,
        gateway: selectedPaymentGateway,
        variation_id: selectedVariation._id,
      };
      const { data } = await axiosInstance.post("order/reseller/buy-license-keys", payment);
      return data;
    } catch (err) {
      return {
        status: false,
        message: err.message,
      };
    } finally {
      setLoading(false);
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

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  const onProductSelect = (product) => {
    setShowProductModal(true);
    setSelectedProduct(product);
    setSelectedKeys(10);
    setSelectedValidity(365);
  };

  const selectedVariation = selectedProduct
    ? selectedProduct?.rate?.reseller?.find(
      (item) => item?.keys === selectedKeys && item?.valid === selectedValidity
    )
    : null;

  const subTotal = useMemo(() => {
    if (selectedProduct && selectedVariation) {
      return selectedVariation?.price * rates[currency];
    }
    return 0;
  }, [selectedProduct, selectedVariation, currency, rates]);

  const handlingCharge = useMemo(() => {
    if (selectedPaymentGateway === null || !panel) return 0;
    return subTotal * (panel?.paymentGateway[selectedPaymentGateway]?.charge ?? 0) / 100;
  }, [panel, selectedPaymentGateway, subTotal])

  const totalPrice = useMemo(() => {
    return subTotal + handlingCharge;
  }, [subTotal, handlingCharge]);

  const productKeys = useMemo(() => {
    if (!selectedProduct?.rate?.reseller) return [];

    // Group items by key and check if any item with this key is enabled
    const keyGroups = {};
    selectedProduct?.rate?.reseller?.forEach(item => {
      if (!keyGroups[item.keys]) {
        keyGroups[item.keys] = {
          key: item.keys,
          label: item.keys,
          enable: false
        };
      }
      // If any item with this key is enabled, mark the key as enabled
      if (item.enable) {
        keyGroups[item.keys].enable = true;
      }
    });

    return Object.values(keyGroups);
  }, [selectedProduct]);

  // Get validities based on selected key
  const productValidity = useMemo(() => {
    if (!selectedProduct?.rate?.reseller || !selectedKeys) return [];

    // Filter store items for the selected key and get their validities
    const validityItems = selectedProduct?.rate?.reseller?.filter(item => item?.keys === selectedKeys)
      .map(item => ({
        enable: item.enable,
        price: item.price,
        valid: item.valid,
        label: t(item.valid + "-" + "valid"),
      }));

    return validityItems;
  }, [selectedProduct, selectedKeys, t]);

  return (
    <>
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
        {selectedProduct ? (
          <>
            <Form
              layout="vertical"
              form={form}
            >
              <Row gutter={[4, 4]}>
                <Col xs={24} sm={24} md={8} style={{ display: "grid" }}>
                  <Image src={getMediaPath(selectedProduct?.image)} preview={false} style={{ width: "70%", objectFit: "contain" }} alt="product_image" loading="lazy" />
                </Col>
                <Col xs={24} sm={24} md={16}>
                  <Form.Item label={t('shop.pack')}>
                    <Flex gap="small" vertical>
                      <Flex gap="small" align="center" wrap="wrap">
                        {productKeys?.map((keyItem) => (
                          <>
                            {keyItem?.enable && (
                              <Button
                                key={keyItem.key}
                                type={selectedKeys === keyItem.key ? "primary" : "default"}
                                onClick={() => setSelectedKeys(keyItem?.key)}
                              >
                                {keyItem?.label}
                              </Button>
                            )}
                          </>
                        ))}
                      </Flex>
                    </Flex>
                  </Form.Item>
                  <br />
                  <Form.Item label={t('shop.validity')}>
                    <Flex gap="small" vertical>
                      <Flex gap="small" align="center" wrap="wrap">
                        {productValidity?.map((validItem) => (
                          <>
                            {validItem.enable && (
                              <Button
                                key={validItem?.valid}
                                type={validItem?.valid === selectedValidity ? "primary" : "default"}
                                onClick={() => setSelectedValidity(validItem?.valid)}
                              >
                                {validItem?.valid} {t("days")}
                              </Button>
                            )}
                          </>
                        ))}
                      </Flex>
                    </Flex>
                  </Form.Item>
                </Col>
              </Row>
              <Divider style={{ marginBottom: 12, marginTop: 0 }} />
              <Form.Item label={t('Description')}>
                <span dangerouslySetInnerHTML={{ __html: selectedProduct.description }} />
              </Form.Item>
              <Divider style={{ marginBottom: 12, marginTop: -18 }} />
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
              <Divider />
              <Card style={{ background: "#f5f5f5" }}>
                <Space direction="vertical" style={{ width: "100%" }} size="small">
                  <Row justify="space-between">
                    <Col>
                      <Text>Subtotal</Text>
                    </Col>
                    <Col>
                      <Text>{`${CURRENCIES_SYMBOL[currency]}${subTotal.toFixed(2)}`}</Text>
                    </Col>
                  </Row>
                  {/* <Row justify="space-between">
                  <Col>
                    <Text>Discount</Text>
                  </Col>
                  <Col>
                    <Text type="success">-$2.00</Text>
                  </Col>
                </Row> */}
                  <Row justify="space-between">
                    <Col>
                      <Text>Handling Charge</Text>
                    </Col>
                    <Col>
                      <Text>{`${CURRENCIES_SYMBOL[currency]}${handlingCharge.toFixed(2)}`}</Text>
                    </Col>
                  </Row>
                  <Divider style={{ margin: "12px 0" }} />
                  <Row justify="space-between">
                    <Col>
                      <Text strong>Total</Text>
                    </Col>
                    <Col>
                      <Text strong>{`${CURRENCIES_SYMBOL[currency]}${totalPrice.toFixed(2)}`}</Text>
                    </Col>
                  </Row>
                </Space>
              </Card>
            </Form>
          </>
        ) : (
          <Spin />
        )}
      </Modal>
      {!products ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Spin />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {products?.map((product) => {
            const minPrice = product?.rate?.reseller?.reduce((min, store) => Math?.min(min, store?.price),
              Infinity
            );
            const maxPrice = product?.rate?.reseller?.reduce(
              (max, store) => Math?.max(max, store?.price),
              -Infinity
            );

            const convertedMinPrice = minPrice * rates[currency];
            const convertedMaxPrice = maxPrice * rates[currency];
            return (
              <Col key={product.id} xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                <Card hoverable style={{
                  height: "100%",
                  position: "relative",
                }}
                >
                  <Row style={{ borderRadius: "5px", backgroundColor: isDarkMode ? "" : "#FBF5EC", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px", overflow: "hidden" }}>
                    <Col xs={24} align={"center"}>
                      <Image
                        style={{ width: "70%", objectFit: "contain" }}
                        src={getMediaPath(product?.image)}
                        preview={false}
                      />
                    </Col>
                  </Row>
                  <Col>
                    <Typography.Title
                      ellipsis={{ rows: 1, expandable: false }}
                      level={5}
                    >
                      {product.name}
                    </Typography.Title>

                    <Text type="secondary">
                      {t("shop.price")}{" "}
                      <Text>
                        {CURRENCIES_SYMBOL[currency]}{convertedMinPrice?.toFixed(2)}{" "}
                        {t("shop.to")}{" "}
                        {CURRENCIES_SYMBOL[currency]}{convertedMaxPrice?.toFixed(2)}{" "}
                      </Text>
                    </Text>

                    <Typography.Paragraph
                      ellipsis={{ rows: 1, expandable: false }}
                      level={5}
                      type="secondary"
                      style={{ marginBottom: 40 }}
                    >
                      <div dangerouslySetInnerHTML={{ __html: product?.description }} />

                    </Typography.Paragraph>
                  </Col>
                  <Button
                    style={{ width: "100%", cursor: "pointer", marginTop: 10, bottom: 0 }}
                    onClick={() => onProductSelect(product)}
                    type="primary"
                  >
                    {t("shop.buyNow")}
                  </Button>
                </Card>
              </Col>
            )
          })}
        </Row >
      )}
    </>
  );
};

export default Shop;

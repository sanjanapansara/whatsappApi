import React, { useEffect, useCallback, useState, useMemo } from "react";
import { Typography, Row, Col, Table, Divider, Button, message, Image, Tag } from "antd";
import { CloudDownloadOutlined, EnvironmentOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CURRENCIES_SYMBOL, formatDate, ORDER_STATUS } from "../../util/common.utils";
import { getMediaPath } from "../../lib";
import { changePageTitle } from "../../redux/reducers/reducer.setting";
import { getPanelDetails } from "../../redux/action";
import axiosInstance from "../../util/axiosInstance";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const { Title, Text, Paragraph } = Typography;

const Invoice = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  const products = useSelector((state) => state?.app?.products);
  const panel = useSelector((state) => state?.setting?.panel);
  const {billing} = panel; 
  const orderId = new URLSearchParams(location?.search).get("orderId");
  const profile = useSelector((state) => state?.user?.profile);

  // Memoized helper functions
  const getProduct = useCallback((productId) => {
    return products?.find(p => p?.productId === productId) || null;
  }, [products]);

  const getItemName = useCallback((item) => {
    if (!order?.type || !item?.productId) return 'N/A';

    const product = getProduct(item?.productId);
    if (!product) return 'N/A';

    const buyTypeMap = {
      'buy-license-keys': 'Buy reseller pack of',
      'buy-product': 'Buy license keys of',
      'buy-rebranding': 'Buy rebranding of'
    };

    const buyType = buyTypeMap[order.type] || 'Buy';
    const variation = product?.rate?.reseller?.find(v => v?._id === item?.variationId);

    return variation
      ? `${buyType} ${product.name} - ${variation.title}`
      : `${buyType} ${product.name}`;
  }, [order?.type, getProduct]);

  // API calls
  const fetchOrderDetail = useCallback(async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`order/reseller/${orderId}`);

      if (data?.status) {
        setOrder(data.order);
      } else {
        message.error(data?.message || 'Failed to fetch order details');
      }
    } catch (error) {
      console.error("Error loading order detail:", error);
      message.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  // PDF Generation
  const handleDownloadInvoice = useCallback(async () => {
    if (!orderId) {
      message.error("Invalid order ID");
      return;
    }

    const elementToBeCaptured = document.getElementById("master_order_invoice");
    if (!elementToBeCaptured) {
      message.error("Failed to locate invoice element");
      return;
    }

    const loadingMessage = message.loading('Generating PDF...', 0);

    try {
      // PDF Generation settings
      const a4Width = 595.28;
      const a4Height = 841.89;
      const dpi = 300 / 72;

      const { height: contentHeight, width: contentWidth } = elementToBeCaptured.getBoundingClientRect();
      const scale = Math.min((a4Width * dpi) / contentWidth, (a4Height * dpi) / contentHeight) * 0.95;

      const canvas = await html2canvas(elementToBeCaptured, {
        scale,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#FFFFFF',
        width: contentWidth,
        height: contentHeight,
        windowWidth: contentWidth,
        windowHeight: contentHeight,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
        onclone: (clonedDoc) => {
          const element = clonedDoc.getElementById("master_order_invoice");
          if (element) {
            element.style.transform = 'none';
            element.style.width = `${contentWidth}px`;
            element.style.height = `${contentHeight}px`;
          }
        }
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
        compress: true
      });

      const scaledWidth = contentWidth * (scale / dpi);
      const scaledHeight = contentHeight * (scale / dpi);
      const xPosition = (a4Width - scaledWidth) / 2;
      const yPosition = (a4Height - scaledHeight) / 2;

      pdf.addImage(
        canvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        xPosition,
        yPosition,
        scaledWidth,
        scaledHeight,
        undefined,
        'FAST'
      );

      pdf.save(`Invoice_${orderId}.pdf`);
      message.success('PDF generated successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      message.error('Failed to generate PDF');
    } finally {
      loadingMessage();
    }
  }, [orderId]);

  // Table columns configuration
  const columns = useMemo(() => [
    {
      title: t("sn"),
      key: "SN",
      width: 80,
      fixed: "left",
      render: (_, __, index) => index + 1,
    },
    {
      title: t("Name"),
      key: "name",
      render: (_, record) => getItemName(record),
    },
    {
      title: t("price"),
      key: "price",
      width: 100,
      render: (_, record) => `${CURRENCIES_SYMBOL[order?.paymentId?.currency]}${record?.amount}`,
    },
    {
      title: t("Qty"),
      key: "quantity",
      width: 100,
      render: (_, record) => record?.quantity,
    },
    {
      title: t("Total"),
      key: "salePrice",
      width: 100,
      render: (_, record) => `${CURRENCIES_SYMBOL[order?.paymentId?.currency]}${record?.amount * record?.quantity}`,
    },
  ], [t, order?.paymentId?.currency, getItemName]);

  // Effects
  useEffect(() => {
    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId, fetchOrderDetail]);

  useEffect(() => {
    dispatch(changePageTitle("Order Invoice"));
    dispatch(getPanelDetails());
  }, [dispatch]);

  // Get order status
  const orderStatus = useMemo(() => {
    const status = ORDER_STATUS?.find(s => s?.value === order?.status);
    return status ? {
      ...status,
      icon: status.icon ? React.createElement(status.icon) : null
    } : null;
  }, [order?.status]);

  const renderAddress = useCallback((address) => {
    if (!address) return '-';
    return `${address.addressLine1 || ''} ${address.addressLine2 || ''}, ${address.city || ''}, ${address.state || ''}, ${address.zip || ''}, ${address.country || ''}`.trim();
  }, []);

  return (
    <React.Fragment>
      <Row justify="end" style={{ marginBottom: 13, gap: 5 }}>
        <Button
          onClick={handleDownloadInvoice}
          style={{ background: "#D6F4DE", color: "green", border: "none" }}
        >
          <CloudDownloadOutlined /> Download
        </Button>
      </Row>

      <div
        id="master_order_invoice"
        className="invoice_card"
        style={{
          backgroundColor: "#F5F7FA",
          margin: "auto",
          maxWidth: "595.28pt",
          boxSizing: "border-box"
        }}
      >
        <div style={{
          backgroundColor: "#FFFFFF",
          padding: "10mm",
          borderRadius: "8px",
        }}>
          {/* Header Section */}
          <Row justify="space-between" gutter={200}>
            <Col xs={24} md={12}>
              <Image
                preview={false}
                src={getMediaPath(billing?.logo)}
                width={200}
                alt="Company Logo"
                loading="lazy"
              />
            </Col>
            <Col xs={24} md={12}>
              <Title level={2} style={{ margin: 0 }}>INVOICE</Title>
              <Text>Order Id: {order?._id}</Text>
              <br />
              <Text>Date: {formatDate(order?.createdAt)}</Text>
              <br />
              {orderStatus && (
                <Text>
                  Order Status:{" "}
                  <Tag color={orderStatus?.color} icon={orderStatus?.icon}>
                    {orderStatus?.label}
                  </Tag>
                </Text>
              )}
            </Col>
          </Row>

          {/* Address Section */}
          <Row justify="space-between" gutter={200}>
            <Col span={12}>
              <Title level={5}>Invoice To:</Title>
              <Text strong>{billing?.name || "Company"}</Text>
              <br />
              <Text><EnvironmentOutlined /> {billing?.address || "-"}</Text>
              <br />
              <Text><PhoneOutlined /> {billing?.phone || "-"}</Text>
              <br />
              <Text><MailOutlined /> {billing?.email || "-"}</Text>
            </Col>
            <Col span={12}>
              <Title level={5}>Pay To:</Title>
              <Text strong>{order?.name || "Username"}</Text>
              <br />
              <Text>
                <EnvironmentOutlined />{" "}
                {renderAddress(order?.userId?.address)}
              </Text>
              <br />
              <Text><PhoneOutlined /> {order?.phone || "-"}</Text>
              <br />
              <Text><MailOutlined /> {order?.email || "-"}</Text>
            </Col>
          </Row>

          {/* Items Table */}
          <Table
            columns={columns}
            dataSource={order?.items}
            rowKey={(record, index) => record?._id || index}
            loading={loading}
            pagination={false}
            scroll={{ x: 350 }}
            style={{ marginTop: 30 }}
          />

          {/* Totals Section */}
          <Row justify="end" style={{ marginTop: 20 }}>
            <Col span={7}>
              <Row justify="space-between">
                <Text>Sub Total</Text>
                <Text>
                  {`${CURRENCIES_SYMBOL[order?.paymentId?.currency]}${order?.subTotal || "0"}`}
                </Text>
              </Row>
              <Row justify="space-between">
                <Col span={12}>Handling fee</Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  {`${CURRENCIES_SYMBOL[order?.paymentId?.currency]}${order?.handlingFee || "0"}`}
                </Col>
              </Row>
              <Divider />
              <Row justify="space-between">
                <Col span={12}>
                  <Text strong>Grand Total</Text>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <Text strong>
                    {`${CURRENCIES_SYMBOL[order?.paymentId?.currency]}${order?.total || "0"}`}
                  </Text>
                </Col>
              </Row>
            </Col>
          </Row>

          <Divider />

          {/* Payment Info */}
          <Row style={{ marginTop: 20 }}>
            <Col span={12}>
              <Title level={5}>Payment Info:</Title>
              <Text>Payment Id: {order?.paymentId?._id}</Text>
              <br />
              <Text>
                Status:{" "}
                <Tag color={order?.paymentId?.status === "paid" ? "#87d068" : "#f50"}>
                  {order?.paymentId?.status === "paid" ? "PAID" : "UNPAID"}
                </Tag>
              </Text>
            </Col>
          </Row>

          <Divider />

          {/* Footer */}
          <Row justify="space-between" style={{ textAlign: "center" }}>
            <Col>
              <div style={{ textAlign: "left", marginBottom: 10 }}>
                <Image
                  preview={false}
                  src={getMediaPath(billing?.logo)}
                  width={100}
                  alt="Company Logo"
                  loading="lazy"
                />
              </div>
              <Paragraph style={{ textAlign: "left" }}>
                Thank you for your interest in {panel.reseller.name??""} products. Your order
                has been received and will be processed once payment has been
                confirmed.
              </Paragraph>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Invoice;
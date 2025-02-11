import { Breadcrumb, Button, Card, Col, Divider, Flex, Row, Space, Tag, Typography } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { changePageTitle } from "../../../redux/reducers/reducer.setting";
import { CURRENCIES_SYMBOL, formatDate, ORDER_STATUS } from "../../../util/common.utils";
import { Link, useLocation } from "react-router-dom";
import axiosInstance from "../../../util/axiosInstance";
const { Text } = Typography;
const PaymentSuccess = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const orderId = new URLSearchParams(location?.search).get("id");
  const [order, setOrder] = useState({})

  useEffect(() => {
    dispatch(changePageTitle("Payment Success"))
    if (orderId) {
      orderById();
    }
  }, [dispatch, orderId]);

  const orderById = async () => {
    try {
      const { data } = await axiosInstance.get(`order/reseller/${orderId}`)
      if (data.status) {
        setOrder(data?.order)
      } else {
        setOrder(null)
      }
    } catch (error) {
      console.log("error orderById", error)
    }
  }

  const orderStatus = useMemo(() => {
    const status = ORDER_STATUS?.find(s => s?.value === order?.status);
    return status ? {
      ...status,
      icon: status?.icon ? React.createElement(status.icon) : null
    } : null;
}, [order?.status]);

  return (
    <>
      <Breadcrumb title="Payment Success" innerTitle="Payment Successful" />
      <Flex justify="space-between">
        <Text >Thank you for your order!</Text>
        <Link to={"/invoice?orderId=" + orderId}>
          <Button>
            View Order
          </Button>
        </Link>
      </Flex>
      <Space direction="vertical" style={{ width: "100%" }}>

        <Text>Your order has been placed successfully!</Text>
        <Card size='small' style={{ background: "#f5f5f5" }}
          block
          title="Order Summary"
          extra={orderStatus && (
            <Text>
              Order Status:{" "}
              <Tag color={orderStatus?.color} icon={orderStatus?.icon}>
                {orderStatus?.label}
              </Tag>
            </Text>
          )}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Row justify="space-between">
              <Col>
                <Text>Order Id</Text>
              </Col>
              <Col>
                <Text>{order.id || 'N/A'}</Text>
              </Col>
            </Row>
            <Row justify="space-between">
              <Col>
                <Text>Order Date</Text>
              </Col>
              <Col>
                <Text>{formatDate(order.createdAt) || 'N/A'}</Text>
              </Col>
            </Row>
            <Divider style={{ margin: "12px 0" }} />
            <Row justify="space-between">
              <Col>
                <Text>Amount</Text>
              </Col>
              <Col>
                <Text>{`${CURRENCIES_SYMBOL[order?.paymentId?.currency]}${order.subTotal?.toFixed(2)}` || 'N/A'}</Text>
              </Col>
            </Row>
            <Row justify="space-between">
              <Col>
                <Text>Handling Charge</Text>
              </Col>
              <Col>
                <Text>{`${CURRENCIES_SYMBOL[order?.paymentId?.currency]}${order.handlingFee?.toFixed(2)}` || 'N/A'}</Text>
              </Col>
            </Row>
            <Divider style={{ margin: "12px 0" }} />
            <Row justify="space-between">
              <Col>
                <Text strong>Total</Text>
              </Col>
              <Col>
                <Text strong>{`${CURRENCIES_SYMBOL[order?.paymentId?.currency]}${order.total?.toFixed(2)}` || 'N/A'}</Text>
              </Col>
            </Row>
          </Space>
        </Card>

      </Space >
    </>
  );
};

export default PaymentSuccess;

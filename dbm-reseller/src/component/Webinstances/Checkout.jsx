import React, { useState, useRef, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Select,
  Typography,
  Space,
  Divider,
} from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Checkout = () => {
  const [showPromoInput, setShowPromoInput] = useState(false);
  const promoInputRef = useRef(null);
  const navigate = useNavigate();

  const handlePromoClick = () => {
    setShowPromoInput(true);
  };

  const handleClickOutside = (event) => {
    if (
      promoInputRef.current &&
      !promoInputRef.current.contains(event.target)
    ) {
      setShowPromoInput(false);
    }
  };

  useEffect(() => {
    if (showPromoInput) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPromoInput]);

  return (
    <Row justify="center">
      {/* Left Section */}
      <Col xs={24} md={10}>
        <Card
          bordered={false}
          style={{
            width: 600,
          }}
        >
          <Row>
            <Space>
              <LeftOutlined style={{ fontSize: "20px" }} onClick={() => navigate("/webinstances")} />
              {""}
              <br />
              <br />{" "}
              <Text level={5} style={{ paddingTop: "10px" }}>
                Four Pixel Information Technology LTDA
              </Text>
            </Space>
          </Row>
          <Row>
            <Title level={4}>Assinar Z-API Mensal</Title>
          </Row>

          <Row>
            <Space>
              <Col>
                <Text strong style={{ fontSize: "24px" }}>
                  R$ 99,99{" "}
                </Text>
              </Col>
              {""}
              <Col>
                <Title level={2} style={{ fontSize: "14px", fontWeight: 400 }}>
                  per month
                </Title>
              </Col>
            </Space>
          </Row>
          <br />
          <Row>
            <Col>
              <img
                src="https://via.placeholder.com/50"
                alt="Z-API Icon"
                style={{ marginRight: "16px", borderRadius: "50%" }}
              />
            </Col>
            <Col md={7}>
              <Text strong>Z-API Mensal</Text> <br />
              <Text type="secondary">Billed monthly</Text>
            </Col>
            <Col align="right" md={8}>
              <Text style={{ float: "right" }}>R$ 99,99</Text>
            </Col>
          </Row>
          <Divider />

          <Row>
            <Col></Col>
            <Col md={12}>
              <Text strong>Subtotal</Text>
              <br />
              <Text
                type="link"
                style={{ color: "blue", cursor: "pointer" }}
                onClick={handlePromoClick}
              >
                Add promotional code
              </Text>
              {showPromoInput && (
                <div ref={promoInputRef} style={{ marginTop: "8px" }}>
                  <Form.Item>
                    <Input placeholder="Enter promotional code" />
                  </Form.Item>
                </div>
              )}
            </Col>
            <Col align="right" md={6}>
              <Text style={{ float: "right" }}>R$ 99,99</Text>
            </Col>
          </Row>
          <Divider />

          <Row>
            <Col></Col>
            <Col md={12}>
              <Text strong>Total due today</Text> <br />
              {/* <Text type="secondary">Cobrado mensalmente</Text> */}
            </Col>
            <Col align="right" md={6}>
              <Text style={{ float: "right" }}>R$ 99,99</Text>
            </Col>
          </Row>
        </Card>
      </Col>

      {/* Right Section */}
      <Col xs={24} md={10} style={{ paddingLeft: "24px" }}>
        <Card bordered={false}>
          <Title level={4}>Pay by card</Title>
          <Form layout="vertical">
            <Form.Item
              label="E-mail"
              name="email"
              rules={[{ required: true, message: "Insira o e-mail" }]}
            >
              <Input placeholder="divyavaland479@gmail.com" />
            </Form.Item>
            <Form.Item label="Card details" name="cardDetails">
              <Input.Group compact>
                <Input
                  placeholder="1234 1234 1234 1234"
                  style={{ width: "60%" }}
                />
                <Input placeholder="MM / AA" style={{ width: "20%" }} />
                <Input placeholder="CVC" style={{ width: "20%" }} />
              </Input.Group>
            </Form.Item>
            <Form.Item label="Cardholder name" name="cardHolderName">
              <Input placeholder="Full name" />
            </Form.Item>
            <Form.Item label="Country" name="country">
              <Select defaultValue="India">
                <Select.Option value="India">India</Select.Option>
                <Select.Option value="Brazil">Brasil</Select.Option>
                <Select.Option value="USA">EUA</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" block>
                To sign
              </Button>
            </Form.Item>
          </Form>
          <Text
            type="secondary"
            style={{ marginTop: "16px", display: "block" }}
          >
            By confirming your subscription, you allow Four Pixel Tecnologia da
            Informacao LTDA covers you in reference to future payments in
            compliance with company terms. You can cancel the subscription
            whenever you want.
          </Text>
        </Card>
      </Col>
    </Row>
  );
};

export default Checkout;

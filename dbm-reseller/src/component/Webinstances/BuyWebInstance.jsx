import { Button, Card, Input, Radio, Row, Col, Typography, Space } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title, Text } = Typography;

const BuyWebInstance = () => {
  const [plan, setPlan] = useState('1 Month');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('Razor Pay');
  const pricePerInstance = 1490;
  const handlingChargeRate = 0.02;
  const subtotal = pricePerInstance * quantity;
  const handlingCharge = subtotal * handlingChargeRate;
  const total = subtotal + handlingCharge;

  return (
    <Card style={{ maxWidth: 700 }}>
      <Title level={4}>Buy Web Instance</Title>

      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Text strong>Choose Plan</Text>
        </Col>
        <Col span={24}>
          <Radio.Group value={plan} onChange={(e) => setPlan(e.target.value)}>
            <Space>
              <Radio.Button value="1 Month">1 Month</Radio.Button>
              <Radio.Button value="3 Months">3 Months</Radio.Button>
              <Radio.Button value="6 Months">6 Months</Radio.Button>
              <Radio.Button value="1 Year">1 Year</Radio.Button>
            </Space>
          </Radio.Group>
        </Col>
      </Row>

      <Row gutter={[8, 8]} style={{ marginTop: 16 }}>
        <Col span={16}>
          <Text strong>Instance Name</Text>
          <Input placeholder="Enter Instance Name" style={{ marginTop: 4 }} />
        </Col>
        <Col span={8}>
          <Text strong>Quantity</Text>
          <Row justify="center" align="middle" style={{ marginTop: 4 }}>
            <Button icon={<MinusOutlined />} onClick={() => setQuantity(Math.max(1, quantity - 1))} />
            <Text style={{ margin: '0 8px' }}>{quantity}</Text>
            <Button icon={<PlusOutlined />} onClick={() => setQuantity(quantity + 1)} />
          </Row>
        </Col>
      </Row>

      <Row gutter={[8, 8]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Text strong>Payment Method</Text>
        </Col>
        <Col span={24}>
          <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <Space>
              <Radio.Button value="Razor Pay">Razor Pay</Radio.Button>
              <Radio.Button value="Paytm">Paytm</Radio.Button>
            </Space>
          </Radio.Group>
        </Col>
      </Row>

      <Row style={{ marginTop: 16, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
        <Col span={24}>
          <Row justify="space-between">
            <Text>Subtotal</Text>
            <Text>₹{subtotal.toFixed(2)}</Text>
          </Row>
          <Row justify="space-between">
            <Text>Handling Charge (2%)</Text>
            <Text>₹{handlingCharge.toFixed(2)}</Text>
          </Row>
          <Row justify="space-between" style={{ marginTop: 8 }}>
            <Title level={5}>Total</Title>
            <Title level={5}>₹{total.toFixed(2)}</Title>
          </Row>
        </Col>
      </Row>

      <Row justify="end" style={{ marginTop: 16 }}>
        <Space>
          <Button>Cancel</Button>
          <Button type="primary">Pay</Button>
        </Space>
      </Row>
    </Card>
  );
};

export default BuyWebInstance;

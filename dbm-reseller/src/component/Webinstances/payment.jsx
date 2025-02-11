import {
  DeleteOutlined,
  DoubleRightOutlined,
  FolderOutlined,
  FormOutlined,
  MoreOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import {
  Button,
  Row,
  Typography,
  Modal,
  Col,
  Dropdown,
  Menu,
  Space,
  Input,
  InputNumber,
  Form,
} from "antd";
import React, { useState } from "react";
const { Title, Text } = Typography;
import { useNavigate } from "react-router-dom";

function Payment() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [isModalOpen4, setIsModalOpen4] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showModal2 = () => {
    setIsModalOpen2(true);
  };

  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };

  const handleOk2 = () => {
    setIsModalOpen2(false);
  };

  const showModal3 = () => {
    setIsModalOpen3(true);
  };

  const handleCancel3 = () => {
    setIsModalOpen3(false);
  };

  const handleOk3 = () => {
    setIsModalOpen3(false);
  };

  const showModal4 = () => {
    setIsModalOpen4(true);
  };

  const handleCancel4 = () => {
    setIsModalOpen4(false);
  };

  const handleOk4 = () => {
    form
      .validateFields()
      .then((values) => {
        console.log(values);
        setIsModalOpen4(false); 
      })
      .catch((errorInfo) => {
        console.log('Validation Failed:', errorInfo); 
      });
  };
  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <Text onClick={() => navigate("/webinstancedata")}>
              <Space>
                <FormOutlined style={{ fontSize: "18px" }} />
                Edit
              </Space>
            </Text>
          ),
        },
        {
          key: "2",
          label: (
            <Text onClick={() => navigate("/paymentlist")}>
              <Space>
                <FolderOutlined style={{ fontSize: "18px" }} />
                Payment
              </Space>
            </Text>
          ),
        },
        {
          key: "3",
          label: (
            <Text onClick={showModal2}>
              <Space>
                <DeleteOutlined style={{ fontSize: "18px" }} />
                Delete
              </Space>
            </Text>
          ),
        },
        {
          key: "4",
          label: (
            <Text onClick={showModal3}>
              <Space>
                <TransactionOutlined style={{ fontSize: "18px" }} />
                Migrate instance
              </Space>
            </Text>
          ),
        },
      ]}
    />
  );
  return (
    <>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3}>Make a payment</Title>
        </Col>
        <Col>
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomLeft">
            <MoreOutlined
              style={{ fontSize: "25px", cursor: "pointer" }}
              onClick={(e) => e.preventDefault()}
            />
          </Dropdown>
        </Col>
      </Row>
      <Row>
        <Text>
          To use this instance, it is necessary to pay for it. The amount is R$
          99.99
        </Text>
      </Row>
      <Row>
        <Title level={4}>Subscription</Title>
      </Row>
      <Row>
        <Text>
          Current status:{" "}
          <Text style={{ color: "#df9500" }}>PENDING SUBSCRIPTION</Text>
        </Text>
      </Row>
      <Row>
        <Text>Expires on Expired!</Text>
      </Row>
      <br />
      <Row>
        <Button type="primary" onClick={showModal}>
          Subscription
        </Button>
      </Row>

      <Modal
        title=""
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Confirm"
        cancelText="Cancel"
        centered
        width={500}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
      >
        <Row
          justify="center"
          align="middle"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <Row>
            <Text style={{ color: "#00ac5a" }}>Payment method</Text>
          </Row>
          <Row>
            <Text>Choose the best payment method.</Text>
          </Row>

          <Row>
            <Col md={24}>
              <Button
                type="primary"
                block
                onClick={() => navigate("/checkout")}
              >
                Credit Card
              </Button>
            </Col>
          </Row>
          <Row>
            <Col md={24}>
              <Button
                type="primary"
                block
                style={{ width: "100px" }}
                onClick={showModal4}
              >
                Ticket
              </Button>
            </Col>
          </Row>
        </Row>
      </Modal>

      <Modal
        title=""
        open={isModalOpen2}
        onOk={handleOk2}
        onCancel={handleCancel2}
        okText="Confirm"
        cancelText="Cancel"
        centered
        width={500}
        footer={[
          <Button key="back" onClick={handleCancel2}>
            Cancel
          </Button>,
        ]}
      >
        <Row
          justify="center"
          align="middle"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <DeleteOutlined style={{ fontSize: "24px" }} />
          <Row>
            <Text style={{ color: "#00ac5a" }}>
              Do you really wish to cancel?
            </Text>
          </Row>
          <Text>
            The web instance will be deleted, but the subscription will not be
            refunded, remaining active until expiration.
          </Text>
          <Text>Type to continue confirm cancelation In the field below</Text>
          <Input
           
            placeholder="Type here a confirmation text"
            style={{ width: "70%" }}
          />
          <Row>
            <Col md={24}>
              <Button type="primary" block style={{ width: "150px" }}>
                Delete
              </Button>
            </Col>
          </Row>
        </Row>
      </Modal>

      <Modal
        title=""
        open={isModalOpen3}
        onOk={handleOk3}
        onCancel={handleCancel3}
        okText="Confirm"
        cancelText="Cancel"
        centered
        width={500}
        footer={[
          <Button key="back" onClick={handleCancel3}>
            Cancel
          </Button>,
        ]}
      >
        <Row
          justify="center"
          align="middle"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <DeleteOutlined style={{ fontSize: "24px" }} />
          <Row>
            <Text style={{ color: "#00ac5a" }}>
              Do you really want to migrate this instance?
            </Text>
          </Row>
          <Text>
            Upon confirmation, the instance will be automatically disconnected
            and migrated to a mobile instance
          </Text>
          <Text>To continue type migrate to mobile in the field below</Text>
          <Input
           
            placeholder="Type here a confirmation text"
            style={{ width: "70%" }}
          />
          <Row>
            <Col md={24}>
              <Button type="primary" block style={{ width: "150px" }}>
                Delete
              </Button>
            </Col>
          </Row>
        </Row>
      </Modal>






      <Modal
      title=""
      open={isModalOpen4}
      onOk={handleOk4}
      onCancel={handleCancel4}
      okText="Confirm"
      cancelText="Cancel"
      centered
      width={500}
      footer={null}
    >
      <Row
        justify="center"
        align="middle"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <Row>
          <Text>Provide your personal data</Text>
        </Row>
        <Text>Total to pay R$99</Text>
        <Text>Remember to fill in the Name field.</Text>
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => console.log(values)} // Handle form submission
        >
          <Form.Item
            label=""
            name="name"
            rules={[{ required: true, message: 'Please enter your name!' }]}
          >
            <Input placeholder="Name" />
          </Form.Item>

          <Form.Item
            label=""
            name="email"
            rules={[{ required: true, message: 'Please enter your email!' }]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            label=""
            name="cpfCnpj"
            rules={[{ required: true, message: 'Please enter CPF/CNPJ!' }]}
          >
            <Input placeholder="CPF/CNPJ" />
          </Form.Item>

          {/* <Form.Item
            label=""
            name="phone"
            rules={[{ required: true, message: 'Please enter your phone number!' }]}
          > */}
            <Row align="middle" justify="center">
              <Space>
                <Col>
                  <Form.Item
                    name="ddd"
                    rules={[{ required: true, message: 'Please enter DDD!' }]}
                  >
                    <InputNumber placeholder="DDD" />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item
                    name="number"
                    rules={[{ required: true, message: 'Please enter your number!' }]}
                  >
                    <Input
                     
                      placeholder="Number"
                      style={{ width: '105%' }}
                    />
                  </Form.Item>
                </Col>
              </Space>
            </Row>
          {/* </Form.Item> */}
        </Form>
        <Button
          type="primary"
         
          style={{ width: '70%' }}
          onClick={handleOk4}
        >
          Continue <DoubleRightOutlined />
        </Button>
      </Row>
    </Modal>
    </>
  );
}

export default Payment;

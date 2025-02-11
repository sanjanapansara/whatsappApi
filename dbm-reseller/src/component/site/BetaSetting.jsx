import { CheckOutlined } from "@ant-design/icons";
import { Button, Col, message, Row, Switch, Typography } from "antd";
import React, { useState } from "react";

function BetaSetting() {
  const [checked, setChecked] = useState(false);

  const handleSwitchChange = (value) => {
    if (!value) {
      return;
    }
    setChecked(value);
  };

  const handleOk = () => {
    message.success("Saved successfully!");
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Row align="middle" justify="space-between">
            <Col>
              <Typography.Text strong>Button Messages</Typography.Text>
              <Typography.Text style={{ display: "block" }}>
                When activating you agree with the <a href="#!">Terms of use</a>
                of the buttons.
              </Typography.Text>
            </Col>
            <Col>
              <Switch
                checked={checked}
                onChange={handleSwitchChange}
                checkedChildren={<CheckOutlined />}
                defaultChecked
              />
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <Row align="middle" justify="space-between">
            <Col>
              <Typography.Text strong>Mobile Instances</Typography.Text>
              <Typography.Text style={{ display: "block" }}>
                Connect a WhatsApp without needing a cell phone.
              </Typography.Text>
            </Col>
            <Col>
              <Switch
                checked={checked}
                onChange={handleSwitchChange}
                checkedChildren={<CheckOutlined />}
                defaultChecked
              />
            </Col>
          </Row>
        </Col>

        <Col span={24} style={{ textAlign: "center" }}>
          <Button type="primary" onClick={handleOk}>
            Save
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default BetaSetting;

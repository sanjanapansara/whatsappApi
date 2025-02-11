import { CheckOutlined } from "@ant-design/icons";
import { Button, Card, Col, message, Row, Switch, Typography } from "antd";
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
      <Card>
        <Row gutter={[16, 16]}>
          <Col md={24}>
            <Row align="middle" justify="space-between">
              <Col>
                <Typography.Text strong>Button Messages</Typography.Text>
                <Typography.Text style={{ display: "block" }}>
                  When activating you agree with the{" "}
                  <a href="#!">Terms of use</a>
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

          <Col md={24}>
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

          <Col md={5}  align="center">
            <Button type="primary" onClick={handleOk} block>
              Save
            </Button>
          </Col>
        </Row>
      </Card>
    </>
  );
}

export default BetaSetting;

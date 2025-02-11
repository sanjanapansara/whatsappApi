import React from "react";
import { Badge, Button, Card, Typography } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
const { Title } = Typography;
// eslint-disable-next-line react/prop-types
const Success = ({handleSuccess}) => {

  return (
    <React.Fragment style={{ textAlign: "center" }}>
      <Card style={{ textAlign: "center",border:"none" }}>
        <Badge
          count={
            <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 48 }} />
          }
          style={{ backgroundColor: "white" }}
        />
        <Title level={3}>PIN Successfully!</Title>
        <p>
          Your Lock PIN has been successfully . You
          can now use this PIN to secure your account.
        </p>
        <Button
          type="primary"

          style={{ marginTop: 20 }}
          onClick={handleSuccess}
        >
          Done
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Success;

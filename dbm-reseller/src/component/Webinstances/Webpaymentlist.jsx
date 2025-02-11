import {  Col, Pagination, Row, Space, Table, } from "antd";
import React from "react";

function Webpaymentlist() {


  // const dataSource = [
  //   {
  //     key: "1",
  //     webInstanceName: "01D6D6F43E7BAAE7FBE28190",
  //     value: "Pagar.Me",
  //     paidon: "3D9065C1223090EC9BDE0A...",
  //     receipts: "01D6D6F43E7BAAE7FBE28190",
  //   },
  //   {
  //     key: "2",
  //     webInstanceName: "My number",
  //     value: "Pagar.Me",
  //     paidon: "3D9061EA825EF0EC4B950A...",
  //     receipts: "76122851D206B4880B20D76B",
  //   },
  // ];
  const dataSource = Array.from({
    length: 100,
  }).map((_, i) => ({
    key: i,
    webInstanceName: "My number",
    value: "Pagar.Me",
    paidon: "3D9061EA825EF0EC4B950A...",
    receipts: "76122851D206B4880B20D76B",
  }));
  const columns = [
    {
      title: "Web Instance Name",
      dataIndex: "webInstanceName",
      key: "webInstanceName",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (text) => (
        <Space>
          {text} 
        </Space>
      ),
    },
    {
      title: "Paid On",
      dataIndex: "paidon",
      key: "paidon",
    },

    {
      title: "Receipts",
      dataIndex: "receipts",
      key: "receipts",
    },
  ];
  return (
    <>
      <Row>
        <Col span={24}>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={{
              pageSize: 10,
            }}
            scroll={{
              x: "max-content",
            }}
          />
        </Col>
      </Row>
      {/* <Row justify="end" style={{ marginTop: 16 }}>
          <Col>
            <Pagination defaultCurrent={1} total={50} />
          </Col>
        </Row> */}
    </>
  );
}

export default Webpaymentlist;

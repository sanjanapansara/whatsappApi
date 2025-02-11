/* eslint-disable */
import React from 'react'
import { Result, Button } from 'antd'
import { t } from 'i18next'
import { useNavigate } from "react-router-dom";
const NotFound = () => {
  const navigate = useNavigate();
  return (<Result
    status="404"
    title="404"
    subTitle={t("notFound.somethingiswrong")}
    extra={<Button type="primary" onClick={() => navigate('/')}>{("notFound.home")}</Button>}
  />)
}
export default NotFound

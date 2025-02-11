import { Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const UserInfo = () => {
  const { t, i18n } = useTranslation();
  const profile = useSelector((state) => state.user.profile);

  return (
    <>
      <Typography.Title level={1} style={{ color: "white", margin: "0px" }}
      >{t("welcome", { var1: profile?.name })}</Typography.Title>
    </>
  );
};
export default UserInfo;

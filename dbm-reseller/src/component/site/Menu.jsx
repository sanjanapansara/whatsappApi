import { useEffect, useState } from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  ShoppingOutlined,
  KeyOutlined,
  TeamOutlined,
  SnippetsOutlined,
  SettingOutlined,
  SyncOutlined,
  CommentOutlined,
  FileProtectOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { changePageTitle } from "../../redux/reducers/reducer.setting";
import { useDispatch } from "react-redux";

const { SubMenu } = Menu;

const menuArray = [
  {
    key: 1,
    name: "Dashboard",
    value: "",
    icon: HomeOutlined,
    translate: "menu.dashboard",
  },
  {
    name: "License keys",
    value: "license-keys",
    icon: KeyOutlined,
    translate: "menu.licenseKeys",
  },
  {
    name: "Trial Keys",
    value: "trial-keys",
    icon: KeyOutlined,
    translate: "menu.trialkeys",
  },
  {
    name: "Rebranding Setting",
    value: "rebranding-setting",
    icon: SettingOutlined,
    translate: "menu.rebrandingSetting",
  },
  {
    name: "Shop",
    value: "shop",
    icon: ShoppingOutlined,
    translate: "menu.shop",
  },
  {
    name: "Orders",
    value: "orders",
    icon: ShoppingOutlined,
    translate: "menu.orders",

  },
  {
    name: "Customer",
    value: "customers",
    icon: TeamOutlined,
    translate: "menu.customer",
  },
  {
    name: "Activities",
    value: "activities",
    icon: SyncOutlined,
    translate: "menu.activities",
  },
  {
    name: "Templates",
    value: "templates",
    icon: SnippetsOutlined,
    translate: "menu.templates",
  },
  {
    name: "Feedback",
    value: "feedback",
    icon: CommentOutlined,
    translate: "menu.feedback",
  },
  {
    name: "privacyPolicy",
    value: "privacy-policy",
    icon: FileProtectOutlined,
    translate: "menu.privacyPolicy",
  },
];

const CustomerMenu = ({ theme }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [selectedKeys, setSelectedKeys] = useState([]);
  const location = useLocation(); // Get current location
  const navigate = useNavigate(); // Get history to programmatically navigate
  useEffect(() => {
    // Update selected menu key based on current location
    const path = location?.pathname;
    const selectedKey = `/${path.split("/")[1]}`; // Extract the first segment of the path
    setSelectedKeys([selectedKey]);
  }, [location]);

  const handleSelect = ({ key }) => {
    setSelectedKeys([key]);
    const menu = menuArray?.find((x) => key == ("/" + x.value));
    if (menu) {
      dispatch(changePageTitle(menu?.translate));
    } else {
      console.log("menu not found!")
    }
    navigate(key);
  };



  return (
    <Menu
      theme={theme}
      mode="inline"
      selectedKeys={selectedKeys}
      onSelect={handleSelect}
    >
      {menuArray?.map(({ name, translate, value, icon: Icon, children }) =>
        _.isEmpty(children) ? (
          <Menu.Item
            key={`/${value}`}
            icon={Icon ? <Icon /> : ""}
            title={t(translate)}
          >
            {t(translate)}
          </Menu.Item>
        ) : (
          <SubMenu key={value} icon={Icon ? <Icon /> : ""} title={name}>
            {children.map(({ name, value: c_value, icon: Icon }) => (
              <Menu.Item
                key={`/${value}/${c_value}`}
                icon={Icon ? <Icon /> : ""}
                title={`/${name}`}
              >
                {name}
              </Menu.Item>
            ))}
          </SubMenu>
        )
      )}
    </Menu>
  );
};

export default CustomerMenu;

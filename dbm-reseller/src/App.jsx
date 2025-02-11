import React, { useEffect, useMemo, useState } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { Space, Result, ConfigProvider, Skeleton } from "antd";
import { WhatsAppOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import { connect, useDispatch, useSelector } from "react-redux";
import i18next from "i18next";
import { Helmet } from "react-helmet";
import ProLayout from "./component/site/ProLayout"
import Dashboard from "./component/user/Dashboard"
import Login from "./component/user/Login";
import LicenseKey from "./component/user/LicenseKey"
import Shop from "./component/user/Shop"
import Customer from "./component/user/Customer";
import Templates from "./component/user/Templates";
import Setting from "./component/user/Setting";
import Activities from "./component/user/Activities";
import Feedback from "./component/user/Feedback";
import Profile from "./component/user/Profile";
import Orders from "./component/user/Orders";
import Invoice from "./component/user/Invoice";
import PaymentSuccess from "../src/component/user/PaymentSuccess/PaymentSuccess";
import PaymentFailed from "../src/component/user/PaymentSuccess/PaymentFailed";
import PropTypes from "prop-types";
import { getMediaPath } from "./lib";
import Session from "./component/user/AccountInformation/Session";
// import TermsAndConditions from "./component/user/PolicyPages/TermsAndConditions";
// import RefundPolicy from "/user/PolicyPages/RefundPolicy";
import PolicyPage from "./component/user/PolicyPage";
import WhatsApp from "./component/user/Support/Whatsapp";
import "./App.css";
import { getExchangeRates, getPanelDetails, refreshProfile } from "./redux/action";
import PolicyProLayout from "./component/site/PolicyProLayout";
import BetaSetting from "./component/site/BetaSetting";
import WebInstances from "./component/Webinstances/WebInstances";
import Webinstancedata from "./component/Webinstances/webinstancedata";
import WebinstanceView from "./component/Webinstances/WebinstanceView";
import payment from "./component/Webinstances/payment";
import Webpaymentlist from "./component/Webinstances/Webpaymentlist";
import Checkout from "./component/Webinstances/Checkout";



// Protected Route Component
const ProtectedRoute = ({ component: Component, publicRoute, isAuthenticated, isPolicyRoute = false, ...props }) => {
  if (!isAuthenticated && !publicRoute) {
    return <Navigate to="/" replace />;
  }
  if (isPolicyRoute) {
    return (
      <PolicyProLayout>
        <Component {...props} />
      </PolicyProLayout>
    );
  }

  return publicRoute ? (
    <Component {...props} />
  ) : (
    <ProLayout>
      <Component {...props} />
    </ProLayout>
  );
};

// Loading Component
const LoadingUI = () => (
  <Space direction="vertical" style={{ width: "100%", height: "97vh", justifyContent: "center" }}>
    <Result icon={<Skeleton />} />
  </Space>
);

// Main App Component
const App = ({ isLogin, Panel, loading }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDataFetched, setIsDataFetched] = useState(false);
  const setting = useSelector((state) => state?.setting);
  const panel = useSelector((state) => state?.setting?.panel);
  const isDarkMode = useSelector((state) => state?.app?.theme);
  const UserData = useSelector((state) => state?.user?.profile);

  const title = useMemo(() => panel?.reseller?.title ?? "Reseller Panel", [panel]);
  const description = useMemo(() => panel?.reseller?.description ?? "", [panel]);
  const slogan = useMemo(() => panel?.reseller?.slogan ?? "", [panel]);
  const favicon = useMemo(() => panel?.reseller?.favicon ?? "", [panel]);

  var load = 0;

  useEffect(() => {
    load = load + 1;
    const fetchData = async () => {
      dispatch(getPanelDetails());
      dispatch(getExchangeRates());
      setIsDataFetched(true);
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (isLogin) {
      dispatch(refreshProfile());
    }
  }, [isLogin]);

  useEffect(() => {
    if (UserData === null && isLogin) {
      navigate('/');
    }
  }, [UserData, navigate, isLogin]);

  useEffect(() => {
    i18next.changeLanguage(setting?.lang ?? "en");
  }, [setting]);

  // Define all routes including public ones
  const routes = [
    { path: "/", component: Dashboard },
    { path: "/license-keys", component: LicenseKey },
    { path: "/trial-keys", component: LicenseKey, props: { isTrial: true } },
    { path: "/shop", component: Shop },
    { path: "/customers", component: Customer },
    { path: "/templates", component: Templates },
    { path: "/rebranding-setting", component: Setting },
    { path: "/activities", component: Activities },
    { path: "/orders", component: Orders },
    { path: "/feedback", component: Feedback },
    { path: "/web-instance", component: WebInstances,  props: { isLogin: isLogin },  },
    { path: "/webinstance-data", component: Webinstancedata },
    { path: "/webinstance-view", component: WebinstanceView },
    { path: "/payment", component: payment},
    { path: "/webpayment-list", component: Webpaymentlist },
    { path: "/checkout", component: Checkout },




    {
      path: "/privacy-policy",
      component: PolicyPage,
      props: { type: "privacyPolicy" },
      publicRoute: true,
      isPolicyRoute: true
    },
    {
      path: "/terms-and-conditions",
      component: PolicyPage,
      props: { type: "termsAndConditions" },
      publicRoute: true,
      isPolicyRoute: true
    },
    {
      path: "/refund-policy",
      component: PolicyPage,
      props: { type: "refundPolicy" },
      publicRoute: true,
      isPolicyRoute: true
    },
    { path: "/profile", component: Profile },
    { path: "/invoice", component: Invoice },
    { path: "/payment-success", component: PaymentSuccess },
    { path: "/payment-failed", component: PaymentFailed },
    { path: "/beta-setting", component: BetaSetting },
    { path: "/session", component: Session },
  ];

  const themeConfig = {
    token: {
      colorPrimary: isDarkMode ? "#1890ff" : "#1890ff",
      colorBgBase: isDarkMode ? "#333" : "#ffffff",
      colorTextBase: isDarkMode ? "#ffffff" : "#000000",
      colorWarningBg: isDarkMode ? "" : "#fffbe6",
    },
  };

  if (!isDataFetched || loading) {
    return <LoadingUI />;
  }

  return (
    <ConfigProvider
      locale="en"
      theme={{
        ...themeConfig,
        components: {
          Select: {
            optionActiveBg: isDarkMode ? "#666666" : "#d9d9d9",
            optionSelectedBg: isDarkMode ? "#1890ff" : "#e6f4ff",
            colorText: isDarkMode ? "#fff" : "#000000",
          },
          Table: {
            rowHoverBg: isDarkMode ? "#1890ff" : "#f2f2f2",
            rowSelectedBg: isDarkMode ? "#1890ff" : "#f2f2f2",
            rowSelectedHoverBg: isDarkMode ? "#1890ff" : "#f2f2f2",
            colorText: isDarkMode ? "#fff" : "#000",
          },
          Switch: {
            colorPrimary: isDarkMode ? "#126be7" : "#1890ff",
          },
          Alert: {
            colorWarningBg: isDarkMode ? "#ffe58f" : "#fffbe6",
            colorTextHeading: isDarkMode ? "#000000" : "#000000",
          }
        }
      }}
      getTargetContainer={() => document.getElementById("test-pro-layout") || document.body}
    >
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="author" content={slogan} />
        <link rel="icon" type="image/png" href={getMediaPath(favicon)} />
      </Helmet>

      <Routes>
        {!isLogin || UserData === null ? (
          <>
            <Route path="/" element={<Login />} />
            {routes
              .filter(route => route.publicRoute)
              .map(({ path, component: Component, props = {}, isPolicyRoute = false }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <ProtectedRoute
                      component={Component}
                      isAuthenticated={false}
                      publicRoute={true}
                      isPolicyRoute={isPolicyRoute}
                      {...props}
                    />
                  }
                />
              ))
            }
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          routes.map(({ path, component: Component, props = {}, publicRoute = false, isPolicyRoute = false }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute
                  component={Component}
                  isAuthenticated={isLogin}
                  publicRoute={publicRoute}
                  isPolicyRoute={isPolicyRoute}
                  {...props}
                />
              }
            />
          ))
        )}
      </Routes>

      <FloatButton.Group
        placement="top"
        trigger="hover"
        type="default"
        style={{
          marginBottom: -35,
          zIndex: 1000,
          right: "84%",
        }}
        icon={<WhatsAppOutlined style={{ color: "green" }} />}
      >
        <WhatsApp />
      </FloatButton.Group>
    </ConfigProvider>
  );
};

App.propTypes = {
  isLogin: PropTypes.bool.isRequired,
  Panel: PropTypes.object,
  loading: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isLogin: state?.user?.token && state?.user?.profile?.status === "active",
  loading: state?.user?.loading,
  Panel: state?.setting?.panel
});

export default connect(mapStateToProps)(App);
import { HomeOutlined, DownOutlined, SunOutlined, MoonOutlined, SafetyOutlined } from "@ant-design/icons";
import { PageContainer, ProConfigProvider, ProLayout, } from "@ant-design/pro-components";
import {
Breadcrumb, Button, ConfigProvider, Dropdown, Image,
Select, Space, Tooltip, Typography
} from "antd";
import React, {
    // useContext,
    useEffect, useMemo, useRef, useState
} from "react";
import moment from "moment";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { changeCurrency, changeLanguage } from "../../redux/reducers/reducer.setting";
import lang from "../../util/lang/lang.json";
import Link from "antd/es/typography/Link";
import i18next from "i18next";
import { getExchangeRates, getPanelDetails } from "../../redux/action";
import { getMediaPath } from "../../lib";
import { setTheme } from "../../redux/reducers/reducer.app";

const PolicyProLayout = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const currency = useSelector((state) => state?.setting?.currency);
    const panel = useSelector((state) => state?.setting?.panel)
    const theme = useSelector((state) => state?.app?.theme);
    const setting = useSelector((state) => state?.setting);

    const logo = useMemo(() => panel?.reseller?.logo ?? "", [panel]);
    const CompanyName = useMemo(() => panel?.billing?.name ?? "", [panel]);
    const profile = useSelector((state) => state?.user?.profile);

    const [pathname, setPathname] = useState(location?.pathname);
    const [menuCollapsed, setMenuCollapsed] = useState(true);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(theme);

    const mainLayoutRef = useRef();
    const subLayoutRef = useRef();

    useEffect(() => {
        dispatch(getPanelDetails());
        dispatch(getExchangeRates());
    }, [dispatch]);

    const handleLanguageChange = (e) => {
        i18next.changeLanguage(e ?? "en")
        dispatch(changeLanguage(e))
    }

    const menuList = [
        {
            name: "Privacy Policy",
            key: "/privacy-policy",
            icon: <SafetyOutlined />,
        },
        {
            name: "Terms And Conditions",
            key: "/terms-and-conditions",
            icon: <SafetyOutlined />,
        },
        {
            name: "Refund policy",
            key: "/refund-policy",
            icon: <SafetyOutlined />,
        },
    ];

    const handleMenuChange = (path) => {
        //find main menu from pathname
        const menu = menuList?.find(
            (m) => m.key === path || (m.children ?? []).find((s) => s.key === path)
        );
        if (menu) {
            setSelectedMenu(menu);
        } else {
            setSelectedMenu(null);
        }
    };

    useEffect(() => {
        handleMenuChange(pathname);
    }, [pathname]);

    useEffect(() => {
        setPathname(location.pathname);
    }, [location.pathname]);

    useEffect(() => {
        if (setting) {
            if (mainLayoutRef) {
                mainLayoutRef.current?.reload();
            }
        }
    }, [setting]);


    useEffect(() => {
        if (selectedMenu) {
            if (selectedMenu.children) {
                const subMenu = selectedMenu.children.find((s) => s.key == pathname);
                if (subMenu) {
                    navigate(subMenu.key);
                } else {
                    navigate(selectedMenu.children[0].key);
                }
            } else {
                navigate(selectedMenu.key);
            }
        }

        subLayoutRef.current?.reload();
    }, [selectedMenu]);

    //Main Menu
    const mainMenuPro = useMemo(() => {
        return menuList?.map((item) => {
            return {
                path: item.key,
                name: item.label,
            };
        });
    }, [setting]);

    if (typeof document === "undefined") {
        return <div />;
    }

    // Bread crumbs
    const BreadcrumbCustom = () => {
        const pathSegments = location.pathname.split("/").filter(Boolean);

        const items = pathSegments.map((segment, index) => {
            const pathToNavigate = `/${pathSegments.slice(0, index + 1).join("/")}`;
            const isLastSegment = index === pathSegments.length - 1;

            return {
                title: isLastSegment ? (
                    <span style={{ textTransform: 'capitalize' }}>{segment}</span>
                ) : (
                    <span
                        style={{ cursor: "pointer", textTransform: 'capitalize' }}
                        onClick={() => {
                            navigate(pathToNavigate);
                        }}
                    >
                        {segment}
                    </span>
                ),
            };
        });

        // Add home as the first breadcrumb item
        const breadcrumbItems = [{ title: <HomeOutlined onClick={() => navigate("/")} /> }, ...items];

        return <Breadcrumb items={breadcrumbItems?.filter(Boolean)} />;
    };
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        dispatch(setTheme(!isDarkMode))
    };
    return (
        <React.Fragment>
            <div
                id="test-pro-layout"
                style={{
                    height: "100vh",
                    overflow: "auto",
                }}
            >
                <ProConfigProvider hashed={false} locale="en">
                    <ConfigProvider
                        locale="en"
                        getTargetContainer={() => {
                            return (
                                document.getElementById("test-pro-layout") || document.body
                            );
                        }}
                    >
                        <ProLayout
                            actionRef={mainLayoutRef}
                            prefixCls="pro-layout-main"
                            locale="en-US"
                            fixedHeader={true}
                            logo={<Image src={getMediaPath(logo)} alt="logo" width={100} preview={false} style={{ objectFit: "contain" }} />}
                            collapsed={menuCollapsed}
                            onCollapse={(value) => setMenuCollapsed(value)}
                            location={{
                                pathname,
                            }}
                            token={{
                                header: {
                                    colorBgMenuItemSelected: "rgba(0,0,0,0.04)",
                                },
                            }}

                            actionsRender={(props) => {
                                if (props?.isMobile) return [isDarkMode ? (
                                    <SunOutlined key="SunOutlined" onClick={toggleTheme} style={{ marginRight: 20 }} />
                                ) : (
                                    <MoonOutlined key="MoonOutlined" onClick={toggleTheme} style={{ marginRight: 20 }} />
                                ),];
                                if (typeof window === "undefined") return [];
                                return [
                                    isDarkMode ? (
                                        <MoonOutlined key="MoonOutlined" onClick={toggleTheme} style={{ marginRight: 10 }} />
                                    ) : (
                                        <SunOutlined key="SunOutlined" onClick={toggleTheme} style={{ marginRight: 10 }} />
                                    ),
                                    <>
                                        <Dropdown
                                            key="pay"
                                            menu={{
                                                items: panel?.currencies?.map((currencyItem) => {
                                                    return {
                                                        key: currencyItem._id,
                                                        label: (
                                                            <Space align="center">
                                                                {currencyItem?.code}
                                                            </Space>
                                                        ),
                                                        onClick: () => {
                                                            dispatch(changeCurrency(currencyItem?.code));
                                                        },
                                                    };
                                                }),
                                            }}
                                        >
                                            <Button>
                                                {currency}
                                                <DownOutlined />
                                            </Button>
                                        </Dropdown>
                                        <Typography.Text strong>
                                            {t("dashboard.selectLanguage")}
                                        </Typography.Text>

                                        <Select
                                            defaultValue={setting?.lang ?? "en"} // Use current language from Redux state or default to English
                                            listHeight={200}
                                            showSearch
                                            style={{
                                                height: 45,
                                                width: 150,
                                            }}
                                            onChange={handleLanguageChange}
                                            options={lang?.map((x) => ({
                                                value: x.key,
                                                label: x.name
                                            }))}
                                        />
                                    </>
                                ];
                            }}
                            headerTitleRender={(logo, title, _) => {
                                const defaultDom = (
                                    <Tooltip arrow={false} title={panel?.title ?? ""}><Link to={"/"}>{logo}</Link></Tooltip>
                                );
                                if (typeof window === "undefined") return defaultDom;
                                if (document.body.clientWidth < 1400) {
                                    return defaultDom;
                                }
                                if (_.isMobile) return defaultDom;
                                return (
                                    <>
                                        {defaultDom}
                                    </>
                                );
                            }}
                            menu={{
                                request: () => {
                                    return mainMenuPro;
                                },
                                collapsedShowGroupTitle: true,
                            }}
                            menuFooterRender={(props) => {
                                if (props?.collapsed) return undefined;
                                return (
                                    <div
                                        style={{
                                            textAlign: "center",
                                            paddingBlockStart: 12,
                                        }}
                                    >
                                        <div>© {moment().format("yyyy")} Designed & Developed</div>
                                        by{" "}
                                        <small>
                                            <strong>{CompanyName}</strong>
                                        </small>
                                    </div>
                                );
                            }}
                            fixSiderbar={false}
                            layout="top"
                            splitMenus={false}
                            siderWidth={0}
                        >
                            <div style={{ margin: "1rem 2.5rem 0rem", marginTop: " 12px" }}>
                                <BreadcrumbCustom />
                            </div>
                            <PageContainer>
                                {children}
                            </PageContainer>
                        </ProLayout>
                    </ConfigProvider>
                </ProConfigProvider>
            </div >
        </React.Fragment>
    );
};

export default PolicyProLayout;
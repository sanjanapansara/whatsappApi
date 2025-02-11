import { useState, useEffect } from 'react';
import { ConfigProvider, Button, Row, Input, Col, Form, ColorPicker, Space } from 'antd';
import { Editor } from '@monaco-editor/react';

const ThemeCustomizes = ({ themeConfig, onThemeConfigChange, rebrand }) => {

    const [form] = Form.useForm();
    const [themeMode, setThemeMode] = useState(rebrand?.theme?.mode || themeConfig?.mode);
    const [primaryColor, setPrimaryColor] = useState(rebrand?.theme?.token?.colorPrimary || rebrand?.theme?.colorPrimary);
    const [borderRadius, setBorderRadius] = useState(rebrand?.theme?.token?.borderRadius || rebrand?.theme?.token?.borderRadius);

    // Initialize form values
    useEffect(() => {
        form.setFieldsValue({
            primaryColor: rebrand?.theme?.token?.colorPrimary || primaryColor,
            borderRadius: rebrand?.theme?.token?.borderRadius || borderRadius
        });
    }, []);

    // Update parent component when values change
    useEffect(() => {
        const newConfig = {
            mode: themeMode,
            token: {
                colorPrimary: primaryColor,
                borderRadius: borderRadius,
            },
        };
        onThemeConfigChange(newConfig);
    }, [themeMode, primaryColor, borderRadius]);

    const modeButtons = [
        { label: "Dark", value: "dark" },
        { label: "Light", value: "light" },
        { label: "System", value: "system" }
    ];

    return (

        <Form form={form}>
            <Row gutter={[16, 16]} style={{ marginBottom: 40 }}>
                <Col xs={24} sm={24} md={12}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={24}>
                            <Space direction="horizontal" style={{ width: '100%', marginBottom: 12 }}>
                                {modeButtons?.map((mode) => (
                                    <Button
                                        key={mode?.value}
                                        type={themeMode === mode.value ? 'primary' : 'default'}
                                        onClick={() => setThemeMode(mode.value)}
                                    >
                                        {mode.label}
                                    </Button>
                                ))}
                            </Space>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={12}>
                            <Form.Item label="Primary Color" name="primaryColor">
                                <ColorPicker
                                    style={{ width: '100%', justifyContent: 'start' }}
                                    format="hex"
                                    disabledAlpha
                                    value={primaryColor}
                                    showText
                                    onChange={(color) => setPrimaryColor(color.toHexString())}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12}>
                            <Form.Item label="Border Radius" name="borderRadius">
                                <Input
                                    type="number"
                                    value={borderRadius}
                                    placeholder="Border Radius"
                                    onChange={(e) => setBorderRadius(Number(e.target.value))}
                                    min="0"
                                    max="24"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} sm={24} md={12}>
                    <Form.Item label="Theme Config">
                        <Editor
                            height="100px"
                            defaultLanguage="json"
                            value={JSON.stringify({
                                mode: themeMode,
                                token: {
                                    colorPrimary: primaryColor,
                                    borderRadius: borderRadius,
                                },
                            }, null, 2)}
                            options={{
                                readOnly: true,
                            }}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default ThemeCustomizes;
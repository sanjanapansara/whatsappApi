"use client"

import { Button, Typography, Row, Col, Space,Image } from "antd"
import { ToolOutlined, MessageOutlined } from "@ant-design/icons"
import { useState, useEffect } from "react"

const { Title, Text } = Typography

export default function MaintenancePage() {
  const [countdown, setCountdown] = useState({
    hours: 2,
    minutes: 0,
    seconds: 0,
  })

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Row className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8" gutter={[0, 32]}>
        {/* Image and Icon */}
        <Col xs={24} className="text-center">
          <div className="relative w-64 h-64 mx-auto mb-8">
            <Image
              src="/placeholder.svg?height=256&width=256"
              alt="Maintenance Illustration"
              width={256}
              height={256}
              className="object-contain"
            />
          </div>
          <Space className="justify-center">
            <ToolOutlined className="text-2xl text-blue-500" />
          </Space>
        </Col>

        {/* Content */}
        <Col xs={24} className="text-center">
          <Space direction="vertical" className="w-full" size="large">
            <Title level={2}>We're Currently Under Maintenance</Title>
            <Text className="text-gray-500 text-lg">
              We're working hard to improve our website and we'll be back soon
            </Text>
          </Space>
        </Col>

        {/* Countdown */}
        <Col xs={24}>
          <Row gutter={[16, 16]} justify="center" className="text-center">
            <Col>
              <div className="bg-slate-100 rounded-lg p-4 min-w-[100px]">
                <Title level={3} className="m-0">
                  {String(countdown.hours).padStart(2, "0")}
                </Title>
                <Text className="text-gray-500">Hours</Text>
              </div>
            </Col>
            <Col>
              <div className="bg-slate-100 rounded-lg p-4 min-w-[100px]">
                <Title level={3} className="m-0">
                  {String(countdown.minutes).padStart(2, "0")}
                </Title>
                <Text className="text-gray-500">Minutes</Text>
              </div>
            </Col>
            <Col>
              <div className="bg-slate-100 rounded-lg p-4 min-w-[100px]">
                <Title level={3} className="m-0">
                  {String(countdown.seconds).padStart(2, "0")}
                </Title>
                <Text className="text-gray-500">Seconds</Text>
              </div>
            </Col>
          </Row>
        </Col>

        {/* Contact Button */}
        <Col xs={24} className="text-center">
          <Button type="primary" size="large" icon={<MessageOutlined />} className="min-w-[200px]">
            Contact Support
          </Button>
        </Col>

        {/* Footer Text */}
        <Col xs={24} className="text-center">
          <Text className="text-gray-400">Thank you for your patience and understanding.</Text>
        </Col>
      </Row>
    </div>
  )
}

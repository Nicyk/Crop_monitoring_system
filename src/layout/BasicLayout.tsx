import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import DemoPie from "@/components/Pie/Pie";
import Weather from "@/components/Weather/Weather";
import type { MenuProps } from "antd";
import {
  Breadcrumb,
  Button,
  Card,
  Flex,
  Layout,
  Menu,
  theme,
  Typography,
  Row,
  Col,
} from "antd";
import Recorder from "@/components/Recorder/Recorder";
import Video from "@/components/Video/Video";
import GreenhouseMap from "@/components/Map/Map";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

interface BasicLayoutProps {
  children?: React.ReactNode; // 支持子路由内容
}

const BasicLayout: React.FC<BasicLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ display: "flex", alignItems: "center", color: "white" }}>
        <h1>农作物大棚监控系统</h1>
      </Header>
      <Layout>
        {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}
        <Content style={{ margin: "8px 16px" }}>
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Row gutter={16}>
              {/* 左侧30%区域 - 包含Weather和DemoPie垂直排列 */}
              <Col span={7} style={{ width: "30%" }}>
                <Flex vertical gap={16}>
                  {/* Weather组件 */}
                  <Card
                    hoverable
                    styles={{
                      body: {
                        padding: 0,
                        overflow: "hidden",
                        height: "300px", // 确保内容填满卡片
                      },
                    }}
                  >
                    <Weather />
                  </Card>

                  {/* DemoPie组件 */}
                  <Card
                    hoverable
                    styles={{ body: { padding: 0, overflow: "hidden" } }}
                  >
                    <DemoPie />
                  </Card>

                  <Card
                    hoverable
                    styles={{ body: { padding: 0, overflow: "hidden" } }}
                  >
                    <Recorder />
                  </Card>
                </Flex>
              </Col>

              {/* 右侧70%区域 - 预留给其他内容 */}
              <Col span={17} style={{ width: "70%" }}>
                <Flex vertical gap={16}>
                  <Video />
                  <GreenhouseMap />
                </Flex>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;

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
import Suggestion from "@/components/Sugestion/Suggestion";

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
    <Layout style={{ height: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          height: "48px", // 减小Header高度
          lineHeight: "48px", // 减小行高以匹配
          padding: "0 16px",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "18px" }}>苹果园监控系统</h1>
      </Header>
      <Layout>
        <Content style={{ margin: "4px 8px" }}>
          <div
            style={{
              padding: "12px",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              height: "calc(100vh - 56px)", // 计算剩余高度
            }}
          >
            <Row gutter={[8, 8]} style={{ height: "100%" }}>
              {/* 左侧25%区域 - 包含Weather和Recorder垂直排列 */}
              <Col span={6} style={{ width: "25%", height: "100%" }}>
                <Flex vertical gap={8} style={{ height: "100%" }}>
                  {/* Weather组件 */}
                  <Card
                    hoverable
                    style={{
                      flex: "0 0 200px", // 设置固定高度而不是比例
                      maxHeight: "200px", // 设置最大高度
                      overflow: "hidden", // 确保内容不溢出
                    }}
                    bodyStyle={{
                      padding: 0, // 移除Card的内边距
                      height: "100%",
                    }}
                  >
                    <Weather />
                  </Card>

                  {/* Recorder组件 */}
                  <Card
                    hoverable
                    style={{ flex: "1" }} // 占据剩余空间
                  >
                    <Recorder />
                  </Card>
                </Flex>
              </Col>

              {/* 中间区域 - Video监控组件 */}
              <Col span={9} style={{ width: "37.5%", height: "100%" }}>
                <Flex vertical gap={8} style={{ height: "100%" }}>
                  {/* Video组件 */}
                  <Card
                    hoverable
                    style={{
                      flex: "0 0 calc(50% - 4px)", // 占50%高度(减去间隔的一半)
                      overflow: "hidden",
                    }}
                    bodyStyle={{
                      padding: 0,
                      height: "100%",
                    }}
                  >
                    <Video />
                  </Card>

                  {/* Suggestion组件 */}
                  <Card
                    hoverable
                    style={{
                      flex: "0 0 calc(50% - 4px)", // 占50%高度(减去间隔的一半)
                      overflow: "auto",
                    }}
                    bodyStyle={{
                      padding: 12, // 留些内边距给Suggestion组件
                      height: "100%",
                    }}
                  >
                    <Suggestion />
                  </Card>
                </Flex>
              </Col>

              {/* 右侧区域 - Map地图组件 */}
              <Col span={9} style={{ width: "37.5%", height: "100%" }}>
                <Card hoverable style={{ height: "100%" }}>
                  <GreenhouseMap />
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;

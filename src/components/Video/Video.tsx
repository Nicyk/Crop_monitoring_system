import React, { useState, useEffect } from "react";
import { Card, Typography, Select, Spin, Row, Col } from "antd";
import {
  VideoCameraOutlined,
  ExpandAltOutlined,
  CompressOutlined,
} from "@ant-design/icons";
import "./Video.css";
// 导入图片资源
import image1 from "../../assets/微信图片_20250418202658.jpg";
import image2 from "../../assets/微信图片_20250418202710.jpg";
import image3 from "../../assets/微信图片_20250418202752.jpg";
import image4 from "../../assets/微信图片_202504182027521.jpg";

const { Title, Text } = Typography;
const { Option } = Select;

// 视频源接口
interface VideoSource {
  id: string;
  name: string;
  url: string;
  location: string; // 苹果园位置
}

// 模拟视频源数据
const mockVideoSources: VideoSource[] = [
  {
    id: "1",
    name: "1号苹果园实时监控",
    url: image1,
    location: "1号苹果园",
  },
  {
    id: "2",
    name: "2号苹果园实时监控",
    url: image2,
    location: "2号苹果园",
  },
  {
    id: "3",
    name: "3号苹果园实时监控",
    url: image3,
    location: "3号苹果园",
  },
  {
    id: "4",
    name: "4号苹果园实时监控",
    url: image4,
    location: "4号苹果园",
  },
];

// 定义不同视角的数据
const viewAngles = [
  { id: 1, name: "入口监控", position: "正门" },
  { id: 2, name: "东区监控", position: "东侧" },
  { id: 3, name: "西区监控", position: "西侧" },
  { id: 4, name: "南区监控", position: "南侧" },
  { id: 5, name: "中央监控", position: "中央" },
  { id: 6, name: "北区监控", position: "北侧" },
  { id: 7, name: "灌溉系统", position: "滴灌区" },
  { id: 8, name: "温控系统", position: "控制室" },
  { id: 9, name: "全景监控", position: "顶部" },
];

const Video: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoSource>(
    mockVideoSources[0]
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>("");

  // 更新当前时间
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVideoChange = (videoId: string) => {
    setLoading(true);
    const selected = mockVideoSources.find((v) => v.id === videoId);
    if (selected) {
      setSelectedVideo(selected);
      // 模拟加载延迟
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const toggleFullScreen = () => {
    const videoElement = document.getElementById("monitoring-video");

    if (!fullScreen) {
      if (videoElement) {
        if (videoElement.requestFullscreen) {
          videoElement.requestFullscreen();
        } else if ((videoElement as any).webkitRequestFullscreen) {
          (videoElement as any).webkitRequestFullscreen();
        } else if ((videoElement as any).mozRequestFullScreen) {
          (videoElement as any).mozRequestFullScreen();
        } else if ((videoElement as any).msRequestFullscreen) {
          (videoElement as any).msRequestFullscreen();
        }
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }

    setFullScreen(!fullScreen);
  };

  // 处理全屏变化事件
  React.useEffect(() => {
    const handleFullScreenChange = () => {
      setFullScreen(
        document.fullscreenElement !== null ||
          (document as any).webkitFullscreenElement !== null ||
          (document as any).mozFullScreenElement !== null ||
          (document as any).msFullscreenElement !== null
      );
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    document.addEventListener("mozfullscreenchange", handleFullScreenChange);
    document.addEventListener("MSFullscreenChange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullScreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullScreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullScreenChange
      );
    };
  }, []);

  return (
    <Card
      title={
        <div className="video-header">
          <Title level={5} style={{ margin: 0 }}>
            <VideoCameraOutlined style={{ marginRight: 8 }} />
            苹果园多角度监控
          </Title>
          <Select
            defaultValue={selectedVideo.id}
            style={{ width: 180 }}
            onChange={handleVideoChange}
            className="video-selector"
            size="small"
          >
            {mockVideoSources.map((source) => (
              <Option key={source.id} value={source.id}>
                {source.name}
              </Option>
            ))}
          </Select>
        </div>
      }
      className="video-card"
      extra={
        <div className="video-actions">
          <Text strong className="location-text">
            {selectedVideo.location}
          </Text>
          <div
            className="fullscreen-btn"
            onClick={toggleFullScreen}
            title={fullScreen ? "退出全屏" : "全屏观看"}
          >
            {fullScreen ? <CompressOutlined /> : <ExpandAltOutlined />}
          </div>
        </div>
      }
      bodyStyle={{ padding: 8 }}
    >
      <div className="video-container" id="monitoring-video">
        {loading ? (
          <div className="video-loading">
            <Spin size="large" tip="加载视频中..." />
          </div>
        ) : (
          <div className="video-grid-container">
            <Row gutter={[4, 4]} className="video-grid">
              {viewAngles.map((angle) => (
                <Col span={8} className="video-grid-item" key={angle.id}>
                  <div className="video-frame">
                    <img
                      src={selectedVideo.url}
                      alt={`${selectedVideo.name} - ${angle.name}`}
                    />
                    <div className="video-overlay"></div>
                    <div className="video-timestamp">{currentTime}</div>
                    <div className="video-label">
                      {angle.name} - {angle.position}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Video;

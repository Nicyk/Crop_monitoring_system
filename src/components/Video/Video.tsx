import React, { useState } from "react";
import { Card, Typography, Row, Col, Select, Empty, Spin } from "antd";
import {
  VideoCameraOutlined,
  ExpandAltOutlined,
  CompressOutlined,
} from "@ant-design/icons";
import "./Video.css";

const { Title, Text } = Typography;
const { Option } = Select;

// 视频源接口
interface VideoSource {
  id: string;
  name: string;
  url: string;
  location: string; // 大棚位置
}

// 模拟视频源数据
const mockVideoSources: VideoSource[] = [
  {
    id: "1",
    name: "1号大棚实时监控",
    url: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4", // 示例公共视频URL
    location: "1号大棚",
  },
  {
    id: "2",
    name: "2号大棚实时监控",
    url: "https://media.w3.org/2010/05/bunny/movie.mp4",
    location: "2号大棚",
  },
  {
    id: "3",
    name: "3号大棚实时监控",
    url: "https://media.w3.org/2010/05/bunny/trailer.mp4",
    location: "3号大棚",
  },
  {
    id: "4",
    name: "4号大棚实时监控",
    url: "https://media.w3.org/2010/05/video/movie_300.mp4",
    location: "4号大棚",
  },
];

const Video: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoSource>(
    mockVideoSources[0]
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [fullScreen, setFullScreen] = useState<boolean>(false);

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
          <Title level={4}>
            <VideoCameraOutlined style={{ marginRight: 8 }} />
            农作物实时监控
          </Title>
          <Select
            defaultValue={selectedVideo.id}
            style={{ width: 180 }}
            onChange={handleVideoChange}
            className="video-selector"
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
    >
      <div className="video-container">
        {loading ? (
          <div className="video-loading">
            <Spin size="large" tip="加载视频中..." />
          </div>
        ) : (
          <video
            id="monitoring-video"
            className="monitoring-video"
            src={selectedVideo.url}
            controls
            autoPlay
            muted
            loop
            poster="/video-placeholder.jpg" // 你可以添加一个占位图片
          >
            你的浏览器不支持视频播放，请升级浏览器。
          </video>
        )}
      </div>
    </Card>
  );
};

export default Video;

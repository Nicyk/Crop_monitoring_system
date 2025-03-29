import React, { useEffect, useState, useRef } from "react";
import { Card, Spin, Typography, Divider, Tag, Button, Carousel } from "antd";
import {
  CloudOutlined,
  CompassOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import axios from "axios";
import "./Weather.css"; // 你可能需要创建这个CSS文件来添加自定义样式

const { Title, Text } = Typography;

interface WeatherCast {
  date: string;
  week: string;
  dayweather: string;
  nightweather: string;
  daytemp: string;
  nighttemp: string;
  daywind: string;
  nightwind: string;
  daypower: string;
  nightpower: string;
}

interface WeatherForecast {
  city: string;
  adcode: string;
  province: string;
  reporttime: string;
  casts: WeatherCast[];
}

interface WeatherResponse {
  status: string;
  count: string;
  info: string;
  infocode: string;
  forecasts: WeatherForecast[];
}

const WeatherComponent: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [error, setError] = useState<string | null>(null);
  const carouselRef = useRef<any>(null);

  // 获取星期几的中文名称
  const getWeekDay = (week: string): string => {
    const weekMap: Record<string, string> = {
      "1": "周一",
      "2": "周二",
      "3": "周三",
      "4": "周四",
      "5": "周五",
      "6": "周六",
      "7": "周日",
    };
    return weekMap[week] || week;
  };

  // 根据天气状况返回对应的颜色
  const getWeatherColor = (weather: string): string => {
    if (weather.includes("晴")) return "#ffc107";
    if (weather.includes("雨")) return "#03a9f4";
    if (weather.includes("阴")) return "#9e9e9e";
    if (weather.includes("云") || weather.includes("多云")) return "#90caf9";
    return "#4caf50";
  };

  // 获取天气数据
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<WeatherResponse>(
          "https://restapi.amap.com/v3/weather/weatherInfo",
          {
            params: {
              key: "7e2affa3889ae7d1ed34a2285a8dd3a9",
              city: "411282",
              extensions: "all",
            },
          }
        );

        if (
          response.data.status === "1" &&
          response.data.forecasts.length > 0
        ) {
          setForecast(response.data.forecasts[0]);
          setError(null);
        } else {
          setError("获取天气数据失败");
        }
      } catch (err) {
        setError("获取天气数据时出错");
        console.error("Weather data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();

    // 每30分钟刷新一次天气数据
    const intervalId = setInterval(fetchWeatherData, 30 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  // 控制轮播图
  const nextSlide = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  const prevSlide = () => {
    if (carouselRef.current) {
      carouselRef.current.prev();
    }
  };

  // 渲染天气卡片
  const renderWeatherCard = (cast: WeatherCast, index: number) => (
    <div key={cast.date} className="weather-card-container">
      <Card className="weather-detail-card">
        <div className="weather-card-title">
          <div>
            {cast.date}&nbsp;
            {getWeekDay(cast.week)}
            {index === 0 ? " (今天)" : ""}
          </div>
        </div>
        <div className="weather-temperature">
          {cast.daytemp}°C / {cast.nighttemp}°C
        </div>

        <div className="weather-conditions">
          <Tag color={getWeatherColor(cast.dayweather)} className="weather-tag">
            白天: {cast.dayweather}
          </Tag>
          <Tag
            color={getWeatherColor(cast.nightweather)}
            className="weather-tag"
          >
            夜间: {cast.nightweather}
          </Tag>
        </div>

        <div className="weather-wind">
          <CompassOutlined /> 风向: {cast.daywind} {cast.daypower}级
        </div>
      </Card>
    </div>
  );

  // 渲染错误信息
  if (error) {
    return (
      <Card>
        <Text type="danger">{error}</Text>
      </Card>
    );
  }

  return (
    <Card className="weather-main-card">
      {loading ? (
        <div className="weather-loading">
          <Spin tip="加载天气数据..." />
        </div>
      ) : forecast ? (
        <div>
          <div className="weather-header">
            <Text strong>
              {forecast.province} {forecast.city}
            </Text>
            <Text type="secondary" style={{ marginLeft: "8px" }}>
              更新时间: {forecast.reporttime}
            </Text>
          </div>

          <div className="carousel-container">
            <Button
              type="text"
              icon={<LeftOutlined />}
              onClick={prevSlide}
              className="carousel-arrow carousel-arrow-left"
            />

            <Carousel
              ref={carouselRef}
              dots={true}
              className="weather-carousel"
            >
              {forecast.casts.map((cast, index) =>
                renderWeatherCard(cast, index)
              )}
            </Carousel>

            <Button
              type="text"
              icon={<RightOutlined />}
              onClick={nextSlide}
              className="carousel-arrow carousel-arrow-right"
            />
          </div>
        </div>
      ) : (
        <Text>暂无天气数据</Text>
      )}
    </Card>
  );
};

export default WeatherComponent;

import React, { useEffect, useState, useRef } from "react";
import { Card, Spin, Typography, Tag, Button, Carousel } from "antd";
import {
  CloudOutlined,
  CompassOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import axios from "axios";
import "./Weather.css";

const { Text } = Typography;

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

  const getWeatherColor = (weather: string): string => {
    if (weather.includes("晴")) return "#ffc107";
    if (weather.includes("雨")) return "#03a9f4";
    if (weather.includes("阴")) return "#9e9e9e";
    if (weather.includes("云") || weather.includes("多云")) return "#90caf9";
    return "#4caf50";
  };

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

    const intervalId = setInterval(fetchWeatherData, 30 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

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

  const renderWeatherCard = (cast: WeatherCast, index: number) => (
    <div key={cast.date} className="weather-card-container">
      <Card className="weather-detail-card" size="small" bordered={false}>
        <div className="weather-card-title">
          {index === 0 ? "今天" : getWeekDay(cast.week)}
          <span style={{ fontSize: "12px", marginLeft: "4px" }}>
            {cast.date.split("-").slice(1).join("/")}
          </span>
        </div>
        <div className="weather-temperature">
          {cast.daytemp}°C / {cast.nighttemp}°C
        </div>

        <div className="weather-conditions">
          <Tag color={getWeatherColor(cast.dayweather)} className="weather-tag">
            {cast.dayweather}
          </Tag>
          <Tag
            color={getWeatherColor(cast.nightweather)}
            className="weather-tag"
          >
            {cast.nightweather}
          </Tag>
        </div>

        <div className="weather-wind">
          <CompassOutlined /> {cast.daywind} {cast.daypower}级
        </div>
      </Card>
    </div>
  );

  if (error) {
    return (
      <Card>
        <Text type="danger">{error}</Text>
      </Card>
    );
  }

  return (
    <Card className="weather-main-card" bordered={false}>
      {loading ? (
        <div className="weather-loading">
          <Spin size="small" tip="加载中..." />
        </div>
      ) : forecast ? (
        <div
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          <div className="weather-header">
            <Text strong style={{ fontSize: "0.9em" }}>
              {forecast.province} {forecast.city}
            </Text>
            <Text type="secondary" style={{ fontSize: "0.8em" }}>
              {forecast.reporttime.split(" ")[1]}
            </Text>
          </div>

          <div className="carousel-container">
            <Button
              type="text"
              size="small"
              icon={<LeftOutlined />}
              onClick={prevSlide}
              className="carousel-arrow carousel-arrow-left"
            />

            <Carousel
              ref={carouselRef}
              dots={false}
              className="weather-carousel"
              autoplay
            >
              {forecast.casts.map((cast, index) =>
                renderWeatherCard(cast, index)
              )}
            </Carousel>

            <Button
              type="text"
              size="small"
              icon={<RightOutlined />}
              onClick={nextSlide}
              className="carousel-arrow carousel-arrow-right"
            />
          </div>
        </div>
      ) : (
        <Text style={{ textAlign: "center" }}>暂无天气数据</Text>
      )}
    </Card>
  );
};

export default WeatherComponent;

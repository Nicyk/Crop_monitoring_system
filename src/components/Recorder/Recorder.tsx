import React, { useState, useEffect, useRef } from "react";
import { Card, List, Typography, Tag, Badge, Divider } from "antd";
import {
  AlertOutlined,
  FieldTimeOutlined,
  HomeOutlined,
  ThunderboltOutlined,
  ExperimentOutlined,
  ChromeOutlined,
  DeploymentUnitOutlined,
} from "@ant-design/icons";
import "./Recorder.css";

const { Title, Text } = Typography;

// 警报记录类型定义
interface AlertRecord {
  id: string;
  timestamp: string;
  greenhouseId: string; // 大棚ID
  cropType: string;
  alertType: "temperature" | "humidity" | "soil" | "light" | "pest"; // 环境因素警报类型
  value: string; // 环境参数值
  threshold: string; // 阈值
  severity: "high" | "medium" | "low";
  description: string;
  status: "pending" | "processing" | "resolved";
}

// 获取随机时间
const getRandomTime = () => {
  const now = new Date();
  const randomMinutes = Math.floor(Math.random() * 60 * 24); // 随机分钟数（一天内）
  now.setMinutes(now.getMinutes() - randomMinutes);
  return now.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 模拟警报数据
const mockAlertRecords: AlertRecord[] = [
  {
    id: "1",
    timestamp: getRandomTime(),
    greenhouseId: "1号大棚",
    cropType: "小白菜",
    alertType: "temperature",
    value: "32°C",
    threshold: "28°C",
    severity: "high",
    description: "大棚温度过高，可能导致作物生长受阻",
    status: "pending",
  },
  {
    id: "2",
    timestamp: getRandomTime(),
    greenhouseId: "2号大棚",
    cropType: "西红柿",
    alertType: "humidity",
    value: "25%",
    threshold: "40-60%",
    severity: "medium",
    description: "空气湿度过低，建议及时增加喷雾",
    status: "processing",
  },
  {
    id: "3",
    timestamp: getRandomTime(),
    greenhouseId: "3号大棚",
    cropType: "黄瓜",
    alertType: "soil",
    value: "pH 8.5",
    threshold: "pH 6.5-7.0",
    severity: "medium",
    description: "土壤碱性过高，建议调整土壤酸碱度",
    status: "resolved",
  },
  {
    id: "4",
    timestamp: getRandomTime(),
    greenhouseId: "4号大棚",
    cropType: "茄子",
    alertType: "humidity",
    value: "90%",
    threshold: "60-80%",
    severity: "high",
    description: "湿度过高，易引发作物病害，建议增加通风",
    status: "pending",
  },
  {
    id: "5",
    timestamp: getRandomTime(),
    greenhouseId: "5号大棚",
    cropType: "草莓",
    alertType: "light",
    value: "2000 lux",
    threshold: "10000 lux",
    severity: "low",
    description: "光照强度不足，可能影响果实品质",
    status: "processing",
  },
  {
    id: "6",
    timestamp: getRandomTime(),
    greenhouseId: "6号大棚",
    cropType: "青椒",
    alertType: "temperature",
    value: "10°C",
    threshold: "15-25°C",
    severity: "high",
    description: "温度过低，可能导致冻害，需调整加温设备",
    status: "pending",
  },
  {
    id: "7",
    timestamp: getRandomTime(),
    greenhouseId: "7号大棚",
    cropType: "生菜",
    alertType: "soil",
    value: "N含量低",
    threshold: "标准值",
    severity: "medium",
    description: "土壤氮元素不足，建议追加氮肥",
    status: "processing",
  },
  {
    id: "8",
    timestamp: getRandomTime(),
    greenhouseId: "8号大棚",
    cropType: "香菜",
    alertType: "pest",
    value: "发现蚜虫",
    threshold: "无害虫",
    severity: "high",
    description: "检测到蚜虫侵害，建议立即采取防治措施",
    status: "pending",
  },
];

// 获取警情级别对应的颜色
const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case "high":
      return "red";
    case "medium":
      return "orange";
    case "low":
      return "blue";
    default:
      return "default";
  }
};

// 获取警情级别对应的文本
const getSeverityText = (severity: string): string => {
  switch (severity) {
    case "high":
      return "高";
    case "medium":
      return "中";
    case "low":
      return "低";
    default:
      return "未知";
  }
};

// 获取警情状态对应的文本和颜色
const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return { status: "warning", text: "待处理" };
    case "processing":
      return { status: "processing", text: "处理中" };
    case "resolved":
      return { status: "success", text: "已解决" };
    default:
      return { status: "default", text: "未知" };
  }
};

// 获取警报类型对应的图标和文本
const getAlertTypeInfo = (type: string) => {
  switch (type) {
    case "temperature":
      return { icon: <ChromeOutlined />, text: "温度异常" };
    case "humidity":
      return { icon: <ExperimentOutlined />, text: "湿度异常" };
    case "soil":
      return { icon: <DeploymentUnitOutlined />, text: "土壤异常" };
    case "light":
      return { icon: <ThunderboltOutlined />, text: "光照异常" };
    case "pest":
      return { icon: <AlertOutlined />, text: "病虫害警报" };
    default:
      return { icon: <AlertOutlined />, text: "未知警报" };
  }
};

const Recorder: React.FC = () => {
  const [alertRecords, setAlertRecords] =
    useState<AlertRecord[]>(mockAlertRecords);
  const [scrollIndex, setScrollIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  // 自动滚动效果
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollIndex((prevIndex) => (prevIndex + 1) % alertRecords.length);
    }, 3000); // 每3秒滚动一次

    return () => clearInterval(interval);
  }, [alertRecords.length]);

  // 滚动到指定位置
  useEffect(() => {
    if (listRef.current) {
      const itemHeight = 85; // 每个列表项的高度（根据实际情况调整）
      listRef.current.scrollTop = scrollIndex * itemHeight;
    }
  }, [scrollIndex]);

  // 模拟实时接收新警情
  useEffect(() => {
    const newAlertInterval = setInterval(() => {
      // 随机生成一条新警情
      const greenhouses = [
        "1号大棚",
        "2号大棚",
        "3号大棚",
        "4号大棚",
        "5号大棚",
        "6号大棚",
        "7号大棚",
        "8号大棚",
      ];
      const cropTypes = [
        "小白菜",
        "西红柿",
        "黄瓜",
        "茄子",
        "草莓",
        "青椒",
        "生菜",
        "香菜",
        "韭菜",
        "辣椒",
      ];
      const alertTypes: (
        | "temperature"
        | "humidity"
        | "soil"
        | "light"
        | "pest"
      )[] = ["temperature", "humidity", "soil", "light", "pest"];
      const severities: ("high" | "medium" | "low")[] = [
        "high",
        "medium",
        "low",
      ];
      const statuses: ("pending" | "processing" | "resolved")[] = [
        "pending",
        "processing",
        "resolved",
      ];

      // 生成随机值和阈值
      let value = "";
      let threshold = "";
      let description = "";
      const selectedType =
        alertTypes[Math.floor(Math.random() * alertTypes.length)];
      const selectedGreenhouse =
        greenhouses[Math.floor(Math.random() * greenhouses.length)];
      const selectedCrop =
        cropTypes[Math.floor(Math.random() * cropTypes.length)];

      switch (selectedType) {
        case "temperature":
          const temp = Math.floor(Math.random() * 20) + 5; // 5-25°C
          value = `${temp}°C`;
          threshold = "15-25°C";
          description =
            temp < 15
              ? `${selectedGreenhouse}温度过低 (${value})，可能影响${selectedCrop}生长`
              : temp > 25
              ? `${selectedGreenhouse}温度过高 (${value})，建议通风降温`
              : `${selectedGreenhouse}温度波动 (${value})，请关注变化趋势`;
          break;
        case "humidity":
          const humidity = Math.floor(Math.random() * 100);
          value = `${humidity}%`;
          threshold = "40-70%";
          description =
            humidity < 40
              ? `${selectedGreenhouse}湿度过低 (${value})，建议喷雾增湿`
              : humidity > 70
              ? `${selectedGreenhouse}湿度过高 (${value})，建议通风除湿`
              : `${selectedGreenhouse}湿度波动 (${value})，请关注变化趋势`;
          break;
        case "soil":
          const soilIssues = [
            "氮含量低",
            "磷含量低",
            "钾含量低",
            "pH值过高",
            "pH值过低",
            "盐分过高",
          ];
          const selectedIssue =
            soilIssues[Math.floor(Math.random() * soilIssues.length)];
          value = selectedIssue;
          threshold = "标准范围";
          description = `${selectedGreenhouse}${selectedCrop}土壤${selectedIssue}，建议调整肥料施用`;
          break;
        case "light":
          const light = Math.floor(Math.random() * 20000);
          value = `${light} lux`;
          threshold = "10000-20000 lux";
          description =
            light < 10000
              ? `${selectedGreenhouse}光照不足 (${value})，建议补充人工光源`
              : `${selectedGreenhouse}光照强度异常 (${value})，请检查`;
          break;
        case "pest":
          const pests = ["蚜虫", "白粉病", "灰霉病", "螨虫", "菜青虫"];
          const selectedPest = pests[Math.floor(Math.random() * pests.length)];
          value = `发现${selectedPest}`;
          threshold = "无病虫害";
          description = `${selectedGreenhouse}${selectedCrop}发现${selectedPest}，建议立即防治`;
          break;
      }

      const newAlert: AlertRecord = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
        greenhouseId: selectedGreenhouse,
        cropType: selectedCrop,
        alertType: selectedType,
        value: value,
        threshold: threshold,
        severity: severities[Math.floor(Math.random() * severities.length)],
        description: description,
        status: statuses[Math.floor(Math.random() * statuses.length)],
      };

      setAlertRecords((prev) => {
        // 保持最多10条记录
        const newRecords = [newAlert, ...prev];
        return newRecords.slice(0, 10);
      });
    }, 15000); // 每15秒生成一条新警情

    return () => clearInterval(newAlertInterval);
  }, []);

  return (
    <Card
      title={
        <Title level={4}>
          <AlertOutlined style={{ marginRight: 8 }} />
          农作物环境监测警报
        </Title>
      }
      className="recorder-card"
    >
      <div className="recorder-list-container" ref={listRef}>
        <List
          itemLayout="horizontal"
          dataSource={alertRecords}
          renderItem={(item) => {
            const statusInfo = getStatusBadge(item.status);
            const alertTypeInfo = getAlertTypeInfo(item.alertType);
            return (
              <List.Item className="recorder-list-item">
                <div className="recorder-item-content">
                  <div className="recorder-item-header">
                    <Tag
                      color={getSeverityColor(item.severity)}
                      className="severity-tag"
                    >
                      {getSeverityText(item.severity)}级
                    </Tag>
                    <span className="alert-type">
                      {alertTypeInfo.icon} {alertTypeInfo.text}
                    </span>
                    <Badge
                      status={statusInfo.status as any}
                      text={statusInfo.text}
                      className="status-badge"
                    />
                  </div>

                  <div className="recorder-item-details">
                    <Text type="secondary">
                      <HomeOutlined /> {item.greenhouseId} | {item.cropType}
                    </Text>
                    <Text>{item.description}</Text>
                    <div className="parameter-info">
                      <Tag color="cyan">当前值: {item.value}</Tag>
                      <Tag color="green">阈值: {item.threshold}</Tag>
                    </div>
                  </div>

                  <div className="recorder-item-time">
                    <FieldTimeOutlined style={{ marginRight: 4 }} />
                    <Text type="secondary">{item.timestamp}</Text>
                  </div>
                </div>
              </List.Item>
            );
          }}
        />
      </div>
    </Card>
  );
};

export default Recorder;

import React, { useState } from "react";
import {
  Card,
  Typography,
  Select,
  Spin,
  Tooltip,
  Button,
  Space,
  Popover,
  Badge,
  Table,
} from "antd";
import {
  EnvironmentOutlined,
  AimOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import "./Map.css";

const { Title, Text } = Typography;
const { Option } = Select;

// 传感器类型
type SensorType = "temperature" | "humidity" | "soil" | "light" | "pest";

// 传感器状态
type SensorStatus = "normal" | "warning" | "error" | "offline";

// 传感器信息
interface Sensor {
  id: string;
  type: SensorType;
  status: SensorStatus;
  value: string;
  lastUpdate: string;
}

// 大棚信息
interface Greenhouse {
  id: string;
  name: string;
  location: [number, number]; // [x, y]坐标（百分比）
  cropType: string;
  area: number; // 面积，单位：平方米
  sensors: Sensor[];
}

// 模拟数据：大棚信息
const mockGreenhouses: Greenhouse[] = [
  {
    id: "1",
    name: "1号大棚",
    location: [20, 30], // 位置以百分比表示
    cropType: "小白菜",
    area: 500,
    sensors: [
      {
        id: "1-1",
        type: "temperature",
        status: "normal",
        value: "26°C",
        lastUpdate: "2025-03-28 08:30:00",
      },
      {
        id: "1-2",
        type: "humidity",
        status: "warning",
        value: "85%",
        lastUpdate: "2025-03-28 08:30:00",
      },
      {
        id: "1-3",
        type: "soil",
        status: "normal",
        value: "pH 6.5",
        lastUpdate: "2025-03-28 08:15:00",
      },
      {
        id: "1-4",
        type: "light",
        status: "normal",
        value: "12000 lux",
        lastUpdate: "2025-03-28 08:30:00",
      },
    ],
  },
  {
    id: "2",
    name: "2号大棚",
    location: [65, 25], // 位置以百分比表示
    cropType: "西红柿",
    area: 650,
    sensors: [
      {
        id: "2-1",
        type: "temperature",
        status: "normal",
        value: "24°C",
        lastUpdate: "2025-03-28 08:30:00",
      },
      {
        id: "2-2",
        type: "humidity",
        status: "normal",
        value: "60%",
        lastUpdate: "2025-03-28 08:30:00",
      },
      {
        id: "2-3",
        type: "soil",
        status: "error",
        value: "pH 8.2",
        lastUpdate: "2025-03-28 08:15:00",
      },
      {
        id: "2-4",
        type: "pest",
        status: "warning",
        value: "发现蚜虫",
        lastUpdate: "2025-03-28 08:00:00",
      },
    ],
  },
  {
    id: "3",
    name: "3号大棚",
    location: [35, 70], // 位置以百分比表示
    cropType: "黄瓜",
    area: 480,
    sensors: [
      {
        id: "3-1",
        type: "temperature",
        status: "normal",
        value: "25°C",
        lastUpdate: "2025-03-28 08:30:00",
      },
      {
        id: "3-2",
        type: "humidity",
        status: "normal",
        value: "65%",
        lastUpdate: "2025-03-28 08:30:00",
      },
      {
        id: "3-3",
        type: "soil",
        status: "normal",
        value: "pH 6.8",
        lastUpdate: "2025-03-28 08:15:00",
      },
      {
        id: "3-4",
        type: "light",
        status: "offline",
        value: "未知",
        lastUpdate: "2025-03-27 18:30:00",
      },
    ],
  },
  {
    id: "4",
    name: "4号大棚",
    location: [75, 65], // 位置以百分比表示
    cropType: "生菜",
    area: 420,
    sensors: [
      {
        id: "4-1",
        type: "temperature",
        status: "error",
        value: "35°C",
        lastUpdate: "2025-03-28 08:30:00",
      },
      {
        id: "4-2",
        type: "humidity",
        status: "warning",
        value: "30%",
        lastUpdate: "2025-03-28 08:30:00",
      },
      {
        id: "4-3",
        type: "soil",
        status: "normal",
        value: "pH 6.2",
        lastUpdate: "2025-03-28 08:15:00",
      },
      {
        id: "4-4",
        type: "light",
        status: "normal",
        value: "15000 lux",
        lastUpdate: "2025-03-28 08:30:00",
      },
    ],
  },
];

// 获取传感器类型对应的文本
const getSensorTypeText = (type: SensorType): string => {
  switch (type) {
    case "temperature":
      return "温度";
    case "humidity":
      return "湿度";
    case "soil":
      return "土壤";
    case "light":
      return "光照";
    case "pest":
      return "病虫害";
    default:
      return "未知";
  }
};

// 获取传感器状态对应的Badge状态
const getSensorStatusBadge = (status: SensorStatus) => {
  switch (status) {
    case "normal":
      return { status: "success", text: "正常", icon: <CheckCircleOutlined /> };
    case "warning":
      return { status: "warning", text: "警告", icon: <WarningOutlined /> };
    case "error":
      return { status: "error", text: "异常", icon: <WarningOutlined /> };
    case "offline":
      return { status: "default", text: "离线", icon: <SyncOutlined spin /> };
    default:
      return { status: "default", text: "未知", icon: null };
  }
};

const GreenhouseMap: React.FC = () => {
  const [selectedGreenhouse, setSelectedGreenhouse] = useState<string>("all");
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(false);

  // 获取大棚状态
  const getGreenhouseStatus = (greenhouse: Greenhouse) => {
    const hasError = greenhouse.sensors.some((s) => s.status === "error");
    const hasWarning = greenhouse.sensors.some((s) => s.status === "warning");
    const hasOffline = greenhouse.sensors.some((s) => s.status === "offline");

    if (hasError) return "error";
    if (hasWarning) return "warning";
    if (hasOffline) return "offline";
    return "normal";
  };

  // 处理大棚选择变化
  const handleGreenhouseChange = (value: string) => {
    setLoading(true);
    setSelectedGreenhouse(value);
    // 模拟加载效果
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  // 放大地图
  const zoomIn = () => {
    if (zoom < 1.5) {
      setZoom(zoom + 0.1);
    }
  };

  // 缩小地图
  const zoomOut = () => {
    if (zoom > 0.7) {
      setZoom(zoom - 0.1);
    }
  };

  // 定位到当前位置
  const locateCurrentPosition = () => {
    setLoading(true);
    // 模拟定位过程
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // 渲染大棚信息卡片
  const renderGreenhouseInfo = (greenhouse: Greenhouse) => {
    const columns = [
      {
        title: "类型",
        dataIndex: "type",
        key: "type",
        render: (type: SensorType) => getSensorTypeText(type),
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        render: (status: SensorStatus) => (
          <Badge
            status={getSensorStatusBadge(status).status as any}
            text={getSensorStatusBadge(status).text}
          />
        ),
      },
      {
        title: "数值",
        dataIndex: "value",
        key: "value",
      },
      {
        title: "更新时间",
        dataIndex: "lastUpdate",
        key: "lastUpdate",
        render: (time: string) => time.split(" ")[1],
      },
    ];

    return (
      <div className="greenhouse-info">
        <div className="info-header">
          <h3>{greenhouse.name}</h3>
          <p>
            作物：{greenhouse.cropType} | 面积：{greenhouse.area}㎡
          </p>
        </div>
        <div className="info-content">
          <h4>传感器状态：</h4>
          <Table
            dataSource={greenhouse.sensors}
            columns={columns}
            size="small"
            pagination={false}
            rowKey="id"
          />
        </div>
      </div>
    );
  };

  // 筛选显示的大棚
  const displayedGreenhouses =
    selectedGreenhouse === "all"
      ? mockGreenhouses
      : mockGreenhouses.filter((gh) => gh.id === selectedGreenhouse);

  return (
    <Card
      title={
        <div className="map-header">
          <Title level={4}>
            <EnvironmentOutlined style={{ marginRight: 8 }} />
            大棚传感器监控地图
          </Title>
        </div>
      }
      extra={
        <Space>
          <Select
            defaultValue="all"
            style={{ width: 150 }}
            onChange={handleGreenhouseChange}
            value={selectedGreenhouse}
          >
            <Option value="all">全部大棚</Option>
            {mockGreenhouses.map((gh) => (
              <Option key={gh.id} value={gh.id}>
                {gh.name}
              </Option>
            ))}
          </Select>
          <Tooltip title="定位到我的位置">
            <Button
              icon={<AimOutlined />}
              onClick={locateCurrentPosition}
              type="primary"
            />
          </Tooltip>
        </Space>
      }
      className="map-card"
    >
      <div className="map-controls">
        <Button icon={<ZoomInOutlined />} onClick={zoomIn} />
        <Button icon={<ZoomOutOutlined />} onClick={zoomOut} />
      </div>

      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-dot legend-normal"></span>
          <span>正常</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot legend-warning"></span>
          <span>警告</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot legend-error"></span>
          <span>异常</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot legend-offline"></span>
          <span>离线</span>
        </div>
      </div>

      <div className="map-container" style={{ height: 500 }}>
        {loading && (
          <div className="map-loading">
            <Spin size="large" tip="加载中..." />
          </div>
        )}

        {/* 自定义模拟地图 */}
        <div
          className="custom-map"
          style={{
            transform: `scale(${zoom})`,
            backgroundSize: `${zoom * 100}% ${zoom * 100}%`,
          }}
        >
          {/* 添加农场边界和道路 */}
          <div className="farm-road horizontal-road"></div>
          <div className="farm-road vertical-road"></div>

          {/* 绘制水池 */}
          <div className="farm-pond"></div>

          {/* 放置各个大棚标记 */}
          {displayedGreenhouses.map((greenhouse) => {
            const status = getGreenhouseStatus(greenhouse);
            return (
              <Popover
                key={greenhouse.id}
                content={renderGreenhouseInfo(greenhouse)}
                title={null}
                trigger="click"
                placement="top"
                overlayClassName="greenhouse-popover"
              >
                <div
                  className={`greenhouse-marker status-${status}`}
                  style={{
                    left: `${greenhouse.location[0]}%`,
                    top: `${greenhouse.location[1]}%`,
                  }}
                >
                  <div className="marker-content">{greenhouse.name}</div>
                </div>
              </Popover>
            );
          })}
        </div>
      </div>

      <div className="sensor-summary">
        <Text type="secondary">
          共 {mockGreenhouses.length} 个大棚，
          {mockGreenhouses.reduce(
            (total, gh) => total + gh.sensors.length,
            0
          )}{" "}
          个传感器，
          {mockGreenhouses.reduce(
            (total, gh) =>
              total +
              gh.sensors.filter(
                (s) => s.status === "error" || s.status === "warning"
              ).length,
            0
          )}{" "}
          个传感器异常
        </Text>
      </div>
    </Card>
  );
};

export default GreenhouseMap;

import React from "react";
import ReactDOM from "react-dom";
import { Pie } from "@ant-design/plots";

export default () => {
  const config = {
    data: [
      { type: "温度异常", value: 27 },
      { type: "湿度异常", value: 25 },
      { type: "土壤问题", value: 18 },
      { type: "光照不足", value: 15 },
      { type: "病虫害", value: 10 },
      { type: "其他问题", value: 5 },
    ],
    angleField: "value",
    colorField: "type",
    paddingRight: 80,
    innerRadius: 0.6,
    label: {
      text: "value",
      style: {
        fontWeight: "bold",
      },
    },
    legend: {
      color: {
        title: false,
        position: "right",
        rowPadding: 5,
      },
    },
    annotations: [
      {
        type: "text",
        style: {
          text: "AntV\nCharts",
          x: "50%",
          y: "50%",
          textAlign: "center",
          fontSize: 40,
          fontStyle: "bold",
        },
      },
    ],
  };
  return <Pie {...config} />;
};

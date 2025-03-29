import { createBrowserRouter } from "react-router-dom";
import BasicLayout from "@/layout/BasicLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <BasicLayout />, // 正确使用组件
  },
]);

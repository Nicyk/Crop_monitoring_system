import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import zhCN from "antd/locale/zh_CN";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import { store } from "./store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider locale={zhCN}>
      <Provider store={store}>
        <App />
      </Provider>
    </ConfigProvider>
  </StrictMode>
);

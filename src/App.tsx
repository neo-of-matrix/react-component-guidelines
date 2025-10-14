import { ConfigProvider, App } from "antd";
import "./App.css";
import Input from "./views/Input";
import BigFileUpload from "./views/BigFileUpload";
import { Space } from "antd";

function Main() {
  return (
    <ConfigProvider theme={{ cssVar: true, hashed: false }}>
      <App>
        <Space align="start">
          <Input />
          <BigFileUpload />
        </Space>
      </App>
    </ConfigProvider>
  );
}

export default Main;

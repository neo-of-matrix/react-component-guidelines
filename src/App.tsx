import { ConfigProvider } from "antd";
import "./App.css";
import Input from "./views/Input";

function App() {
  return (
    <ConfigProvider theme={{ cssVar: true, hashed: false }}>
      <Input />
    </ConfigProvider>
  );
}

export default App;

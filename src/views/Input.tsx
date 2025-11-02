import { CustomInput } from "@components/base/index";
import { useRef, useCallback, useState } from "react";
import { Space, Button, Card } from "antd";
import type { InputRef } from "antd";
import type { RefProps } from "@components/base/index";
// import type { ComponentProps, ComponentRef } from "react";

// type CustomInputProps = ComponentProps<typeof CustomInput>;
// type CustomInputRef = ComponentRef<typeof CustomInput>;

function Input() {
  const nativeRef = useRef<RefProps>(null);
  const nativeHandleClick = () => {
    nativeRef.current?.focus();
  };
  const render = useCallback((value?: string) => {
    return <div>{value}</div>;
  }, []);
  const [value, setValue] = useState<string>("");
  const handleChange = (value: string) => {
    setValue(value);
  };
  // antd Input
  const ref = useRef<InputRef>(null);
  const handleClick = () => {
    ref.current?.focus();
  };
  const [antdValue, setAntdValue] = useState<string>("");
  const antdHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAntdValue(e.target.value);
  };
  return (
    <Space direction="vertical" size="middle">
      <Card title="原生 Input：" size="small">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Space.Compact>
            <CustomInput.NativeInput
              ref={nativeRef}
              render={render}
              value={value}
              onChange={handleChange}
            />
            <Button type="primary" onClick={nativeHandleClick}>
              聚焦
            </Button>
          </Space.Compact>
          <div>输入内容：{value}</div>
        </Space>
      </Card>
      <Card title="Antd Input：" size="small">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Space.Compact>
            <CustomInput
              ref={ref}
              value={antdValue}
              onChange={antdHandleChange}
            />
            <Button type="primary" onClick={handleClick}>
              聚焦
            </Button>
          </Space.Compact>
          <div>输入内容：{antdValue}</div>
        </Space>
      </Card>
    </Space>
  );
}

export default Input;

import { CustomInput } from "../components/base/index";
import type { RefProps } from "../components/base/index";
import { useRef } from "react";
import { Space, Button } from "antd";
// import type { ComponentProps, ComponentRef } from "react";

// type CustomInputProps = ComponentProps<typeof CustomInput>;
// type CustomInputRef = ComponentRef<typeof CustomInput>;

function Input() {
  const ref = useRef<RefProps>(null);
  function handleClick() {
    ref.current?.focus();
  }
  return (
    <Space.Compact style={{ width: "100%" }}>
      <CustomInput ref={ref} />
      <Button type="primary" onClick={handleClick}>
        聚焦
      </Button>
    </Space.Compact>
  );
}

export default Input;

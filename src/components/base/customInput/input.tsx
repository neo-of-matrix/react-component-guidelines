import classNames from "classnames";
import { useState } from "react";
import { Input, Button, Space } from "antd";
import type { Ref } from "react";
import type { InputProps, InputRef } from "antd";

import "./style/index.less";
const prefixCls = "custom-input"; // 统一的组件内部前缀

export interface CustomInputProps extends InputProps {
  /** 输入框暴露自定义的 ref 方法 */
  ref?: Ref<InputRef>;
  nativeRef?: Ref<HTMLInputElement>;
  /**
   * @description 验证状态
   * @deprecated 1.0.0 废弃
   * @default ''
   */
  validationStatus?: "success" | "fail";
  /** 总数 0-999 */
  countNum?: number;
  changeButtonStatus?: (status: boolean) => void;
}
const CustomInput = ({
  className,
  ref,
  // validationStatus = "success",
  // countNum = 0,
  changeButtonStatus,
  ...rest
}: CustomInputProps) => {
  const displayClassName = classNames(`${prefixCls}-color`, className);
  const [open, setOpen] = useState(false);
  const onCheckOpen = () => {
    setOpen(!open);
    changeButtonStatus?.(!open);
  };
  return (
    <Space.Compact style={{ width: "100%" }}>
      <Input ref={ref} className={displayClassName} {...rest} />
      <Button type="primary" onClick={onCheckOpen}>
        {open ? "打开" : "关闭"}
      </Button>
    </Space.Compact>
  );
};

export default CustomInput;

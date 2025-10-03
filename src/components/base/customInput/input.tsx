import classNames from "classnames";
import { useImperativeHandle, useRef } from "react";
import { Input } from "antd";
import type { Ref } from "react";
import type { InputRef, InputProps } from "antd";

import "./style/index.less";
const prefixCls = "custom-input"; // 统一的组件内部前缀
interface CommonProps {
  /** 自定义类名 */
  className?: string;
  /**
   * @description 自定义内敛样式
   * @version 1.0.0
   * @default ''
   */
  style?: React.CSSProperties;
}
export interface RefProps {
  focus: () => void;
}
export interface CustomInputProps extends InputProps {
  /** 输入框暴露自定义的 ref 方法 */
  ref?: Ref<RefProps>;
  /**
   * @description 自定义标题样式
   * @deprecated 1.0.0 废弃
   * @default ''
   */
  validationStatus?: "success" | "fail";
  /** 总数 0-999 */
  countNum?: number;
}
const CustomInput = ({
  className,
  ref,
  // validationStatus = "success",
  // countNum = 0,
  ...rest
}: CustomInputProps) => {
  /* Input ref 引用 */
  const inputRef = useRef<InputRef>(null);
  useImperativeHandle(
    ref,
    () => {
      return {
        focus() {
          inputRef.current?.focus();
        },
      };
    },
    []
  );

  const displayClassName = classNames(`${prefixCls}-color`, className);
  return (
    <>
      <Input ref={inputRef} className={displayClassName} {...rest} />
    </>
  );
};

export default CustomInput;

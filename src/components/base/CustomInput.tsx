import classNames from "classnames";
import { useImperativeHandle, useRef } from "react";
import { Input } from "antd";
import type { Ref } from "react";
import type { InputRef } from "antd";
export interface CommonProps {
  /** 自定义类名 */
  className?: string;
  /**
   * @description 自定义内敛样式
   * @version 2.6.0
   * @default ''
   */
  style?: React.CSSProperties;
  /**
   * @description 自定义标题样式
   * @deprecated 2.1.0 废弃
   * @default ''
   */
  customTitleStyle?: React.CSSProperties;
}
export interface RefProps {
  focus: () => void;
}
export interface CustomInputProps extends CommonProps {
  ref?: Ref<RefProps>;
}
const CustomInput = ({ className, ref, ...rest }: CustomInputProps) => {
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

  const displayClassName = classNames("chc-input", className);
  return <Input ref={inputRef} {...rest} className={displayClassName} />;
};
export default CustomInput;

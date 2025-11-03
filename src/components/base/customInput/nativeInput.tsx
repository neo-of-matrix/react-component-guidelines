import { useImperativeHandle, useRef, useMemo, type Ref } from 'react';
import { usePropsValue } from './hooks';
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
export interface NativeInputProps<T> extends CommonProps {
  /** 输入框暴露自定义的 ref 方法 */
  ref?: Ref<RefProps>;
  render?: (data?: string) => React.ReactNode;
  data?: string;
  value?: T;
  onChange?: (value: T) => void;
  defaultValue?: T;
}

const NativeInput = ({
  ref,
  data,
  render,
  value,
  defaultValue = '',
  onChange,
  ...rest
}: NativeInputProps<string>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const detailText = useMemo(() => {
    // render 用户自定义渲染
    return render ? render(data) : <span>{data}</span>;
  }, [data, render]);

  const [finalValue, setFinalValue] = usePropsValue({
    value,
    defaultValue,
    onChange,
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFinalValue(e.target.value);
  };
  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current?.focus();
      },
    };
  }, []);

  return (
    <>
      <input ref={inputRef} value={finalValue} onChange={handleChange} {...rest} />
      {detailText}
    </>
  );
};

export default NativeInput;

import { useRef, type SetStateAction } from 'react';
import useUpdate from './useUpdate';
export interface Options<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}
const usePropsValue = <T>(options: Options<T>) => {
  const { value, defaultValue, onChange } = options;
  const isControlled = value !== undefined;
  const update = useUpdate();
  const stateRef = useRef<T>(isControlled ? value : defaultValue);
  if (isControlled) {
    stateRef.current = value;
  }
  const setState = (v: SetStateAction<T>) => {
    const nextValue = typeof v === 'function' ? (v as (prevState: T) => T)(stateRef.current) : v;
    if (nextValue === stateRef.current) {
      return;
    }
    stateRef.current = nextValue;
    update();
    onChange?.(nextValue);
  };
  return [stateRef.current, setState] as const;
};

export default usePropsValue;

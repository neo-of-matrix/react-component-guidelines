import InternalInput from "./input";
import NativeInput from "./nativeInput";
export type { CustomInputProps } from "./input";
export type { NativeInputProps, RefProps } from "./nativeInput";

type CompoundedComponent = typeof InternalInput & {
  NativeInput: typeof NativeInput;
};
const Input = InternalInput as CompoundedComponent;

Input.NativeInput = NativeInput;
export default Input;
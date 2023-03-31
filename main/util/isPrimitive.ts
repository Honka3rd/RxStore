import { isObject } from "./isObject";

export const isPrimitive = (val: unknown): val is null | boolean | string | number | undefined => {
  return !isObject(val);
};

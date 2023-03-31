import { isObject } from "./isObject";

export const isPremitive = (val: unknown): val is null | boolean | string | number | undefined => {
  return !isObject(val);
};

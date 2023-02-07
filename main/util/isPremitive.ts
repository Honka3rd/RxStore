import { isObject } from "./isObject";

export const isPremitive = (val: unknown) => {
  return !isObject(val);
};

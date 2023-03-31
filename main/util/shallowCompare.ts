import { isObject } from "./isObject";
import { objectShallowCompareF } from "./objectShallowCompareFactory";

const objectShallowCompare = objectShallowCompareF();

export const shallowCompare = (o1: any, o2: any) => {
  if (
    isObject(o1) &&
    isObject(o2)
  ) {
    return objectShallowCompare(o1, o2);
  }

  return o1 === o2;
};
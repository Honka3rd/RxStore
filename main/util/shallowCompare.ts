import { objectShallowCompareF } from "./objectShallowCompareFactory";

const objectShallowCompare = objectShallowCompareF();

export const shallowCompare = (o1: any, o2: any) => {
  if (
    typeof o1 === "object" &&
    typeof o2 === "object" &&
    o1 !== null &&
    o2 !== null
  ) {
    return objectShallowCompare(o1, o2);
  }

  return o1 === o2;
};
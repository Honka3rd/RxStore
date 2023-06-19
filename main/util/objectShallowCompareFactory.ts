import { ComparatorMap } from "rx-store-types";

export const objectShallowCompareF =
  <T extends { [k: string]: any }>(
    comparator: <K extends keyof T>(val1: T[K], val2: T[K]) => boolean = (
      o1,
      o2
    ) => o1 === o2,
    comparatorMap?: ComparatorMap<any>
  ) =>
  (o1: T, o2: T) => {
    const ownKeysO1 = Object.getOwnPropertyNames(o1);
    const ownKeysO2 = Object.getOwnPropertyNames(o2);
    if (ownKeysO1.length !== ownKeysO2.length) {
      return false;
    }

    if (comparatorMap) {
      for (let key of ownKeysO1) {
        const compareFn = comparatorMap?.[key]
          ? comparatorMap[key]!
          : comparator;
        if (!compareFn(o1[key], o2[key])) {
          return false;
        }
      }
    } else {
      for (let key of ownKeysO1) {
        if (!comparator(o1[key], o2[key])) {
          return false;
        }
      }
    }

    return true;
  };

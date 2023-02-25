import { ComparatorMap } from "../interfaces";
export declare const objectShallowCompareF: <T extends {
    [k: string]: any;
}>(comparator?: <K extends keyof T>(val1: T[K], val2: T[K]) => boolean, comparatorMap?: ComparatorMap<any>) => (o1: T, o2: T) => boolean;

import {
  BS,
  Comparator,
  ComparatorMap,
  Connectivity,
  RxStore,
  Subscribable,
} from "./interfaces";

const objectShallowCompareF =
  <T extends { [k: string]: any }>(
    comparator: <K extends keyof T>(val1: T[K], val2: T[K]) => boolean = (
      o1,
      o2
    ) => o1 === o2,
    comparatorMap?: ComparatorMap<any>
  ) =>
  (o1: T, o2: T) => {
    if (Object.getPrototypeOf(o1) !== Object.getPrototypeOf(o2)) {
      return false;
    }
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

const objectShallowCompare = objectShallowCompareF();

const shallowCompare = (o1: any, o2: any) => {
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

export class RxStoreImpl<S extends BS> implements Subscribable<S>, RxStore<S> {
  private comparator: Comparator<any> = shallowCompare;
  constructor(
    private connector: Connectivity<S>,
    comparator?: Comparator<any>,
    private comparatorMap?: ComparatorMap<any>
  ) {
    if (comparator) {
      this.comparator = comparator;
    }
    this.dispatch = this.dispatch.bind(this);
    this.getState = this.getState.bind(this);
    this.getStateAll = this.getStateAll.bind(this);
    this.getStates = this.getStates.bind(this);
    this.reset = this.reset.bind(this);
    this.resetAll = this.resetAll.bind(this);
    this.subscribeAll = this.subscribeAll.bind(this);
    this.subscribeMultiple = this.subscribeMultiple.bind(this);
    this.subscribeTo = this.subscribeTo.bind(this);
    this.getDataSource = this.getDataSource.bind(this);
  }

  subscribeTo<K extends keyof S>(
    key: K,
    observer: (result: ReturnType<S[K]>) => void,
    comparator?: (prev: ReturnType<S[K]>, next: ReturnType<S[K]>) => boolean
  ) {
    const presetComparetor = this.comparatorMap?.[key]
      ? this.comparatorMap[key]
      : this.comparator;
    const compareFn = comparator ? comparator : presetComparetor;
    return this.connector.subscribeTo(key, observer, compareFn);
  }

  subscribeMultiple<KS extends keyof S>(
    keys: KS[],
    observer: (result: { [K in KS]: ReturnType<S[K]> }) => void,
    comparator?: (
      prev: { [K in KS]: ReturnType<S[K]> },
      next: { [K in KS]: ReturnType<S[K]> }
    ) => boolean
  ) {
    const compareFn = comparator
      ? objectShallowCompareF(comparator)
      : objectShallowCompareF(this.comparator);
    return this.connector.subscribeMultiple(keys, observer, compareFn);
  }

  subscribeAll(
    observer: (result: { [K in keyof S]: ReturnType<S[K]> }) => void,
    comparator?: (
      prev: { [K in keyof S]: ReturnType<S[K]> },
      next: { [K in keyof S]: ReturnType<S[K]> }
    ) => boolean
  ) {
    const compareFn = comparator
      ? objectShallowCompareF(comparator)
      : objectShallowCompareF(this.comparator);
    return this.connector.subscribeAll(observer, compareFn);
  }

  getState<K extends keyof S>(key: K) {
    return this.connector.get(key);
  }

  getStates<KS extends keyof S>(keys: KS[]) {
    return this.connector.getMultiple(keys);
  }

  getStateAll() {
    return this.connector.getAll();
  }

  private objectCompare<T extends { [k: string]: any }>(o1: T, o2: T) {
    return objectShallowCompareF(this.comparator, this.comparatorMap)(o1, o2);
  }

  dispatch<KS extends keyof S>(
    updated:
      | { [K in KS]: ReturnType<S[K]> }
      | (<KS extends keyof S>(prevAll: {
          [K in KS]: ReturnType<S[K]>;
        }) => Partial<{
          [K in keyof S]: ReturnType<S[K]>;
        }>)
  ) {
    if (typeof updated === "function") {
      const all = this.getStateAll();
      const nextVal = updated(all);
      if (all === nextVal) {
        return this;
      }
      if (
        !this.objectCompare(
          nextVal,
          this.getStates(Object.getOwnPropertyNames(nextVal)) as Partial<{
            [K in keyof S]: ReturnType<S[K]>;
          }>
        )
      ) {
        this.connector.set(nextVal as { [K in keyof S]: ReturnType<S[K]> });
      }

      return this;
    }
    if (
      !this.objectCompare(
        updated,
        this.getStates(Object.getOwnPropertyNames(updated)) as {
          [K in KS]: ReturnType<S[K]>;
        }
      )
    ) {
      this.connector.set(updated);
    }
    return this;
  }

  reset<K extends keyof S>(key: K) {
    this.connector.reset(key);
    return this;
  }

  resetAll<KS extends keyof S>(keys?: KS[]) {
    if (!keys) {
      this.connector.set(this.connector.getDefaultAll());
      return this;
    }
    this.connector.set(this.connector.getDefaults(keys));
    return this;
  }

  getDataSource() {
    return this.connector.source();
  }
}

import {
  BS,
  Comparator,
  ComparatorMap,
  Connectivity,
  RxStore,
  Subscribable,
} from "./interfaces";

const shallowCompare = (o1: any, o2: any) => {
  if (
    typeof o1 === "object" &&
    typeof o2 === "object" &&
    o1 !== null &&
    o2 !== null
  ) {
    if (Object.getPrototypeOf(o1) !== Object.getPrototypeOf(o2)) {
      return false;
    }
    Object.getOwnPropertyNames(o1).forEach((key) => {
      if (o1[key] !== o2[key]) {
        return false;
      }
    });
    return true;
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
    const compareFn = comparator ? comparator : this.comparator;
    return this.connector.subscribeMultiple(keys, observer, compareFn);
  }

  subscribeAll(
    observer: (result: { [K in keyof S]: ReturnType<S[K]> }) => void,
    comparator?: (
      prev: { [K in keyof S]: ReturnType<S[K]> },
      next: { [K in keyof S]: ReturnType<S[K]> }
    ) => boolean
  ) {
    const compareFn = comparator ? comparator : this.comparator;
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

  dispatch<KS extends keyof S>(
    updated:
      | { [K in KS]: ReturnType<S[K]> }
      | ((prevAll: { [K in keyof S]: ReturnType<S[K]> }) => {
          [K in KS]: ReturnType<S[K]>;
        })
  ) {
    const { comparator } = this;
    if (typeof updated === "function") {
      const nextVal = updated(this.getStateAll());
      if (
        !comparator(
          nextVal,
          this.getStates(Object.getOwnPropertyNames(nextVal))
        )
      ) {
        this.connector.set(nextVal);
      }

      return this;
    }
    if (
      !comparator(updated, this.getStates(Object.getOwnPropertyNames(updated)))
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

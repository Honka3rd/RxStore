import {
  AnsycReducer,
  AsyncDispatch, BS,
  Comparator,
  ComparatorMap,
  Computation,
  ComputationAsync,
  Connectivity,
  Dispatch,
  Reducer,
  RxStore,
  Subscribable
} from "rx-store-types";
import { ComputedAsyncImpl, ComputedImpl } from "./computed";
import { AsyncDispatcherImpl, DispatcherImpl } from "./dispatcher";
import { objectShallowCompareF } from "./util/objectShallowCompareFactory";
import { shallowCompare } from "./util/shallowCompare";

export class RxStoreImpl<S extends BS> implements Subscribable<S>, RxStore<S> {
  comparator: Comparator<any> = shallowCompare;
  private objectCompare: <T extends { [k: string]: any }>(
    o1: T,
    o2: T
  ) => boolean;
  constructor(
    protected connector: Connectivity<S>,
    comparator?: Comparator<any>,
    private comparatorMap?: ComparatorMap<any>
  ) {
    if (comparator) {
      this.comparator = comparator;
    }
    this.objectCompare = objectShallowCompareF(
      this.comparator,
      this.comparatorMap
    );
    this.setState = this.setState.bind(this);
    this.getState = this.getState.bind(this);
    this.reset = this.reset.bind(this);
    this.resetAll = this.resetAll.bind(this);
    this.resetMultiple = this.resetMultiple.bind(this);
    this.observeAll = this.observeAll.bind(this);
    this.observeMultiple = this.observeMultiple.bind(this);
    this.observe = this.observe.bind(this);
    this.getDataSource = this.getDataSource.bind(this);
    this.createDispatch = this.createDispatch.bind(this);
    this.createAsyncDispatch = this.createAsyncDispatch.bind(this);
    this.withComputation = this.withComputation.bind(this);
    this.withAsyncComputation = this.withAsyncComputation.bind(this);
    this.getDefault = this.getDefault.bind(this);
  }

  observe<K extends keyof S>(
    key: K,
    observer: (result: ReturnType<S[K]>) => void,
    comparator?: (prev: ReturnType<S[K]>, next: ReturnType<S[K]>) => boolean
  ) {
    const presetComparator = this.comparatorMap?.[key]
      ? this.comparatorMap[key]
      : this.comparator;
    const compareFn = comparator ? comparator : presetComparator;
    return this.connector.observe(key, observer, compareFn);
  }

  observeMultiple<KS extends keyof S>(
    keys: KS[],
    observer: (result: { [K in KS]: ReturnType<S[K]> }) => void,
    comparator?: (
      prev: { [K in KS]: ReturnType<S[K]> },
      next: { [K in KS]: ReturnType<S[K]> }
    ) => boolean
  ) {
    const compareFn = comparator
      ? objectShallowCompareF(comparator)
      : objectShallowCompareF(this.comparator, this.comparatorMap);
    return this.connector.observeMultiple(keys, observer, compareFn);
  }

  observeAll(
    observer: (result: { [K in keyof S]: ReturnType<S[K]> }) => void,
    comparator?: (
      prev: { [K in keyof S]: ReturnType<S[K]> },
      next: { [K in keyof S]: ReturnType<S[K]> }
    ) => boolean
  ) {
    const compareFn = comparator
      ? objectShallowCompareF(comparator)
      : objectShallowCompareF(this.comparator, this.comparatorMap);
    return this.connector.observeAll(observer, compareFn);
  }

  getState<K extends keyof S>(key: K) {
    return this.connector.get(key);
  }

  getDefault<K extends keyof S>(key: K) {
    return this.connector.getDefault(key);
  }

  setState<KS extends keyof S>(
    updated:
      | { [K in KS]: ReturnType<S[K]> }
      | ((prevAll: {
          [K in keyof S]: ReturnType<S[K]>;
        }) => Partial<{
          [K in keyof S]: ReturnType<S[K]>;
        }>)
  ) {
    if (typeof updated === "function") {
      const all = this.connector.getAll();
      const nextVal = updated(all);
      if (all === nextVal) {
        return this;
      }
      if (
        !this.objectCompare(
          nextVal,
          this.connector.getMultiple(Object.keys(nextVal)) as Partial<{
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
        this.connector.getMultiple(Object.keys(updated)) as {
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

  resetMultiple<KS extends (keyof S)[]>(keys: KS) {
    this.connector.resetMultiple(keys);
    return this;
  }

  resetAll() {
    this.connector.resetAll();
    return this;
  }

  getDataSource() {
    return this.connector.source();
  }

  createDispatch<K extends keyof S, T, P = void>(params: {
    reducer: Reducer<T, P, S, K>;
    key: K;
  }): Dispatch<P, T> {
    return new DispatcherImpl<S, K, T, P>(params.reducer, this, params.key)
      .dispatch;
  }

  createAsyncDispatch<K extends keyof S, T, P = void>(params: {
    reducer: AnsycReducer<T, P, S, K>;
    key: K;
  }): AsyncDispatch<P, T, S, K> {
    return new AsyncDispatcherImpl<S, K, T, P>(params.reducer, this, params.key)
      .dispatch;
  }

  withComputation<R, KS extends keyof S>(params: {
    computation: Computation<R, S, KS>;
    keys: KS[];
  }) {
    return new ComputedImpl(
      params.computation,
      this.connector,
      params.keys,
      this.comparator
    );
  }

  withAsyncComputation<R, KS extends keyof S>(params: {
    computation: ComputationAsync<R, S, KS>;
    keys: KS[];
  }) {
    return new ComputedAsyncImpl(
      params.computation,
      this.connector,
      params.keys
    );
  }
}

import {
  AsyncReducer,
  AsyncDispatch,
  BS,
  Comparator,
  ComparatorMap,
  Computation,
  ComputationAsync,
  Connectivity,
  Dispatch,
  Reducer,
  RxStore,
  Subscribable,
  AsyncComputeConfig,
} from "rx-store-types";
import { ComputedAsyncImpl, ComputedImpl } from "./computed";
import { AsyncDispatcherImpl, DispatcherImpl } from "./dispatcher";
import { objectShallowCompareF } from "./util/objectShallowCompareFactory";
import { shallowCompare } from "./util/shallowCompare";
import { bound } from "./decorators/bound";

export class RxStoreImpl<S extends BS> implements Subscribable<S>, RxStore<S> {
  comparator: Comparator<any> = shallowCompare;
  private objectCompare: <T extends { [k: string]: any }>(
    o1: T,
    o2: T
  ) => boolean;
  constructor(
    protected connector: Connectivity<S>,
    comparator?: Comparator<ReturnType<S[keyof S]>>,
    private comparatorMap?: ComparatorMap<S>
  ) {
    if (comparator) {
      this.comparator = comparator;
    }
    this.objectCompare = objectShallowCompareF(
      this.comparator,
      this.comparatorMap
    );
  }

  @bound
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

  @bound
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

  @bound
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

  @bound
  getState<K extends keyof S>(key: K) {
    return this.connector.get(key);
  }

  @bound
  getDefault<K extends keyof S>(key: K) {
    return this.connector.getDefault(key);
  }

  @bound
  getComparatorMap() {
    return this.comparatorMap;
  }

  @bound
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

  @bound
  reset<K extends keyof S>(key: K) {
    this.connector.reset(key);
    return this;
  }

  @bound
  resetMultiple<KS extends (keyof S)[]>(keys: KS) {
    this.connector.resetMultiple(keys);
    return this;
  }

  @bound
  resetAll() {
    this.connector.resetAll();
    return this;
  }

  @bound
  getDataSource() {
    return this.connector.source();
  }

  @bound
  createDispatch<K extends keyof S, T, P = void>(params: {
    reducer: Reducer<T, P, S, K>;
    key: K;
  }): Dispatch<P, T> {
    return new DispatcherImpl<S, K, T, P>(params.reducer, this, params.key)
      .dispatch;
  }

  @bound
  createAsyncDispatch<K extends keyof S, T, P = void>(params: {
    reducer: AsyncReducer<T, P, S, K>;
    key: K;
  }): AsyncDispatch<P, T, S, K> {
    return new AsyncDispatcherImpl<S, K, T, P>(params.reducer, this, params.key)
      .dispatch;
  }

  @bound
  withComputation<R>(params: {
    computation: Computation<R, S>;
    comparator?: Comparator<{
      [K in keyof S]: ReturnType<S[K]>;
    }>;
  }) {
    return new ComputedImpl(
      params.computation,
      this.connector,
      params.comparator ? params.comparator : this.comparator
    );
  }

  @bound
  withAsyncComputation<R>(
    params: {
      computation: ComputationAsync<R, S>;
      comparator?: Comparator<{ [K in keyof S]: ReturnType<S[K]> }>;
    } & AsyncComputeConfig<S, R>
  ) {
    return new ComputedAsyncImpl(
      params.computation,
      this.connector,
      Boolean(params.lazy),
      params.comparator ? params.comparator : this.comparator,
      params.onStart,
      params.onError,
      params.onSuccess,
      params.onComplete
    );
  }
}

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
} from "rx-store-types";
import { ComputedAsyncImpl, ComputedImpl } from "./computed";
import { AsyncDispatcherImpl, DispatcherImpl } from "./dispatcher";
import { objectShallowCompareF } from "./util/objectShallowCompareFactory";
import { shallowCompare } from "./util/shallowCompare";
import { distinctUntilChanged, map } from "rxjs";
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

  @bound
  withAsyncComputation<R, KS extends keyof S>(params: {
    computation: ComputationAsync<R, S, KS>;
    keys: KS[];
    comparator?: Comparator<{ [K in KS]: ReturnType<S[K]> }>;
    onStart?: (val: { [K in keyof S]: ReturnType<S[K]> }) => void;
    onError?: (err: any) => void;
    onSuccess?: (result: R) => void;
    onComplete?: () => void
  }) {
    return new ComputedAsyncImpl(
      params.computation,
      this.connector,
      params.keys,
      params.comparator,
      params.onStart,
      params.onError,
      params.onSuccess,
      params.onComplete
    );
  }

  @bound
  children<K extends (keyof S)[]>(selectors: K) {
    const utilities = {
      setParentState: <KK extends K[number]>(
        key: KK,
        value: ReturnType<S[KK]>
      ) => {
        if (this.connector.getAllKeys().includes(key)) {
          this.setState({ [key]: value } as {});
          return true;
        }
        return false;
      },
      observeParentStates: (
        observer: (result: Record<K[number], ReturnType<S[K[number]]>>) => void
      ) => {
        return this.observeMultiple(selectors, observer);
      },
      observeParentState: <KK extends K[number]>(
        key: KK,
        observer: (result: ReturnType<S[KK]>) => void
      ) => {
        if (!this.connector.getAllKeys().includes(key)) {
          return;
        }
        return this.observe(key, observer);
      },
      getParentState: <KK extends K[number]>(key: KK) => {
        if (!this.connector.getAllKeys().includes(key)) {
          return;
        }
        return this.getState(key);
      },
      getParentDefault: <KK extends K[number]>(key: KK) => {
        if (!this.connector.getAllKeys().includes(key)) {
          return;
        }
        return this.getDefault(key);
      },
      comparator: this.comparator as Comparator<ReturnType<S[K[number]]>>,
      parentComparatorMap: this.comparatorMap
        ? selectors.reduce((acc, next) => {
            acc[next] = this.comparatorMap?.[next];
            return acc;
          }, {} as Partial<ComparatorMap<S>>)
        : ({} as Partial<ComparatorMap<S>>),
    };
    return [
      utilities,
      this.getDataSource().pipe(
        map((states) =>
          selectors.reduce((acc, next) => {
            acc[next] = states[next];
            return acc;
          }, {} as Partial<{ [K in keyof S]: ReturnType<S[K]> }>)
        ),
        distinctUntilChanged(this.objectCompare)
      ),
    ] as const;
  }
}

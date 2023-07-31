import { AsyncComputeConfig, AsyncDispatch, AsyncDispatchConfig, AsyncReducer, BS, Comparator, Computation, ComputationAsync, Connectivity, ConstraintKeys, Dispatch, Observe, Reducer, RxStore, Subscribable } from "rx-store-types";
import { ComputedAsyncImpl, ComputedImpl } from "./computed";
export declare class RxStoreImpl<S extends BS> implements Subscribable<S>, RxStore<S> {
    protected connector: Connectivity<S>;
    protected comparatorMap?: Partial<{ [K in keyof S]: Comparator<ReturnType<S[K]>>; }> | undefined;
    comparator: Comparator<any>;
    private objectCompare;
    constructor(connector: Connectivity<S>, comparator?: Comparator<ReturnType<S[keyof S]>>, comparatorMap?: Partial<{ [K in keyof S]: Comparator<ReturnType<S[K]>>; }> | undefined);
    observe<K extends keyof S>(key: K, observer: (result: ReturnType<S[K]>) => void, comparator?: (prev: ReturnType<S[K]>, next: ReturnType<S[K]>) => boolean): import("rx-store-types").Unobserve;
    observeMultiple<KS extends keyof S>(keys: ConstraintKeys<KS>, observer: (result: {
        [K in KS]: ReturnType<S[K]>;
    }) => void, comparator?: (prev: {
        [K in KS]: ReturnType<S[K]>;
    }, next: {
        [K in KS]: ReturnType<S[K]>;
    }) => boolean): import("rx-store-types").Unobserve;
    observeAll(observer: (result: {
        [K in keyof S]: ReturnType<S[K]>;
    }) => void, comparator?: (prev: {
        [K in keyof S]: ReturnType<S[K]>;
    }, next: {
        [K in keyof S]: ReturnType<S[K]>;
    }) => boolean): import("rx-store-types").Unobserve;
    getState<K extends keyof S>(key: K): ReturnType<S[K]>;
    getDefault<K extends keyof S>(key: K): ReturnType<S[K]>;
    getComparatorMap(): Partial<{ [K in keyof S]: Comparator<ReturnType<S[K]>>; }> | undefined;
    setState<KS extends keyof S>(updated: {
        [K in KS]: ReturnType<S[K]>;
    } | ((prevAll: {
        [K in keyof S]: ReturnType<S[K]>;
    }) => Partial<{
        [K in keyof S]: ReturnType<S[K]>;
    }>)): this;
    reset<K extends keyof S>(key: K): this;
    resetMultiple<KS extends keyof S>(keys: ConstraintKeys<KS>): this;
    resetAll(): this;
    getDataSource(): import("rxjs").Observable<{ [K in keyof S]: ReturnType<S[K]>; }>;
    createDispatch<K extends keyof S, T extends string>(params: {
        reducer: Reducer<T, S, K>;
        key: K;
    }): Dispatch<ReturnType<S[K]>, T>;
    createAsyncDispatch<K extends keyof S, T extends string>(params: {
        reducer: AsyncReducer<T, S, K>;
        key: K;
        config?: AsyncDispatchConfig<S, K>;
    }): [AsyncDispatch<T, S, K>, Observe<ReturnType<S[K]>>];
    withComputation<R>(params: {
        computation: Computation<R, S>;
        comparator?: Comparator<{
            [K in keyof S]: ReturnType<S[K]>;
        }>;
    }): ComputedImpl<R, S>;
    withAsyncComputation<R>(params: {
        computation: ComputationAsync<R, S>;
    } & AsyncComputeConfig<S, R>): ComputedAsyncImpl<R, S>;
}

import { AnsycReducer, AsyncDispatch, BS, Comparator, Computation, ComputationAsync, Connectivity, Dispatch, Reducer, RxStore, Subscribable } from "rx-store-types";
import { ComputedAsyncImpl, ComputedImpl } from "./computed";
export declare class RxStoreImpl<S extends BS> implements Subscribable<S>, RxStore<S> {
    protected connector: Connectivity<S>;
    private comparatorMap?;
    comparator: Comparator<any>;
    private objectCompare;
    constructor(connector: Connectivity<S>, comparator?: Comparator<ReturnType<S[keyof S]>>, comparatorMap?: Partial<{ [K in keyof S]: Comparator<ReturnType<S[K]>>; }> | undefined);
    observe<K extends keyof S>(key: K, observer: (result: ReturnType<S[K]>) => void, comparator?: (prev: ReturnType<S[K]>, next: ReturnType<S[K]>) => boolean): () => void;
    observeMultiple<KS extends keyof S>(keys: KS[], observer: (result: {
        [K in KS]: ReturnType<S[K]>;
    }) => void, comparator?: (prev: {
        [K in KS]: ReturnType<S[K]>;
    }, next: {
        [K in KS]: ReturnType<S[K]>;
    }) => boolean): () => void;
    observeAll(observer: (result: {
        [K in keyof S]: ReturnType<S[K]>;
    }) => void, comparator?: (prev: {
        [K in keyof S]: ReturnType<S[K]>;
    }, next: {
        [K in keyof S]: ReturnType<S[K]>;
    }) => boolean): () => void;
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
    resetMultiple<KS extends (keyof S)[]>(keys: KS): this;
    resetAll(): this;
    getDataSource(): import("rxjs").Observable<{ [K in keyof S]: ReturnType<S[K]>; }>;
    createDispatch<K extends keyof S, T, P = void>(params: {
        reducer: Reducer<T, P, S, K>;
        key: K;
    }): Dispatch<P, T>;
    createAsyncDispatch<K extends keyof S, T, P = void>(params: {
        reducer: AnsycReducer<T, P, S, K>;
        key: K;
    }): AsyncDispatch<P, T, S, K>;
    withComputation<R, KS extends keyof S>(params: {
        computation: Computation<R, S, KS>;
        keys: KS[];
    }): ComputedImpl<R, S, KS>;
    withAsyncComputation<R, KS extends keyof S>(params: {
        computation: ComputationAsync<R, S, KS>;
        keys: KS[];
    }): ComputedAsyncImpl<R, S, KS>;
}

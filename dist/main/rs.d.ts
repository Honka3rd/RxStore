import { BS, Comparator, Connectivity, Dispatch, Reducer, RxStore, Subscribable } from "./interfaces";
export declare class RxStoreImpl<S extends BS> implements Subscribable<S>, RxStore<S> {
    private connector;
    private comparatorMap?;
    private comparator;
    private objectCompare;
    constructor(connector: Connectivity<S>, comparator?: Comparator<any>, comparatorMap?: Partial<{
        [x: string]: Comparator<any>;
    }> | undefined);
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
    getStates<KS extends keyof S>(keys: KS[]): { [K in KS]: ReturnType<S[K]>; };
    getStateAll(): { [K in keyof S]: ReturnType<S[K]>; };
    setState<KS extends keyof S>(updated: {
        [K in KS]: ReturnType<S[K]>;
    } | (<KS extends keyof S>(prevAll: {
        [K in KS]: ReturnType<S[K]>;
    }) => Partial<{
        [K in keyof S]: ReturnType<S[K]>;
    }>)): this;
    reset<K extends keyof S>(key: K): this;
    resetAll<KS extends keyof S>(keys?: KS[]): this;
    getDataSource(): import("rxjs").Observable<{ [K in keyof S]: ReturnType<S[K]>; }>;
    createDispatch<K extends keyof S, T>(params: {
        reducer: Reducer<S, K, T>;
        key: K;
    }): Dispatch<S, K, T>;
}

import { BS, Comparator, Connectivity, ConstraintKeys, ReactiveConfig } from "rx-store-types";
import { ReactiveImpl } from "./reactive";
export declare class ConnectivityImpl<S extends BS> extends ReactiveImpl<S> implements Connectivity<S> {
    constructor(initiator: S, config?: ReactiveConfig);
    observe<K extends keyof S>(key: K, observer: (result: ReturnType<S[K]>) => void, comparator?: Comparator<ReturnType<S[K]>>): () => void;
    observeMultiple<KS extends keyof S>(keys: ConstraintKeys<KS>, observer: (result: {
        [K in KS]: ReturnType<S[K]>;
    }) => void, comparator?: Comparator<{
        [K in KS]: ReturnType<S[K]>;
    }>): () => void;
    observeAll(observer: (result: {
        [K in keyof S]: ReturnType<S[K]>;
    }) => void, comparator?: Comparator<{
        [K in keyof S]: ReturnType<S[K]>;
    }>): () => void;
}

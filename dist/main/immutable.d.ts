import { Record } from "immutable";
import { IBS, RxImStore, Connectivity, Subscribable, ConstraintKeys } from "rx-store-types";
import { RxStoreImpl } from "./store";
export declare class RxImStoreImpl<S extends IBS> extends RxStoreImpl<S> implements Subscribable<S>, RxImStore<S> {
    private factoryAll;
    constructor(connector: Connectivity<S>);
    getStateAll(): Record<{ [K in keyof S]: ReturnType<S[K]>; }> & Readonly<{ [K in keyof S]: ReturnType<S[K]>; }>;
    getStates<KS extends keyof S>(keys: ConstraintKeys<KS>): Record<{ [K in KS]: ReturnType<S[K]>; }> & Readonly<{ [K in KS]: ReturnType<S[K]>; }>;
    getDefaults<KS extends keyof S>(keys: ConstraintKeys<KS>): Record<{ [k in KS]: ReturnType<S[k]>; }> & Readonly<{ [k in KS]: ReturnType<S[k]>; }>;
    getDefaultAll(): Record<{ [K in keyof S]: ReturnType<S[K]>; }> & Readonly<{ [K in keyof S]: ReturnType<S[K]>; }>;
}

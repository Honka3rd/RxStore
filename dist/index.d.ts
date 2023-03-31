import { Collection, Map } from "immutable";
import { BS, CloneFunction, Comparator, ComparatorMap, Connectivity, NRSConfig, RxNStore, RxImStore, Subscribable, IBS, ReactiveConfig } from "rx-store-types";
import { RxStoreImpl } from "./main/rs";
declare class RxNStoreImpl<S extends BS> extends RxStoreImpl<S> implements Subscribable<S>, RxNStore<S> {
    private cloneFunction?;
    private cloneFunctionMap?;
    constructor(connector: Connectivity<S>, cloneFunction?: CloneFunction<ReturnType<S[keyof S]>> | undefined, cloneFunctionMap?: Partial<{ [K in keyof S]: CloneFunction<ReturnType<S[K]>>; }> | undefined, comparator?: Comparator<any>, comparatorMap?: ComparatorMap<any>);
    getClonedState<K extends keyof S>(key: K): ReturnType<S[K]>;
    getStateAll(): { [K in keyof S]: ReturnType<S[K]>; };
    getStates<KS extends keyof S>(keys: KS[]): { [K in KS]: ReturnType<S[K]>; };
    getImmutableState<K extends keyof S>(key: K): {
        readonly success: true;
        readonly immutable: Collection<keyof ReturnType<S[K]>, ReturnType<S[K]>[keyof ReturnType<S[K]>]>;
    } | {
        readonly success: false;
        readonly immutable: ReturnType<S[K]>;
    };
    getDefaults<KS extends (keyof S)[]>(keys: KS): { [k in keyof S]: ReturnType<S[k]>; };
    getDefaultAll(): { [k in keyof S]: ReturnType<S[k]>; };
}
export declare function NRS<S extends BS>(initiator: S, { cloneFunction, cloneFunctionMap, comparator, comparatorMap, config, }?: Partial<NRSConfig<S>>): RxNStoreImpl<S>;
declare class RxImStoreImpl<S extends IBS> extends RxStoreImpl<S> implements Subscribable<S>, RxImStore<S> {
    constructor(connector: Connectivity<S>, config?: ReactiveConfig);
    getStateAll(): Map<keyof S, ReturnType<S[keyof S]>>;
    getStates<KS extends keyof S>(keys: KS[]): Map<KS, ReturnType<S[KS]>>;
    getDefaults<KS extends (keyof S)[]>(keys: KS): Map<keyof S, ReturnType<S[keyof S]>>;
    getDefaultAll(): Map<keyof S, ReturnType<S[keyof S]>>;
}
export declare function IRS<S extends IBS>(initiator: S, config?: ReactiveConfig): RxImStoreImpl<S>;
export {};

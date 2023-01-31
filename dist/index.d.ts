import { Collection } from "immutable";
import { BS, CloneFunction, Comparator, ComparatorMap, Connectivity, NRSConfig, RxNStore, RxImStore, Subscribable, IBS } from "./main/interfaces";
import { RxStoreImpl } from "./main/rs";
declare class RxNStoreImpl<S extends BS> extends RxStoreImpl<S> implements Subscribable<S>, RxNStore<S> {
    private cloneFunction?;
    private cloneFunctionMap?;
    constructor(connector: Connectivity<S>, cloneFunction?: CloneFunction<ReturnType<S[keyof S]>> | undefined, cloneFunctionMap?: Partial<{ [K in keyof S]: CloneFunction<ReturnType<S[K]>>; }> | undefined, comparator?: Comparator<any>, comparatorMap?: ComparatorMap<any>);
    getClonedState<K extends keyof S>(key: K): ReturnType<S[K]>;
    getImmutableState<K extends keyof S>(key: K): {
        success: boolean;
        immutable: ReturnType<S[K]>;
    } | {
        readonly success: true;
        readonly immutable: Collection<keyof ReturnType<S[K]>, ReturnType<S[K]>[keyof ReturnType<S[K]>]>;
    };
}
export declare function NRS<S extends BS>(initiator: S, { cloneFunction, cloneFunctionMap, comparator, comparatorMap, }?: Partial<NRSConfig<S>>): RxNStoreImpl<S>;
declare class RxImStoreImpl<S extends IBS> extends RxStoreImpl<S> implements Subscribable<S>, RxImStore<S> {
    constructor(connector: Connectivity<S>);
}
export declare function IRS<S extends IBS>(initiator: S): RxImStoreImpl<S>;
export {};

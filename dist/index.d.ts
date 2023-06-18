import { Collection, Map } from "immutable";
import { BS, CloneFunction, Comparator, ComparatorMap, Connectivity, IBS, NRSConfig, ReactiveConfig, RxImStore, RxNStore, Subscribable } from "rx-store-types";
import { bound } from "./main/decorators/bound";
import { RxStoreImpl } from "./main/rs";
import { isObject } from "./main/util/isObject";
import { isPrimitive } from "./main/util/isPrimitive";
import { shallowClone } from "./main/util/shallowClone";
import { shallowCompare } from "./main/util/shallowCompare";
export declare class RxNStoreImpl<S extends BS> extends RxStoreImpl<S> implements Subscribable<S>, RxNStore<S> {
    cloneFunction?: CloneFunction<ReturnType<S[keyof S]>> | undefined;
    private cloneFunctionMap?;
    constructor(connector: Connectivity<S>, cloneFunction?: CloneFunction<ReturnType<S[keyof S]>> | undefined, cloneFunctionMap?: Partial<{ [K in keyof S]: CloneFunction<ReturnType<S[K]>>; }> | undefined, comparator?: Comparator<ReturnType<S[keyof S]>>, comparatorMap?: ComparatorMap<S>);
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
    getCloneFunctionMap(): Partial<{ [K in keyof S]: Comparator<ReturnType<S[K]>>; }>;
}
export declare function NRS<S extends BS>(initiator: S, { cloneFunction, cloneFunctionMap, comparator, comparatorMap, config, }?: Partial<NRSConfig<S>>): RxNStoreImpl<S>;
export declare class RxImStoreImpl<S extends IBS> extends RxStoreImpl<S> implements Subscribable<S>, RxImStore<S> {
    constructor(connector: Connectivity<S>);
    getStateAll(): Map<keyof S, ReturnType<S[keyof S]>>;
    getStates<KS extends keyof S>(keys: KS[]): Map<KS, ReturnType<S[KS]>>;
    getDefaults<KS extends (keyof S)[]>(keys: KS): Map<keyof S, ReturnType<S[keyof S]>>;
    getDefaultAll(): Map<keyof S, ReturnType<S[keyof S]>>;
}
export declare function IRS<S extends IBS>(initiator: S, config?: ReactiveConfig): RxImStoreImpl<S>;
export { shallowClone, shallowCompare, bound, isPrimitive, isObject };

import { Collection } from "immutable";
import { BS, CloneFunction, Comparator, ComparatorMap, Connectivity, ConstraintKeys, RxNStore, Subscribable } from "rx-store-types";
import { RxStoreImpl } from "./store";
export declare class RxNStoreImpl<S extends BS> extends RxStoreImpl<S> implements Subscribable<S>, RxNStore<S> {
    cloneFunction?: CloneFunction<ReturnType<S[keyof S]>> | undefined;
    private cloneFunctionMap?;
    constructor(connector: Connectivity<S>, cloneFunction?: CloneFunction<ReturnType<S[keyof S]>> | undefined, cloneFunctionMap?: Partial<{ [K in keyof S]: CloneFunction<ReturnType<S[K]>>; }> | undefined, comparator?: Comparator<ReturnType<S[keyof S]>>, comparatorMap?: ComparatorMap<S>);
    getClonedState<K extends keyof S>(key: K): ReturnType<S[K]>;
    getStateAll(): { [K in keyof S]: ReturnType<S[K]>; };
    getStates<KS extends keyof S>(keys: ConstraintKeys<KS>): { [K in KS]: ReturnType<S[K]>; };
    getImmutableState<K extends keyof S>(key: K): {
        readonly success: true;
        readonly immutable: Collection<keyof ReturnType<S[K]>, ReturnType<S[K]>[keyof ReturnType<S[K]>]>;
    } | {
        readonly success: false;
        readonly immutable: ReturnType<S[K]>;
    };
    getDefaults<KS extends keyof S>(keys: ConstraintKeys<KS>): { [k in KS]: ReturnType<S[k]>; };
    getDefaultAll(): { [k in keyof S]: ReturnType<S[k]>; };
    getCloneFunctionMap(): Partial<{ [K in keyof S]: Comparator<ReturnType<S[K]>>; }>;
}

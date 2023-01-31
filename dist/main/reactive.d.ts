import { BS, Reactive } from "./interfaces";
export declare class ReactiveImpl<S extends BS> implements Reactive<S> {
    private initiator;
    private dataSource;
    constructor(initiator: S);
    private init;
    get<K extends keyof S>(key: K): { [K_1 in keyof S]: ReturnType<S[K_1]>; }[K];
    set<KS extends keyof S>(updated: {
        [K in KS]: ReturnType<S[K]>;
    }): void;
    reset<K extends keyof S>(key: K): void;
    source(): import("rxjs").Observable<{ [K in keyof S]: ReturnType<S[K]>; }>;
    getDefault<K extends keyof S>(key: K): any;
    getDefaults<KS extends keyof S>(keys: KS[]): { [k in KS]: ReturnType<S[k]>; };
    getDefaultAll: () => { [k in keyof S]: ReturnType<S[k]>; };
    getMultiple<KS extends keyof S>(keys: KS[]): { [K in KS]: ReturnType<S[K]>; };
    getAll(): { [K in keyof S]: ReturnType<S[K]>; };
    getAllKeys(): Array<keyof S>;
}

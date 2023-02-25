import { BS, Reactive, ReactiveConfig } from "./interfaces";
export declare class ReactiveImpl<S extends BS> implements Reactive<S> {
    private initiator;
    private dataSource;
    constructor(initiator: S, config: ReactiveConfig);
    private init;
    get<K extends keyof S>(key: K): ReturnType<S[K]>;
    set<KS extends keyof S>(updated: {
        [K in KS]: ReturnType<S[K]>;
    }): void;
    reset<K extends keyof S>(key: K): void;
    resetMultiple<KS extends (keyof S)[]>(keys: KS): void;
    resetAll(): void;
    source(): import("rxjs").Observable<{ [K in keyof S]: ReturnType<S[K]>; }>;
    getDefault<K extends keyof S>(key: K): any;
    getDefaults<KS extends keyof S>(keys: KS[]): { [k in KS]: ReturnType<S[k]>; };
    getDefaultAll: () => { [k in keyof S]: ReturnType<S[k]>; };
    getMultiple<KS extends keyof S>(keys: KS[]): { [K in KS]: ReturnType<S[K]>; };
    getAll(): { [K in keyof S]: ReturnType<S[K]>; } | { [K_1 in keyof S]: ReturnType<S[K_1]>; } | { [K_2 in keyof S]: ReturnType<S[K_2]>; };
    getAllKeys(): Array<keyof S>;
}

import { Action, AsyncReducer, AsyncDispatchConfig, AsyncDispatcher, BS, Dispatcher, Reducer, RxStore } from "rx-store-types";
export declare class DispatcherImpl<S extends BS, K extends keyof S, T extends string> implements Dispatcher<ReturnType<S[K]>, T> {
    private reducer;
    private store;
    private key;
    constructor(reducer: Reducer<T, S, K>, store: RxStore<S>, key: K);
    dispatch(action: Action<ReturnType<S[K]>, T>): void;
}
export declare class AsyncDispatcherImpl<S extends BS, K extends keyof S, T extends string> implements AsyncDispatcher<T, S, K> {
    private reducer;
    private store;
    private key;
    constructor(reducer: AsyncReducer<T, S, K>, store: RxStore<S>, key: K);
    dispatch(action: Action<ReturnType<S[K]>, T>, config?: AsyncDispatchConfig<S, K>): Promise<void>;
}

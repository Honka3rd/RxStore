import { Action, AsyncReducer, AsyncDispatchConfig, AsyncDispatcher, BS, Dispatcher, Reducer, RxStore } from "rx-store-types";
export declare class DispatcherImpl<S extends BS, K extends keyof S, T, P> implements Dispatcher<P, T> {
    private reducer;
    private store;
    private key;
    constructor(reducer: Reducer<T, P, S, K>, store: RxStore<S>, key: K);
    dispatch(action: Action<P, T>): void;
}
export declare class AsyncDispatcherImpl<S extends BS, K extends keyof S, T, P> implements AsyncDispatcher<P, T, S, K> {
    private reducer;
    private store;
    private key;
    constructor(reducer: AsyncReducer<T, P, S, K>, store: RxStore<S>, key: K);
    dispatch(action: Action<P, T>, config?: AsyncDispatchConfig<S, K>): Promise<void>;
}

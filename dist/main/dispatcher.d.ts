import { BS, Dispatcher, Reducer, RxStore } from "./interfaces";
export declare class DispatcherImpl<S extends BS, K extends keyof S, T> implements Dispatcher<S, K, T> {
    private reducer;
    private store;
    private key;
    constructor(reducer: Reducer<S, K, T>, store: RxStore<S>, key: K);
    dispatch(action: {
        type: T;
        payload: ReturnType<S[K]>;
    }): void;
}

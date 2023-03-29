import { Computed, Computation, BS, Connectivity, Comparator, ComputationAsync, ComputedAsync, AsyncResponse, AsyncStates } from "rx-store-types";
export declare class ComputedImpl<R, S extends BS, KS extends keyof S> implements Computed<R, S, KS> {
    private subscribable;
    private keys;
    private comparator?;
    readonly computation: Computation<R, S, KS>;
    private computed;
    constructor(computation: Computation<R, S, KS>, subscribable: Connectivity<S>, keys: Array<KS>, comparator?: Comparator<{ [K in KS]: ReturnType<S[K]>; }> | undefined);
    get(): R;
    observe(observer: (r: R) => void): () => void;
}
export declare class ComputedAsyncImpl<R, S extends BS, KS extends keyof S> implements ComputedAsync<R, S, KS> {
    private subscribable;
    private keys;
    readonly computation: ComputationAsync<R, S, KS>;
    private computed?;
    private state;
    constructor(computation: ComputationAsync<R, S, KS>, subscribable: Connectivity<S>, keys: Array<KS>);
    get(): {
        state: AsyncStates;
        value: R | undefined;
    };
    observe(observer: (r: AsyncResponse<R>) => void): () => void;
}

import { Computed, Computation, BS, Connectivity, Comparator, ComputationAsync, ComputedAsync, AsyncResponse, AsyncStates } from "rx-store-types";
export declare class ComputedImpl<R, S extends BS> implements Computed<R, S> {
    private subscribable;
    private comparator?;
    readonly computation: Computation<R, S>;
    private $source;
    constructor(computation: Computation<R, S>, subscribable: Connectivity<S>, comparator?: Comparator<{ [K in keyof S]: ReturnType<S[K]>; }> | undefined);
    private setComputed;
    get(): R;
    observe(observer: (r: R) => void): () => void;
}
export declare class ComputedAsyncImpl<R, S extends BS> implements ComputedAsync<R, S> {
    private subscribable;
    private lazy;
    private onStart?;
    private onError?;
    private onSuccess?;
    private onComplete?;
    readonly computation: ComputationAsync<R, S>;
    private computed?;
    private state;
    constructor(computation: ComputationAsync<R, S>, subscribable: Connectivity<S>, lazy: boolean, onStart?: ((val: { [K in keyof S]: ReturnType<S[K]>; }) => void) | undefined, onError?: ((err: any) => void) | undefined, onSuccess?: ((result: R) => void) | undefined, onComplete?: (() => void) | undefined);
    private getObservable;
    get(): {
        state: AsyncStates;
        value: R | undefined;
    };
    observe(observer: (r: AsyncResponse<R>) => void, onPending?: Function): () => void;
}

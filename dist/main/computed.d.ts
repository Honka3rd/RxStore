import { Computed, Computation, BS, Connectivity, Comparator } from "./interfaces";
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

import {
  Computed,
  Computation,
  BS,
  Subscribable,
  Comparator,
} from "./interfaces";

export class ComputedImpl<R, S extends BS, KS extends keyof S>
  implements Computed<R, S, KS>
{
  readonly computation: Computation<R, S, KS>;
  private computed?: R;

  constructor(
    computation: Computation<R, S, KS>,
    private subscribable: Subscribable<S>,
    private keys: Array<KS>,
    private comparator?: Comparator<{ [K in KS]: ReturnType<S[K]> }>
  ) {
    this.computation = computation;
    this.get = this.get.bind(this);
    this.start = this.start.bind(this);
  }

  get() {
    return this.computed;
  }

  start(observer: (r: R) => void) {
    return this.subscribable.observeMultiple(
      this.keys,
      (states) => {
        const value = this.computation(states);
        this.computed = value;
        observer(value);
      },
      this.comparator
    );
  }
}

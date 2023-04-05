import { catchError, from, map, of, switchMap, tap } from "rxjs";
import {
  Computed,
  Computation,
  BS,
  Connectivity,
  Comparator,
  ComputationAsync,
  ComputedAsync,
  AsyncResponse,
  AsyncStates,
} from "rx-store-types";

export class ComputedImpl<R, S extends BS, KS extends keyof S>
  implements Computed<R, S, KS>
{
  readonly computation: Computation<R, S, KS>;
  private computed: R;

  constructor(
    computation: Computation<R, S, KS>,
    private subscribable: Connectivity<S>,
    private keys: Array<KS>,
    private comparator?: Comparator<{ [K in KS]: ReturnType<S[K]> }>
  ) {
    this.computation = computation;
    this.computed = this.computation(subscribable.getDefaultAll());
    this.get = this.get.bind(this);
    this.observe = this.observe.bind(this);
  }

  get() {
    return this.computed;
  }

  observe(observer: (r: R) => void) {
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

export class ComputedAsyncImpl<R, S extends BS, KS extends keyof S>
  implements ComputedAsync<R, S, KS>
{
  readonly computation: ComputationAsync<R, S, KS>;
  private computed?: R;
  private state: AsyncStates = AsyncStates.PENDING;

  constructor(
    computation: ComputationAsync<R, S, KS>,
    private subscribable: Connectivity<S>,
    private keys: Array<KS>,
  ) {
    this.computation = computation;
    this.get = this.get.bind(this);
    this.observe = this.observe.bind(this);
  }

  get() {
    return {
      state: this.state,
      value: this.computed,
    };
  }

  observe(observer: (r: AsyncResponse<R>) => void) {
    const subscription = this.subscribable
      .source()
      .pipe(
        tap(() => {
          this.state = AsyncStates.PENDING;
        }),
        switchMap((states) => {
          const asyncReturn = this.computation(states);
          const async$ =
            asyncReturn instanceof Promise ? from(asyncReturn) : asyncReturn;
          return async$.pipe(
            map((result) => {
              return {
                success: true,
                result,
              } as const;
            }),
            catchError((err) => {
              return of({
                success: false,
                cause: err,
              } as const);
            }),
            tap(({ success }) => {
              if (success) {
                this.state = AsyncStates.FULFILLED;
                return;
              }
              this.state = AsyncStates.ERROR;
            })
          );
        })
      )
      .subscribe(observer);
    return () => subscription.unsubscribe();
  }
}

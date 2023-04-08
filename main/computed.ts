import {
  catchError,
  distinctUntilChanged,
  from,
  map,
  of,
  switchMap,
  tap,
} from "rxjs";
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
import { bound } from "./decorators/bound";

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
  }

  @bound
  get() {
    return this.computed;
  }

  @bound
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
    private comparator?: Comparator<{ [K in KS]: ReturnType<S[K]> }>,
    private onStart?: (val: { [K in keyof S]: ReturnType<S[K]> }) => void,
    private onError?: (err: any) => void,
    private onSuccess?: (result: R) => void,
    private onComplete?: () => void
  ) {
    this.computation = computation;
  }

  @bound
  get() {
    return {
      state: this.state,
      value: this.computed,
    };
  }

  @bound
  observe(observer: (r: AsyncResponse<R>) => void) {
    const subscription = this.subscribable
      .source()
      .pipe(
        tap((val) => {
          this.state = AsyncStates.PENDING;
          this.onStart?.(val);
        }),
        map((val) => {
          return this.keys.reduce((acc, next) => {
            acc[next] = val[next];
            return acc;
          }, {} as { [K in KS]: ReturnType<S[K]> });
        }),
        distinctUntilChanged(this.comparator),
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
            tap((deferred) => {
              if (deferred.success) {
                this.state = AsyncStates.FULFILLED;
                this.onSuccess?.(deferred.result);
                return;
              }
              this.onError?.(deferred.cause);
              this.state = AsyncStates.ERROR;
            })
          );
        })
      )
      .subscribe({
        next: observer,
        complete: this.onComplete
      });
    return () => subscription.unsubscribe();
  }
}

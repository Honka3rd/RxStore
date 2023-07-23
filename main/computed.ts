import {
  catchError,
  distinctUntilChanged,
  exhaustMap,
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

export class ComputedImpl<R, S extends BS> implements Computed<R, S> {
  readonly computation: Computation<R, S>;
  private computed: R;

  constructor(
    computation: Computation<R, S>,
    private subscribable: Connectivity<S>,
    private comparator?: Comparator<{ [K in keyof S]: ReturnType<S[K]> }>
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
    return this.subscribable.observeAll((states) => {
      const value = this.computation(states);
      this.computed = value;
      observer(value);
    }, this.comparator);
  }
}

export class ComputedAsyncImpl<R, S extends BS> implements ComputedAsync<R, S> {
  readonly computation: ComputationAsync<R, S>;
  private computed?: R;
  private state: AsyncStates = AsyncStates.PENDING;

  constructor(
    computation: ComputationAsync<R, S>,
    private subscribable: Connectivity<S>,
    private lazy: boolean,
    private comparator?: Comparator<{ [K in keyof S]: ReturnType<S[K]> }>,
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
  observe(observer: (r: AsyncResponse<R>) => void, onPending?: Function) {
    const connect = this.lazy ? exhaustMap : switchMap;
    const subscription = this.subscribable
      .source()
      .pipe(
        //distinctUntilChanged(this.comparator),
        tap((val) => {
          this.state = AsyncStates.PENDING;
          onPending?.();
          this.onStart?.(val);
        }),
        connect((states) => {
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
        complete: this.onComplete,
      });
    return () => subscription.unsubscribe();
  }
}

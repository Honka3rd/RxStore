import { BehaviorSubject, catchError, exhaustMap, from, map, of, switchMap, tap } from "rxjs";
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
  private $source: BehaviorSubject<R>;

  constructor(
    computation: Computation<R, S>,
    private subscribable: Connectivity<S>,
    private comparator?: Comparator<{ [K in keyof S]: ReturnType<S[K]> }>
  ) {
    this.computation = computation;
    this.$source = new BehaviorSubject<R>(this.computation(subscribable.getDefaultAll()))
  }

  @bound
  private setComputed(states: { [K in keyof S]: ReturnType<S[K]> }) {
    const value = this.computation(states);
    this.$source.next(value);
  }

  @bound
  get() {
    return this.$source.value;
  }

  @bound
  observe(observer: (r: R) => void) {
    const subscription = this.$source.subscribe(observer);
    const unObserveAll = this.subscribable.observeAll(this.setComputed, this.comparator);
    return () => {
      subscription.unsubscribe();
      unObserveAll();
    }
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
    private onStart?: (val: { [K in keyof S]: ReturnType<S[K]> }) => void,
    private onError?: (err: any) => void,
    private onSuccess?: (result: R) => void,
    private onComplete?: () => void
  ) {
    this.computation = computation;
  }

  private getObservable(states: { [K in keyof S]: ReturnType<S[K]> }) {
    const asyncReturn = this.computation(states);
    return asyncReturn instanceof Promise ? from(asyncReturn) : asyncReturn;
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
        tap((val) => {
          this.state = AsyncStates.PENDING;
          onPending?.();
          this.onStart?.(val);
        }),
        connect((states) => {
          return this.getObservable(states).pipe(
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

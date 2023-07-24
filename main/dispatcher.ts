import {
  catchError,
  exhaustMap,
  from,
  lastValueFrom,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from "rxjs";
import {
  Action,
  AsyncReducer,
  AsyncDispatchConfig,
  AsyncDispatcher,
  BS,
  Dispatcher,
  Reducer,
  RxStore,
  Observer,
} from "rx-store-types";
import { bound } from "./decorators/bound";

export class DispatcherImpl<S extends BS, K extends keyof S, T extends string>
  implements Dispatcher<ReturnType<S[K]>, T>
{
  constructor(
    private reducer: Reducer<T, S, K>,
    private store: RxStore<S>,
    private key: K
  ) {}

  @bound
  dispatch(action: Action<ReturnType<S[K]>, T>) {
    const mutation = {
      [this.key]: this.reducer(this.store.getState(this.key), {
        type: action.type,
        payload:
          action.payload !== undefined
            ? action.payload
            : this.store.getDefault(this.key),
      }),
    } as {};
    this.store.setState(mutation);
  }
}

export class AsyncDispatcherImpl<
  S extends BS,
  K extends keyof S,
  T extends string
> implements AsyncDispatcher<T, S, K>
{
  private dispatchSignal: Subject<
    Action<ReturnType<S[K]>, T> & AsyncDispatchConfig<S, K>
  > = new Subject();
  constructor(
    private reducer: AsyncReducer<T, S, K>,
    private store: RxStore<S>,
    private key: K,
    private config?: AsyncDispatchConfig<S, K>
  ) {}

  @bound
  observe(observer?: Observer<ReturnType<S[K]>>) {
    let connect = this.config?.lazy ? exhaustMap : switchMap;
    const subscription = this.dispatchSignal
      .pipe(
        tap(({ lazy }) => {
          if (lazy) {
            connect = exhaustMap;
            return;
          }
          connect = switchMap;
        }),
        tap(({ start }) => {
          if (start) {
            start();
            return;
          }
          this.config?.start?.();
        }),
        map(({ type, payload, fail, fallback, always, success }) => {
          const result$ = this.reducer(this.store.getState(this.key), {
            type,
            payload,
          });
          const converged$ =
            result$ instanceof Promise ? from(result$) : result$;
          return converged$.pipe(
            catchError((err) => {
              const getDefault = fallback ? fallback : this.config?.fallback
              const valOnErr = getDefault
                ? getDefault()
                : this.store.getState(this.key);
              if (fail) {
                fail(err);
              } else {
                this.config?.fail?.(err);
              }
              return of(valOnErr);
            }),
            tap((resp) => {
              if (success) {
                success(resp);
              } else {
                this.config?.success?.(resp);
              }
            }),
            tap(() => {
              if (always) {
                always();
              } else {
                this.config?.always?.();
              }
            })
          );
        }),
        connect((converged$) => converged$)
      )
      .subscribe(observer);
    return () => subscription.unsubscribe();
  }

  @bound
  async dispatch(
    action: Action<ReturnType<S[K]>, T>,
    config: AsyncDispatchConfig<S, K> = {}
  ) {
    this.dispatchSignal.next({ ...action, ...config });
  }
}

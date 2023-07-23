import { lastValueFrom, Observable } from "rxjs";
import {
  Action,
  AsyncReducer,
  AsyncDispatchConfig,
  AsyncDispatcher,
  BS,
  Dispatcher,
  Reducer,
  RxStore,
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
  constructor(
    private reducer: AsyncReducer<T, S, K>,
    private store: RxStore<S>,
    private key: K
  ) {}

  @bound
  async dispatch(
    action: Action<ReturnType<S[K]>, T>,
    config: AsyncDispatchConfig<S, K> = {}
  ) {
    const { start, fail, fallback, always, success } = config;
    const asyncResult = this.reducer(this.store.getState(this.key), action);
    start?.();
    try {
      const async$ =
        asyncResult instanceof Observable
          ? lastValueFrom(asyncResult)
          : asyncResult;
      const result = await async$;
      success?.(result);
      const mutation = {
        [this.key]: result,
      } as {};
      this.store.setState(mutation);
    } catch (error) {
      fail?.(error);
      if (!fallback) {
        return;
      }
      this.store.setState({
        [this.key]: fallback(),
      } as {});
    } finally {
      always?.();
    }
  }
}

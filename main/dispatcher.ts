import { lastValueFrom, Observable } from "rxjs";
import {
  Action,
  AnsycReducer,
  AsyncDispatchConfig,
  AsyncDispatcher,
  BS,
  Dispatcher,
  Reducer,
  RxStore,
} from "rx-store-types";

export class DispatcherImpl<S extends BS, K extends keyof S, T, P>
  implements Dispatcher<P, T>
{
  constructor(
    private reducer: Reducer<T, P, S, K>,
    private store: RxStore<S>,
    private key: K
  ) {
    this.dispatch = this.dispatch.bind(this);
  }

  dispatch(action: Action<P, T>) {
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

export class AsyncDispatcherImpl<S extends BS, K extends keyof S, T, P>
  implements AsyncDispatcher<P, T, S, K>
{
  constructor(
    private reducer: AnsycReducer<T, P, S, K>,
    private store: RxStore<S>,
    private key: K
  ) {
    this.dispatch = this.dispatch.bind(this);
  }

  async dispatch(action: Action<P, T>, config: AsyncDispatchConfig<S, K> = {}) {
    const { start, fail, errorFallback, always, success } = config;
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
      if (!errorFallback) {
        return;
      }
      this.store.setState({
        [this.key]: errorFallback(),
      } as {});
    } finally {
      always?.();
    }
  }
}

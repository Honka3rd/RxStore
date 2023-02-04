import { Action, BS, Dispatcher, Reducer, RxStore } from "./interfaces";

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
    this.store.setState(
      Object.create({
        [this.key]: this.reducer(this.store.getState(this.key), action),
      })
    );
  }
}

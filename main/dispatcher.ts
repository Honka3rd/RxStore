import { BS, Dispatcher, Reducer, RxStore } from "./interfaces";

export class DispatcherImpl<S extends BS, K extends keyof S, T>
  implements Dispatcher<S, K, T>
{
  constructor(
    private reducer: Reducer<S, K, T>,
    private store: RxStore<S>,
    private key: K
  ) {
    this.dispatch = this.dispatch.bind(this);
  }

  dispatch(action: { type: T; payload: ReturnType<S[K]> }) {
    const nextVal = this.reducer(this.store.getState(this.key), action);
    this.store.setState(Object.create({ [this.key]: nextVal }));
  }
}

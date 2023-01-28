import { Observable } from "rxjs";
import { ConnectivityImpl } from "./main/connectivity";
import { BS, Connectivity, RxStore, Subscribable } from "./main/interfaces";

class RxStoreImpl<S extends BS> implements Subscribable<S>, RxStore<S> {
  constructor(
    private connector: Connectivity<S>,
    private cloneFunction?: <T>(input: T) => T
  ) {
    this.dispatch = this.dispatch.bind(this);
    this.getState = this.getState.bind(this);
    this.getStateAll = this.getStateAll.bind(this);
    this.getStates = this.getStates.bind(this);
    this.reset = this.reset.bind(this);
    this.resetAll = this.resetAll.bind(this);
    this.subscribeAll = this.subscribeAll.bind(this);
    this.subscribeMultiple = this.subscribeMultiple.bind(this);
    this.subscribeTo = this.subscribeTo.bind(this);
    this.getDataSource = this.getDataSource.bind(this);
  }

  subscribeTo<K extends keyof S>(
    key: K,
    observer: (result: ReturnType<S[K]>) => void,
    comparator?: (prev: ReturnType<S[K]>, next: ReturnType<S[K]>) => boolean
  ) {
    return this.connector.subscribeTo(key, observer, comparator);
  }

  subscribeMultiple<KS extends keyof S>(
    keys: KS[],
    observer: (result: { [K in KS]: ReturnType<S[K]> }) => void,
    comparator?: (
      prev: { [K in KS]: ReturnType<S[K]> },
      next: { [K in KS]: ReturnType<S[K]> }
    ) => boolean
  ) {
    return this.connector.subscribeMultiple(keys, observer, comparator);
  }

  subscribeAll(
    observer: (result: { [K in keyof S]: ReturnType<S[K]> }) => void,
    comparator?: (
      prev: { [K in keyof S]: ReturnType<S[K]> },
      next: { [K in keyof S]: ReturnType<S[K]> }
    ) => boolean
  ) {
    return this.connector.subscribeAll(observer, comparator);
  }

  getState<K extends keyof S>(key: K, cloned = true) {
    const { cloneFunction } = this;
    if (cloned && cloneFunction) {
      return cloneFunction(this.connector.get(key));
    }

    return this.connector.get(key);
  }

  getStates<KS extends keyof S>(keys: KS[], cloned = true) {
    const { cloneFunction } = this;
    if (cloned && cloneFunction) {
      return cloneFunction(this.connector.getMultiple(keys));
    }

    return this.connector.getMultiple(keys);
  }

  getStateAll(cloned = true) {
    const { cloneFunction } = this;
    if (cloned && cloneFunction) {
      return cloneFunction(this.connector.getAll());
    }

    return this.connector.getAll();
  }

  dispatch<KS extends keyof S>(updated: { [K in KS]: ReturnType<S[K]> }) {
    this.connector.set(updated);
    return this;
  }

  reset<K extends keyof S>(key: K) {
    this.connector.reset(key);
    return this;
  }

  resetAll<KS extends keyof S>(keys?: KS[]) {
    if (!keys) {
      const all = this.connector.getAllKeys().reduce((acc, next) => {
        acc[next] = this.connector.getDefault(next);
        return acc;
      }, {} as { [k in keyof S]: ReturnType<S[k]> });
      this.connector.set(all);
      return this;
    }
    const defaults = keys.reduce((acc, next) => {
      acc[next] = this.connector.getDefault(next);
      return acc;
    }, {} as { [k in KS]: ReturnType<S[k]> });
    this.connector.set(defaults);
    return this;
  }

  getDataSource() {
    return this.connector.source();
  }
}

export default function IRS<S extends BS>(
  initiator: S,
  cloneFunction?: <T>(input: T) => T
) {
  return new RxStoreImpl(new ConnectivityImpl(initiator), cloneFunction);
}

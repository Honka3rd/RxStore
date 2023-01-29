import { BehaviorSubject } from "rxjs";
import { BS, Reactive } from "./interfaces";

export class ReactiveImpl<S extends BS> implements Reactive<S> {
  private dataSource: BehaviorSubject<{ [K in keyof S]: ReturnType<S[K]> }>;

  constructor(private initiator: S) {
    this.dataSource = this.init();
  }

  private init(): BehaviorSubject<{ [K in keyof S]: ReturnType<S[K]> }> {
    const keys = Object.getOwnPropertyNames(this.initiator) as Array<keyof S>;
    const initData = keys.reduce((acc, next) => {
      acc[next] = this.initiator[next]();
      return acc;
    }, {} as { [K in keyof S]: ReturnType<S[K]> });
    return new BehaviorSubject(initData);
  }

  get<K extends keyof S>(key: K) {
    return this.dataSource.value[key];
  }

  set<KS extends keyof S>(updated: { [K in KS]: ReturnType<S[K]> }) {
    const data = this.dataSource.value;
    const keys = Object.getOwnPropertyNames(updated) as Array<KS>;
    keys.forEach((k) => {
      data[k] = updated[k];
    });
    this.dataSource.next(data);
  }

  reset<K extends keyof S>(key: K) {
    const data = this.dataSource.value;
    data[key] = this.initiator[key]();
    this.dataSource.next(data);
  }

  source() {
    return this.dataSource.asObservable();
  }

  getDefault<K extends keyof S>(key: K) {
    return this.initiator[key]();
  }

  getDefaults<KS extends keyof S>(keys: KS[]) {
    return keys.reduce((acc, next) => {
      acc[next] = this.getDefault(next);
      return acc;
    }, {} as { [k in KS]: ReturnType<S[k]> });
  }

  getDefaultAll = () => {
    return this.getAllKeys().reduce((acc, next) => {
      acc[next] = this.getDefault(next);
      return acc;
    }, {} as { [k in keyof S]: ReturnType<S[k]> });
  };

  getMultiple<KS extends keyof S>(keys: KS[]) {
    const data = this.dataSource.value;
    return keys.reduce((acc, next) => {
      acc[next] = data[next];
      return acc;
    }, {} as { [K in KS]: ReturnType<S[K]> });
  }

  getAll() {
    return {
      ...this.dataSource.value,
    };
  }

  getAllKeys(): Array<keyof S> {
    return Object.getOwnPropertyNames(this.initiator);
  }
}

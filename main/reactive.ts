import { BehaviorSubject } from "rxjs";
import { BS, Reactive, ReactiveConfig } from "./interfaces";
import { AsyncBeheviorSubjectWithValue } from "./util/AsyncBeheviorSubjectWithValue";
import { AsyncSubjectWithValue } from "./util/AsyncSubjectWithValue";
import { SubjectWithValue } from "./util/SubjectWithValue";

export class ReactiveImpl<S extends BS> implements Reactive<S> {
  private dataSource:
    | BehaviorSubject<{ [K in keyof S]: ReturnType<S[K]> }>
    | SubjectWithValue<{ [K in keyof S]: ReturnType<S[K]> }>
    | AsyncSubjectWithValue<{ [K in keyof S]: ReturnType<S[K]> }>
    

  constructor(private initiator: S, config: ReactiveConfig) {
    this.dataSource = this.init(config);
  }

  private init({ fireOnCreate, schedule }: ReactiveConfig) {
    const keys = Object.keys(this.initiator) as Array<keyof S>;
    const initData = keys.reduce((acc, next) => {
      acc[next] = this.initiator[next](this);
      return acc;
    }, {} as { [K in keyof S]: ReturnType<S[K]> });

    if(schedule === "async") {
      return fireOnCreate
      ? new AsyncBeheviorSubjectWithValue(initData)
      : new AsyncSubjectWithValue(initData);
    }

    return fireOnCreate
      ? new BehaviorSubject(initData)
      : new SubjectWithValue(initData);
  }

  get<K extends keyof S>(key: K) {
    return this.dataSource.value[key] as ReturnType<S[K]>;
  }

  set<KS extends keyof S>(updated: { [K in KS]: ReturnType<S[K]> }) {
    const data = this.dataSource.value;
    const keys = Object.keys(updated) as Array<KS>;
    keys.forEach((k) => {
      data[k] = updated[k];
    });
    this.dataSource.next(data);
  }

  reset<K extends keyof S>(key: K) {
    const data = this.dataSource.value;
    data[key] = this.initiator[key](this);
    this.dataSource.next(data);
  }

  resetMultiple<KS extends (keyof S)[]>(keys: KS) {
    const data = this.dataSource.value;
    keys.forEach((key) => {
      data[key] = this.initiator[key](this);
    });
    this.dataSource.next(data);
  }

  resetAll() {
    const data = this.dataSource.value;
    this.getAllKeys().forEach((key) => {
      data[key] = this.initiator[key](this);
    });
    this.dataSource.next(data);
  }

  source() {
    return this.dataSource.asObservable();
  }

  getDefault<K extends keyof S>(key: K):ReturnType<S[K]> {
    return this.initiator[key](this);
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
      acc[next] = this.get(next);
      return acc;
    }, {} as { [K in KS]: ReturnType<S[K]> });
  }

  getAll() {
    return {
      ...this.dataSource.value,
    };
  }

  getAllKeys(): Array<keyof S> {
    return Object.keys(this.initiator);
  }
}

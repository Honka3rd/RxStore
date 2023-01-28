import { Observable, Subscription } from "rxjs";

export type BS = {
  [k: string]: () => any;
};

export interface Reactive<S extends BS> {
  get: <K extends keyof S>(key: K) => S[K];

  reset: <K extends keyof S>(key: K) => void;

  set: <KS extends keyof S>(updated: { [K in KS]: ReturnType<S[K]> }) => void;

  source: () => Observable<{ [K in keyof S]: ReturnType<S[K]> }>;

  getDefault: <K extends keyof S>(key: K) => ReturnType<S[K]>;

  getMultiple: <KS extends keyof S>(
    keys: KS[]
  ) => { [K in KS]: ReturnType<S[K]> };

  getAll: () => { [K in keyof S]: ReturnType<S[K]> };

  getAllKeys: () => Array<keyof S>;
}

export type Subscribable<S extends BS> = {
  subscribeTo: <K extends keyof S>(
    key: K,
    observer: (result: ReturnType<S[K]>) => void,
    comparator?: (prev: ReturnType<S[K]>, next: ReturnType<S[K]>) => boolean
  ) => Subscription;

  subscribeMultiple: <KS extends keyof S>(
    keys: KS[],
    observer: (result: { [K in KS]: ReturnType<S[K]> }) => void,
    comparator?: (
      prev: { [K in KS]: ReturnType<S[K]> },
      next: { [K in KS]: ReturnType<S[K]> }
    ) => boolean
  ) => Subscription;

  subscribeAll: (
    observer: (result: { [K in keyof S]: ReturnType<S[K]> }) => void,
    comparator?: (
      prev: { [K in keyof S]: ReturnType<S[K]> },
      next: { [K in keyof S]: ReturnType<S[K]> }
    ) => boolean
  ) => Subscription;
};

export interface Connectivity<S extends BS>
  extends Reactive<S>,
    Subscribable<S> {}

export interface RxStore<S extends BS> {
  dispatch: <KS extends keyof S>(updated: {
    [K in KS]: ReturnType<S[K]>;
  }) => this;
  reset: <K extends keyof S>(key: K) => this;
  resetAll: <KS extends keyof S>(keys?: KS[]) => this;
  getState: <K extends keyof S>(key: K, cloned?: boolean) => S[K];
  getStates: <KS extends keyof S>(
    keys: KS[],
    cloned?: boolean
  ) => { [K in KS]: ReturnType<S[K]> };
  getStateAll: (cloned?: boolean) => { [K in keyof S]: ReturnType<S[K]> };
  getDataSource: () => Observable<{ [K in keyof S]: ReturnType<S[K]> }>;
}

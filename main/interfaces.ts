import { Observable, Subscription } from "rxjs";
import { is, fromJS, Collection } from "immutable";

export type BS = {
  [k: string]: () => any;
};

export interface IBS extends BS {
  [k: string]: <R extends Collection<any, any>>() => R;
}

export type CloneFunction<T> = (input: T) => T;

export type CloneFunctionMap<S extends BS> = Partial<{
  [K in keyof S]: CloneFunction<ReturnType<S[K]>>;
}>;

export type Comparator<T> = (prev: T, next: T) => boolean;

export type ComparatorMap<S extends BS> = Partial<{
  [K in keyof S]: Comparator<ReturnType<S[K]>>;
}>;

export interface Reactive<S extends BS> {
  get: <K extends keyof S>(key: K) => ReturnType<S[K]>;

  reset: <K extends keyof S>(key: K) => void;

  set: <KS extends keyof S>(updated: { [K in KS]: ReturnType<S[K]> }) => void;

  source: () => Observable<{ [K in keyof S]: ReturnType<S[K]> }>;

  getDefault: <K extends keyof S>(key: K) => ReturnType<S[K]>;

  getMultiple: <KS extends keyof S>(
    keys: KS[]
  ) => { [K in KS]: ReturnType<S[K]> };

  getAll: () => { [K in keyof S]: ReturnType<S[K]> };

  getAllKeys: () => Array<keyof S>;

  getDefaults<KS extends keyof S>(keys: KS[]): { [k in KS]: ReturnType<S[k]> };

  getDefaultAll: () => { [k in keyof S]: ReturnType<S[k]> };
}

export type Subscribable<S extends BS> = {
  subscribeTo: <K extends keyof S>(
    key: K,
    observer: (result: ReturnType<S[K]>) => void,
    comparator?: Comparator<ReturnType<S[K]>>
  ) => Subscription;

  subscribeMultiple: <KS extends keyof S>(
    keys: KS[],
    observer: (result: { [K in KS]: ReturnType<S[K]> }) => void,
    comparator?: Comparator<{ [K in KS]: ReturnType<S[K]> }>
  ) => Subscription;

  subscribeAll: (
    observer: (result: { [K in keyof S]: ReturnType<S[K]> }) => void,
    comparator?: Comparator<{ [K in keyof S]: ReturnType<S[K]> }>
  ) => Subscription;
};

export interface Connectivity<S extends BS>
  extends Reactive<S>,
    Subscribable<S> {}

export interface RxStore<S extends BS> {
  dispatch: <KS extends keyof S>(
    updated: {
      [K in KS]: ReturnType<S[K]>;
    },
    compare?: boolean
  ) => this;
  reset: <K extends keyof S>(key: K) => this;
  resetAll: <KS extends keyof S>(keys?: KS[]) => this;
  getState: <K extends keyof S>(key: K) => ReturnType<S[K]>;
  getStates: <KS extends keyof S>(
    keys: KS[]
  ) => { [K in KS]: ReturnType<S[K]> };
  getStateAll: () => { [K in keyof S]: ReturnType<S[K]> };
  getDataSource: () => Observable<{ [K in keyof S]: ReturnType<S[K]> }>;
}

export interface RxNStore<S extends BS> extends RxStore<S> {
  getClonedState: <K extends keyof S>(key: K) => ReturnType<S[K]>;
}

export type NRSConfig<S extends BS> = {
  cloneFunction: CloneFunction<any>;
  cloneFunctionMap: CloneFunctionMap<S>;
  comparator: Comparator<any>;
  comparatorMap: ComparatorMap<S>;
};

export interface RxImStore<IS extends IBS> extends RxStore<IS> {}

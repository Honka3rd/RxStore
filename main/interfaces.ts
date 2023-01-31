import { Observable } from "rxjs";
import { Collection, Record, Seq, ValueObject } from "immutable";

export type BS = {
  [k: string]: () => any;
};

export type ImmutableBase =
  | Collection<any, any>
  | Collection.Indexed<any>
  | Collection.Keyed<any, any>
  | Collection.Set<any>
  | Record.Factory<any>
  | Seq<any, any>
  | Seq.Indexed<any>
  | Seq.Keyed<any, any>
  | Seq.Set<any>
  | ValueObject
  | number
  | string
  | null
  | bigint
  | boolean;

export interface IBS extends BS {
  [k: string]: () => ImmutableBase;
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

type Unobserve = () => void;

export type Subscribable<S extends BS> = {
  observe: <K extends keyof S>(
    key: K,
    observer: (result: ReturnType<S[K]>) => void,
    comparator?: Comparator<ReturnType<S[K]>>
  ) => Unobserve;

  observeMultiple: <KS extends keyof S>(
    keys: KS[],
    observer: (result: { [K in KS]: ReturnType<S[K]> }) => void,
    comparator?: Comparator<{ [K in KS]: ReturnType<S[K]> }>
  ) => Unobserve;

  observeAll: (
    observer: (result: { [K in keyof S]: ReturnType<S[K]> }) => void,
    comparator?: Comparator<{ [K in keyof S]: ReturnType<S[K]> }>
  ) => Unobserve;
};

export interface Connectivity<S extends BS>
  extends Reactive<S>,
    Subscribable<S> {}

export type Reducer<S extends BS, K extends keyof S, T> = (
  state: ReturnType<S[K]>,
  action: { type: T; payload: ReturnType<S[K]> }
) => ReturnType<S[K]>;

export interface Dispatcher<S extends BS, K extends keyof S, T> {
  dispatch: (action: { type: T; payload: ReturnType<S[K]> }) => void;
}

export interface RxStore<S extends BS> {
  setState: <KS extends keyof S>(
    updated:
      | {
          [K in KS]: ReturnType<S[K]>;
        }
      | (<KS extends keyof S>(prevAll: {
          [K in KS]: ReturnType<S[K]>;
        }) => Partial<{
          [K in keyof S]: ReturnType<S[K]>;
        }>)
  ) => this;
  reset: <K extends keyof S>(key: K) => this;
  resetAll: <KS extends keyof S>(keys?: KS[]) => this;
  getState: <K extends keyof S>(key: K) => ReturnType<S[K]>;
  getStates: <KS extends keyof S>(
    keys: KS[]
  ) => { [K in KS]: ReturnType<S[K]> };
  getStateAll: () => { [K in keyof S]: ReturnType<S[K]> };
  getDataSource: () => Observable<{ [K in keyof S]: ReturnType<S[K]> }>;
  createDispatcher: <K extends keyof S, T>(params: {
    reducer: Reducer<S, K, T>;
    key: K;
  }) => Dispatcher<S, K, T>;
}

export interface RxNStore<S extends BS> extends RxStore<S> {
  getClonedState: <K extends keyof S>(key: K) => ReturnType<S[K]>;
  getImmutableState: <K extends keyof S>(
    key: K
  ) =>
    | {
        success: true;
        immutable: Collection<
          keyof ReturnType<S[K]>,
          ReturnType<S[K]>[keyof ReturnType<S[K]>]
        >;
      }
    | {
        success: false;
        immutable: ReturnType<S[K]>;
      };
}

export type NRSConfig<S extends BS> = {
  cloneFunction: CloneFunction<any>;
  cloneFunctionMap: CloneFunctionMap<S>;
  comparator: Comparator<any>;
  comparatorMap: ComparatorMap<S>;
};

export interface RxImStore<IS extends IBS> extends RxStore<IS> {}

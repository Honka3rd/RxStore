import { Collection, fromJS, is, isImmutable, Map } from "immutable";
import { ConnectivityImpl } from "./main/connectivity";
import {
  BS,
  CloneFunction,
  CloneFunctionMap,
  Comparator,
  ComparatorMap,
  Connectivity,
  NRSConfig,
  RxNStore,
  RxImStore,
  Subscribable,
  IBS,
  ImmutableBase,
  ReactiveConfig,
} from "./main/interfaces";
import { RxStoreImpl } from "./main/rs";
import { isPremitive } from "./main/util/isPremitive";
import { shallowClone } from "./main/util/shallowClone";

class RxNStoreImpl<S extends BS>
  extends RxStoreImpl<S>
  implements Subscribable<S>, RxNStore<S>
{
  constructor(
    connector: Connectivity<S>,
    private cloneFunction?: CloneFunction<ReturnType<S[keyof S]>>,
    private cloneFunctionMap?: CloneFunctionMap<S>,
    comparator?: Comparator<any>,
    comparatorMap?: ComparatorMap<any>
  ) {
    super(connector, comparator, comparatorMap);
    this.getClonedState = this.getClonedState.bind(this);
    this.getImmutableState = this.getImmutableState.bind(this);
    this.getStates = this.getStates.bind(this);
    this.getStateAll = this.getStateAll.bind(this);
    this.getDefault = this.getDefault.bind(this);
    this.getDefaultAll = this.getDefaultAll.bind(this);
  }

  getClonedState<K extends keyof S>(key: K) {
    const { cloneFunction, cloneFunctionMap } = this;
    const cloneFn = cloneFunctionMap?.[key];

    if (cloneFn) {
      return cloneFn(this.getState(key));
    }

    if (cloneFunction) {
      return cloneFunction(this.getState(key));
    }

    return shallowClone(this.getState(key));
  }

  getStateAll() {
    return this.connector.getAll();
  }

  getStates<KS extends keyof S>(keys: KS[]) {
    return this.connector.getMultiple(keys);
  }

  getImmutableState<K extends keyof S>(key: K) {
    const origin = this.getState(key);
    if (isPremitive(origin)) {
      return {
        success: true,
        immutable: origin,
      };
    }
    const immutified = fromJS(origin) as Collection<
      keyof ReturnType<S[K]>,
      ReturnType<S[K]>[keyof ReturnType<S[K]>]
    >;
    if (isImmutable(immutified)) {
      return {
        success: true,
        immutable: immutified,
      } as const;
    }
    return {
      success: false,
      immutable: origin,
    };
  }

  getDefaults<KS extends (keyof S)[]>(keys: KS) {
    return this.connector.getDefaults(keys);
  }

  getDefaultAll() {
    return this.connector.getDefaultAll();
  }
}

export function NRS<S extends BS>(
  initiator: S,
  {
    cloneFunction,
    cloneFunctionMap,
    comparator,
    comparatorMap,
    config,
  }: Partial<NRSConfig<S>> = {}
) {
  return new RxNStoreImpl(
    new ConnectivityImpl(initiator, config),
    cloneFunction,
    cloneFunctionMap,
    comparator,
    comparatorMap
  );
}

class RxImStoreImpl<S extends IBS>
  extends RxStoreImpl<S>
  implements Subscribable<S>, RxImStore<S>
{
  constructor(connector: Connectivity<S>, config?: ReactiveConfig) {
    super(
      connector,
      <IData extends ImmutableBase>(prev: IData, next: IData) => {
        if (isImmutable(prev) && isImmutable(next)) {
          return is(prev, next);
        }
        return prev === next;
      }
    );
    const invalid = Object.values(connector.getDefaultAll()).find(
      (val) => val === undefined || (!isImmutable(val) && !isPremitive(val))
    );
    if (invalid) {
      throw Error(`${String(invalid)} is not an immutable Object`);
    }
    this.getStateAll = this.getStateAll.bind(this);
    this.getStates = this.getStates.bind(this);
    this.getDefaults = this.getDefaults.bind(this);
    this.getDefaultAll = this.getDefaultAll.bind(this);
  }

  getStateAll() {
    return Map(this.connector.getAll()) as Map<keyof S, ReturnType<S[keyof S]>>;
  }

  getStates<KS extends keyof S>(keys: KS[]) {
    return Map(this.connector.getMultiple(keys)) as Map<KS, ReturnType<S[KS]>>;
  }

  getDefaults<KS extends (keyof S)[]>(keys: KS) {
    return Map(this.connector.getDefaults(keys)) as Map<
      keyof S,
      ReturnType<S[keyof S]>
    >;
  }

  getDefaultAll() {
    return Map(this.connector.getDefaultAll()) as Map<
      keyof S,
      ReturnType<S[keyof S]>
    >;
  }
}

export function IRS<S extends IBS>(initiator: S, config?: ReactiveConfig) {
  return new RxImStoreImpl(new ConnectivityImpl(initiator, config));
}

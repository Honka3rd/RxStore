import { Collection, fromJS, is, isImmutable, Map } from "immutable";
import {
  Any,
  BS,
  CloneFunction,
  CloneFunctionMap,
  Comparator,
  ComparatorMap,
  Connectivity,
  IBS,
  ImmutableBase,
  NRSConfig,
  ReactiveConfig,
  RxImStore,
  RxNStore,
  RxStore,
  Subscribable,
} from "rx-store-types";
import { ConnectivityImpl } from "./main/connectivity";
import { bound } from "./main/decorators/bound";
import { RxStoreImpl } from "./main/rs";
import { isObject } from "./main/util/isObject";
import { isPrimitive } from "./main/util/isPrimitive";
import { shallowClone } from "./main/util/shallowClone";
import { shallowCompare } from "./main/util/shallowCompare";

class RxNStoreImpl<S extends BS>
  extends RxStoreImpl<S>
  implements Subscribable<S>, RxNStore<S>
{
  constructor(
    connector: Connectivity<S>,
    public cloneFunction?: CloneFunction<ReturnType<S[keyof S]>>,
    private cloneFunctionMap?: CloneFunctionMap<S>,
    comparator?: Comparator<ReturnType<S[keyof S]>>,
    comparatorMap?: ComparatorMap<S>
  ) {
    super(connector, comparator, comparatorMap);
    if (!cloneFunction) {
      this.cloneFunction = shallowClone;
    }
  }

  @bound
  getClonedState<K extends keyof S>(key: K) {
    const { cloneFunction, cloneFunctionMap } = this;
    const cloneFn = cloneFunctionMap?.[key];

    if (cloneFn) {
      return cloneFn(this.getState(key));
    }

    return cloneFunction!(this.getState(key));
  }

  @bound
  getStateAll() {
    return this.connector.getAll();
  }

  @bound
  getStates<KS extends keyof S>(keys: KS[]) {
    return this.connector.getMultiple(keys);
  }

  @bound
  getImmutableState<K extends keyof S>(key: K) {
    const origin = this.getState(key);
    if (isPrimitive(origin)) {
      return {
        success: false,
        immutable: origin,
      } as const;
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
    } as const;
  }

  @bound
  getDefaults<KS extends (keyof S)[]>(keys: KS) {
    return this.connector.getDefaults(keys);
  }

  @bound
  getDefaultAll() {
    return this.connector.getDefaultAll();
  }

  @bound
  getCloneFunctionMap() {
    return { ...this.cloneFunctionMap } as ComparatorMap<S>;
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

  const nStore = new RxNStoreImpl(
    new ConnectivityImpl(initiator, config),
    cloneFunction,
    cloneFunctionMap,
    comparator,
    comparatorMap
  );
  Object.keys(initiator).forEach((key) => initiator[key](nStore as unknown as RxStore<Any> & Subscribable<Any>))
  return nStore;
}

class RxImStoreImpl<S extends IBS>
  extends RxStoreImpl<S>
  implements Subscribable<S>, RxImStore<S>
{
  constructor(connector: Connectivity<S>) {
    super(
      connector,
      <IData extends ImmutableBase>(prev: IData, next: IData) => {
        if (isImmutable(prev) && isImmutable(next)) {
          return is(prev, next);
        }
        return prev === next;
      }
    );
  }

  @bound
  getStateAll() {
    return Map(this.connector.getAll()) as Map<keyof S, ReturnType<S[keyof S]>>;
  }

  @bound
  getStates<KS extends keyof S>(keys: KS[]) {
    return Map(this.connector.getMultiple(keys)) as Map<KS, ReturnType<S[KS]>>;
  }

  @bound
  getDefaults<KS extends (keyof S)[]>(keys: KS) {
    return Map(this.connector.getDefaults(keys)) as Map<
      keyof S,
      ReturnType<S[keyof S]>
    >;
  }

  @bound
  getDefaultAll() {
    return Map(this.connector.getDefaultAll()) as Map<
      keyof S,
      ReturnType<S[keyof S]>
    >;
  }
}

export function IRS<S extends IBS>(initiator: S, config?: ReactiveConfig) {
  const iStore = new RxImStoreImpl(new ConnectivityImpl(initiator, config));
  Object.keys(initiator).forEach((key) => initiator[key](iStore as unknown as RxStore<Any> & Subscribable<Any>))
  return iStore;
}

export { shallowClone, shallowCompare, bound, isPrimitive, isObject };


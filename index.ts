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
} from "rx-store-types";
import { RxStoreImpl } from "./main/rs";
import { isPrimitive } from "./main/util/isPrimitive";
import { shallowClone } from "./main/util/shallowClone";
import { shallowCompare } from "./main/util/shallowCompare";
import { bound } from "./main/decorators/bound";
import { isObject } from "./main/util/isObject";

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
  return new RxImStoreImpl(new ConnectivityImpl(initiator, config));
}

export { shallowClone, shallowCompare, bound, isPrimitive, isObject };

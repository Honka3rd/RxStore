import { is } from "immutable";
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
} from "./main/interfaces";
import { RxStoreImpl } from "./main/rs";

const shallowClone = <T>(input: T) => {
  if (!input) {
    return input;
  }

  if (typeof input !== "object") {
    return input;
  }

  if (input instanceof Date) {
    return new Date(input) as T;
  }

  if (input instanceof RegExp) {
    return new RegExp(input) as T;
  }

  if (input instanceof Set) {
    return new Set(input) as T;
  }

  if (input instanceof Map) {
    return new Map(input) as T;
  }

  const ownKeys = Object.getOwnPropertyNames(input) as Array<keyof T>;
  const copied = Object.create(
    Object.getPrototypeOf(input),
    Object.getOwnPropertyDescriptors(input)
  );
  ownKeys.forEach((k: keyof T) => {
    copied[k] = input[k];
  });
  return copied as T;
};

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

    return shallowClone(super.getState(key));
  }
}

export function NRS<S extends BS>(
  initiator: S,
  { cloneFunction, cloneFunctionMap, comparator, comparatorMap }: NRSConfig<S>
) {
  return new RxNStoreImpl(
    new ConnectivityImpl(initiator),
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
  constructor(connector: Connectivity<S>) {
    super(connector, <IData extends ImmutableBase>(prev: IData, next: IData) =>
      is(prev, next)
    );
  }
}

export function IRS<S extends IBS>(initiator: S) {
  return new RxImStoreImpl(new ConnectivityImpl(initiator));
}

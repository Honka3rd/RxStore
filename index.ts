import {
  Any,
  BS,
  IBS,
  NRSConfig,
  ReactiveConfig,
  RxStore,
  Subscribable
} from "rx-store-types";
import { ConnectivityImpl } from "./main/connectivity";
import { bound } from "./main/decorators/bound";
import { RxImStoreImpl } from "./main/immutable";
import { RxNStoreImpl } from "./main/normal";
import { isObject } from "./main/util/isObject";
import { isPrimitive } from "./main/util/isPrimitive";
import { shallowClone } from "./main/util/shallowClone";
import { shallowCompare } from "./main/util/shallowCompare";

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

export function IRS<S extends IBS>(initiator: S, config?: ReactiveConfig) {
  const iStore = new RxImStoreImpl(new ConnectivityImpl(initiator, config));
  Object.keys(initiator).forEach((key) => initiator[key](iStore as unknown as RxStore<Any> & Subscribable<Any>))
  return iStore;
}

export { bound, isObject, isPrimitive, shallowClone, shallowCompare };


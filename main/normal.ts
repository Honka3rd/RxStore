import { Collection, fromJS, isImmutable } from "immutable";
import {
    BS,
    CloneFunction,
    CloneFunctionMap,
    Comparator,
    ComparatorMap,
    Connectivity,
    ConstraintKeys,
    RxNStore,
    Subscribable
} from "rx-store-types";
import { bound } from "./decorators/bound";
import { RxStoreImpl } from "./store";
import { isPrimitive } from "./util/isPrimitive";
import { shallowClone } from "./util/shallowClone";

export class RxNStoreImpl<S extends BS>
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
  getStates<KS extends keyof S>(keys: ConstraintKeys<KS>) {
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
  getDefaults<KS extends keyof S>(keys: ConstraintKeys<KS>) {
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

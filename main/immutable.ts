import { isImmutable, is, Record } from "immutable";
import {
  IBS,
  RxImStore,
  Connectivity,
  Subscribable,
  ConstraintKeys,
} from "rx-store-types";
import { bound } from "./decorators/bound";
import { RxStoreImpl } from "./store";

export class RxImStoreImpl<S extends IBS>
  extends RxStoreImpl<S>
  implements Subscribable<S>, RxImStore<S>
{
  private factoryAll: Record.Factory<{ [K in keyof S]: ReturnType<S[K]> }>;
  constructor(connector: Connectivity<S>) {
    super(connector, (prev: any, next: any) => {
      if (isImmutable(prev) && isImmutable(next)) {
        return is(prev, next);
      }
      return prev === next;
    });
    this.factoryAll = Record(this.connector.getDefaultAll());
  }

  @bound
  getStateAll() {
    return this.factoryAll(this.connector.getAll());
  }

  @bound
  getStates<KS extends keyof S>(keys: ConstraintKeys<KS>) {
    const factory = Record(this.connector.getMultiple(keys));
    return factory();
  }

  @bound
  getDefaults<KS extends keyof S>(keys: ConstraintKeys<KS>) {
    const factory = Record(this.connector.getDefaults(keys));
    return factory();
  }

  @bound
  getDefaultAll() {
    return this.factoryAll();
  }
}

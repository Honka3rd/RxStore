import { distinctUntilChanged, map } from "rxjs";
import { BS, Comparator, Connectivity, ConstraintKeys, ReactiveConfig } from "rx-store-types";
import { ReactiveImpl } from "./reactive";

export class ConnectivityImpl<S extends BS>
  extends ReactiveImpl<S>
  implements Connectivity<S>
{
  constructor(
    initiator: S,
    config: ReactiveConfig = { schedule: "sync", fireOnCreate: false }
  ) {
    super(initiator, config);
  }

  observe<K extends keyof S>(
    key: K,
    observer: (result: ReturnType<S[K]>) => void,
    comparator?: Comparator<ReturnType<S[K]>>
  ) {
    const subscription = this.source()
      .pipe(
        map((val) => val[key]),
        distinctUntilChanged(comparator)
      )
      .subscribe(observer);
    return () => subscription.unsubscribe();
  }

  observeMultiple<KS extends keyof S>(
    keys: ConstraintKeys<KS>,
    observer: (result: { [K in KS]: ReturnType<S[K]> }) => void,
    comparator?: Comparator<{ [K in KS]: ReturnType<S[K]> }>
  ) {
    const subscription = this.source()
      .pipe(
        map((val) => {
          const converted = keys as KS[]
          return converted.reduce((acc, next) => {
            acc[next] = val[next];
            return acc;
          }, {} as { [K in KS]: ReturnType<S[K]> });
        }),
        distinctUntilChanged(comparator)
      )
      .subscribe(observer);
    return () => subscription.unsubscribe();
  }

  observeAll(
    observer: (result: { [K in keyof S]: ReturnType<S[K]> }) => void,
    comparator?: Comparator<{ [K in keyof S]: ReturnType<S[K]> }>
  ) {
    const subscription = this.source()
      .pipe(
        map((val) => ({ ...val })),
        distinctUntilChanged(comparator)
      )
      .subscribe(observer);
    return () => subscription.unsubscribe();
  }
}

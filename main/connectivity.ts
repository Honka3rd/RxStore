import { distinctUntilChanged, map } from "rxjs";
import { BS, Comparator, Connectivity } from "./interfaces";
import { ReactiveImpl } from "./reactive";

export class ConnectivityImpl<S extends BS>
  extends ReactiveImpl<S>
  implements Connectivity<S>
{
  constructor(initiator: S) {
    super(initiator);
  }

  subscribeTo<K extends keyof S>(
    key: K,
    observer: (result: ReturnType<S[K]>) => void,
    comparator?: Comparator<ReturnType<S[K]>>
  ) {
    return this.source()
      .pipe(
        map((val) => val[key]),
        distinctUntilChanged(comparator)
      )
      .subscribe(observer);
  }

  subscribeMultiple<KS extends keyof S>(
    keys: KS[],
    observer: (result: { [K in KS]: ReturnType<S[K]> }) => void,
    comparator?: Comparator<{ [K in KS]: ReturnType<S[K]> }>
  ) {
    return this.source()
      .pipe(
        map((val) => {
          return keys.reduce((acc, next) => {
            acc[next] = val[next];
            return acc;
          }, {} as { [K in KS]: ReturnType<S[K]> });
        }),
        distinctUntilChanged(comparator)
      )
      .subscribe(observer);
  }

  subscribeAll(
    observer: (result: { [K in keyof S]: ReturnType<S[K]> }) => void,
    comparator?: Comparator<{ [K in keyof S]: ReturnType<S[K]> }>
  ) {
    return this.source()
      .pipe(
        map((val) => ({ ...val })),
        distinctUntilChanged(comparator)
      )
      .subscribe(observer);
  }
}

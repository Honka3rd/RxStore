import { Subject, debounceTime, Observer, Subscription } from "rxjs";
import { AbstractSubjectWithValue } from "./AbstractSubjectWithValue";
export class AsyncSubjectWithValue<T> extends AbstractSubjectWithValue<
  T,
  Subject<T>
> {
  constructor(public value: T) {
    super(value, new Subject<T>());
  }

  subscribe(observer: Observer<T>): Subscription {
    return this.source.pipe(debounceTime(0)).subscribe(observer);
  }

  asObservable() {
    return this.source.asObservable().pipe(debounceTime(0));
  }
}

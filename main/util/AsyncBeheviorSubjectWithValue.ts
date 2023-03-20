import { BehaviorSubject, debounceTime, Observer } from "rxjs";
import { AbstractSubjectWithValue } from "./AbstractSubjectWithValue";
export class AsyncBeheviorSubjectWithValue<T> extends AbstractSubjectWithValue<
  T,
  BehaviorSubject<T>
> {
  constructor(public value: T) {
    super(value, new BehaviorSubject<T>(value));
  }

  subscribe(observer: Observer<T>) {
    return this.source.pipe(debounceTime(0)).subscribe(observer);
  }

  asObservable() {
    return this.source.asObservable().pipe(debounceTime(0));
  }
}

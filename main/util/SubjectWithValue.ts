import { Observer, Subject, Subscription } from "rxjs";
import { AbstractSubjectWithValue } from "./AbstractSubjectWithValue";

export class SubjectWithValue<T> extends AbstractSubjectWithValue<
  T,
  Subject<T>
> {
  constructor(public value: T) {
    super(value, new Subject<T>());
  }

  subscribe(observer: Observer<T>): Subscription {
    return this.source.subscribe(observer);
  }

  asObservable() {
    return this.source.asObservable();
  }
}

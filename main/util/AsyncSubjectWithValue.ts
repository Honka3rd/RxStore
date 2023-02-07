import { AsyncSubject, startWith } from "rxjs";
import { AbstractSubjectWithValue } from "./AbstractSubjectWithValue";
export class AsyncSubjectWithValue<T> extends AbstractSubjectWithValue<
  T,
  AsyncSubject<T>
> {
  constructor(public value: T) {
    super(value, new AsyncSubject<T>());
  }

  asObservable() {
    return this.source.asObservable();
  }
}

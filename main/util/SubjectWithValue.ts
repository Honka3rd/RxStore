import { Subject } from "rxjs";
import { AbstractSubjectWithValue } from "./AbstractSubjectWithValue";

export class SubjectWithValue<T> extends AbstractSubjectWithValue<
  T,
  Subject<T>
> {
  constructor(public value: T) {
    super(value, new Subject<T>());
  }

  asObservable() {
    return this.source.asObservable();
  }
}

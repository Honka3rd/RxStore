import { Observable, Observer, Subject } from "rxjs";

export abstract class AbstractSubjectWithValue<T, S extends Subject<T>> {
  protected source: S;

  constructor(public value: T, subject: S) {
    this.source = subject;
  }

  next(val: T) {
    this.value = val;
    this.source.next(this.value);
  }

  subscribe(observer: Observer<T>) {
    return this.source.subscribe(observer);
  }

  abstract asObservable(): Observable<T>;
}

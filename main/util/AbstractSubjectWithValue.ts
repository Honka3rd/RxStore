import { Observable, Observer, Subject, Subscription } from "rxjs";

export abstract class AbstractSubjectWithValue<T, S extends Subject<T>> {
  protected source: S;

  constructor(public value: T, subject: S) {
    this.source = subject;
  }

  next(val: T) {
    this.value = val;
    this.source.next(this.value);
  }

  abstract subscribe(observer: Observer<T>): Subscription;

  abstract asObservable(): Observable<T>;
}

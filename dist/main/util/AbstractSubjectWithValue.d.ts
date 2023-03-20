import { Observable, Observer, Subject, Subscription } from "rxjs";
export declare abstract class AbstractSubjectWithValue<T, S extends Subject<T>> {
    value: T;
    protected source: S;
    constructor(value: T, subject: S);
    next(val: T): void;
    abstract subscribe(observer: Observer<T>): Subscription;
    abstract asObservable(): Observable<T>;
}

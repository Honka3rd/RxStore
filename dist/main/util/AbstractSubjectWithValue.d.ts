import { Observable, Observer, Subject } from "rxjs";
export declare abstract class AbstractSubjectWithValue<T, S extends Subject<T>> {
    value: T;
    protected source: S;
    constructor(value: T, subject: S);
    next(val: T): void;
    subscribe(observer: Observer<T>): import("rxjs").Subscription;
    abstract asObservable(): Observable<T>;
}

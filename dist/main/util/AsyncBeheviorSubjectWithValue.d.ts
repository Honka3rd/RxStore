import { BehaviorSubject, Observer } from "rxjs";
import { AbstractSubjectWithValue } from "./AbstractSubjectWithValue";
export declare class AsyncBeheviorSubjectWithValue<T> extends AbstractSubjectWithValue<T, BehaviorSubject<T>> {
    value: T;
    constructor(value: T);
    subscribe(observer: Observer<T>): import("rxjs").Subscription;
    asObservable(): import("rxjs").Observable<T>;
}

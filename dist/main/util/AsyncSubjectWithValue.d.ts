import { Subject, Observer, Subscription } from "rxjs";
import { AbstractSubjectWithValue } from "./AbstractSubjectWithValue";
export declare class AsyncSubjectWithValue<T> extends AbstractSubjectWithValue<T, Subject<T>> {
    value: T;
    constructor(value: T);
    subscribe(observer: Observer<T>): Subscription;
    asObservable(): import("rxjs").Observable<T>;
}

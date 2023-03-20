import { Observer, Subject, Subscription } from "rxjs";
import { AbstractSubjectWithValue } from "./AbstractSubjectWithValue";
export declare class SubjectWithValue<T> extends AbstractSubjectWithValue<T, Subject<T>> {
    value: T;
    constructor(value: T);
    subscribe(observer: Observer<T>): Subscription;
    asObservable(): import("rxjs").Observable<T>;
}

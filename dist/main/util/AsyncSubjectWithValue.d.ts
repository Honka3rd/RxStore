import { AsyncSubject } from "rxjs";
import { AbstractSubjectWithValue } from "./AbstractSubjectWithValue";
export declare class AsyncSubjectWithValue<T> extends AbstractSubjectWithValue<T, AsyncSubject<T>> {
    value: T;
    constructor(value: T);
    asObservable(): import("rxjs").Observable<T>;
}

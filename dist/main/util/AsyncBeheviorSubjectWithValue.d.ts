import { AsyncSubject } from "rxjs";
import { AbstractSubjectWithValue } from "./AbstractSubjectWithValue";
export declare class AsyncBeheviorSubjectWithValue<T> extends AbstractSubjectWithValue<T, AsyncSubject<T>> {
    value: T;
    constructor(value: T);
    asObservable(): import("rxjs").Observable<T>;
}

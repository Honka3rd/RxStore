import { Subject } from "rxjs";
import { AbstractSubjectWithValue } from "./AbstractSubjectWithValue";
export declare class SubjectWithValue<T> extends AbstractSubjectWithValue<T, Subject<T>> {
    value: T;
    constructor(value: T);
    asObservable(): import("rxjs").Observable<T>;
}

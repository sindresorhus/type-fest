/**
Extracts the type of the last element of an array.

Use case: Defining the return type of functions that extract the last element of an array, for example [lodash.last](https://lodash.com/docs/4.17.15#last).

@example
declare function lastOf<V extends any[], L extends TakeLast<V>>(array: V): L;
const array = ['foo', 2];
typeof lastOf(array); // -> number;
*/
export type TakeLast<V> =
    V extends []
        ? never
        : V extends [string]
            ? V[0]
            : V extends [string, ...infer R]
                ? TakeLast<R>
                : never;

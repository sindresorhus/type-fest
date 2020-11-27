/**
Extracts the type of the last element of an array.

Use case: Defining the return type of functions that extract the last element of an array, for example [lodash.last](https://lodash.com/docs/4.17.15#last).

@example
```
import {LastArrayElement} from 'type-fest';

declare function lastOf<V extends any[]>(array: V): LastArrayElement<V>;
const array = ['foo', 2];
typeof lastOf(array); // -> number;
```
*/
export type LastArrayElement<V extends unknown[]> =
	V extends []
		? never
		: V extends [string]
			? V[0]
			: V extends [string, ...infer R]
				? LastArrayElement<R>
				: never;

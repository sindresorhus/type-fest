/**
Create a type that represents an array of provided types and of a provided fixed length. The arrays length and Array prototype mutations that manipulate its length are excluded in the resulting type.

@example
```
import {FixedLengthArray} from 'type-fest';

type FencingTeam = FixedLengthArray<string, 3>;

const guestFencingTeam: FencingTeam = ['Josh', 'Michael', 'Robert'];
const homeFencingTeam: FencingTeam = ['George', 'John'];
//=> error TS2322: Type string[] is not assignable to type 'FencingTeam'
guestFencingTeam.push('Sam');
//=> error TS2339: Property 'push' does not exist on type 'FencingTeam'
```
*/
export type FixedLengthArray<T, Length extends number, ArrayPrototype = [T, ...T[]]> = Pick<
	ArrayPrototype,
	Exclude<keyof ArrayPrototype, ArrayLengthMutationKeys>
> & {
	[I: number]: T;
	[Symbol.iterator]: () => IterableIterator<T>;
	readonly length: Length;
};

/**
Provides the Array object methods to exclude from a Fixed Length Array. Internal helper for Fixed Length Array.
*/
type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift';

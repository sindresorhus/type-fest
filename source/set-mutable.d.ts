import {Except} from './except';
import {Mutable} from './mutable';
import {Simplify} from './simplify';

/**
Create a type that converts the given keys from `readonly` to mutable. The remaining keys are kept as is.

Use-case: You want to define a single model where the only thing that changes is whether or not some of the keys are mutable.

@see [`Mutable`](source/mutable.d.ts) - a type that sets all (not selectively) keys as mutable.

@example
```
import {SetMutable} from 'type-fest';

type Foo = {
	readonly a: number;
	b: readonly string[];
	readonly c: boolean;
}

type SomeMutable = SetMutable<Foo, 'b' | 'c'>;
// type SomeMutable = {
// 	readonly a: number;
// 	b: readonly string[]; // Was already mutable and still is, type of the property remains unaffected.
// 	c: boolean; // Is now mutable.
// }
```
*/
export type SetMutable<BaseType, Keys extends keyof BaseType> =
	Simplify<
		// Pick just the keys that are not mutable from the base type.
		Except<BaseType, Keys> &
		// Pick the keys that should be mutable from the base type and make them mutable.
		Mutable<Pick<BaseType, Keys>>
	>;

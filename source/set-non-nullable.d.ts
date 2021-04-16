import {Except} from './except';
import {Simplify} from './simplify';

/**
Create a type removes nullish (optional, undefined and null) types from the given keys. The remaining keys are kept as is.

Use-case: You want to define a single model where the only thing that changes is whether or not some of the keys are required.

@example
```
import {SetNonNullable} from 'type-fest';

type Foo = {
	a?: number;
	b: string;
	c?: boolean;
	d: number | null;
	e: string | undefined;
}

type SomeNonNullable = SetNonNullable<Foo, 'b' | 'c' | 'd' | 'e'>;
// type SomeNonNullable = {
// 	a?: number;
// 	b: string; // Was already not nullish and still is.
// 	c: boolean; // Is now not optional.
//  d: number; // Is now not null
//	e: string; // Is now not undefined
// }
```
*/
export type SetNonNullable<BaseType, Keys extends keyof BaseType> = Simplify<
	// Pick just the keys that are optional from the base type.
	Except<BaseType, Keys> &
		// For each 'Key' provided, make it not optional or nullable
		{ [Key in Keys]-?: NonNullable<BaseType[Key]> }
>;

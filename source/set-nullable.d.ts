import type {KeysOfUnion} from './keys-of-union.d.ts';

/**
Create a type that makes the given keys nullable, while keeping the remaining keys as is.

If no keys are given, all keys will be made nullable.

This adds `null` to the value type. Use `SetOptional` to make keys optional instead.

Note: A numeric key does not reach the rest element of a tuple or any element after it, such as `string[]` and `boolean` in `[number, ...string[], boolean]`. Use `number` to make every element nullable.

Use-case: You want to define a single model where the only thing that changes is whether or not some or all of the keys are nullable.

@example
```
import type {SetNullable} from 'type-fest';

type Foo = {
	a: number;
	b: string;
	c?: boolean;
};

type SomeNullable = SetNullable<Foo, 'a' | 'c'>; // Optionality is preserved for `c`
//=> {a: number | null; b: string; c?: boolean | null}

type AllNullable = SetNullable<Foo>;
//=> {a: number | null; b: string | null; c?: boolean | null}
```

@see {@link SetNonNullable}

@category Object
*/
// A homomorphic mapped type over a type parameter is applied to each member of a union on its own, so a key that only some members have reaches those members.
export type SetNullable<BaseType, Keys extends KeysOfUnion<BaseType> = KeysOfUnion<BaseType>> = {
	// A tuple is keyed by a number, but a homomorphic mapped type hands its elements over under their string form, so `Key extends Keys` would compare `"0"` against `0` and never match. Both forms of a key are therefore accepted.
	[Key in keyof BaseType]: Key extends Keys
		? BaseType[Key] | null
		: Key extends string | number
			? `${Key}` extends `${Keys & (string | number)}`
				? BaseType[Key] | null
				: BaseType[Key]
			: BaseType[Key];
};

export {};

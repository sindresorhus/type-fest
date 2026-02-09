import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {TupleToObject} from './tuple-to-object.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {UnionToEnum} from './union-to-enum.d.ts';
import type {IsLiteral} from './is-literal.d.ts';
import type {Simplify} from './simplify.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {Sum} from './sum.d.ts';

/**
{@link TupleToEnum} and {@link UnionToEnum} Options.
*/
export type ToEnumOptions = {
	/**
	The first numeric value to assign when using numeric indices.

	@default 1

	@example
	```
	type E1 = TupleToEnum<['Play', 'Pause', 'Stop'], {numeric: true}>;
	//=> { Play: 1; Pause: 2; Stop: 3 }

	type E2 = TupleToEnum<['Play', 'Pause', 'Stop'], {numeric: true; startIndex: 3}>;
	//=> { Play: 3; Pause: 4; Stop: 5 }

	type E3 = TupleToEnum<['Play', 'Pause', 'Stop'], {numeric: true; startIndex: -1}>;
	//=> { Play: -1; Pause: 0; Stop: 1 }

	type E4 = UnionToEnum<'X' | 'Y' | 'Z', {numeric: true; startIndex: 10}>;
	//=> {X: 10; Y: 11; Z: 12}
	```
	*/
	startIndex?: number;
	/**
	Whether to use numeric indices as values.

	@default false

	@example
	```
	type E1 = UnionToEnum<'X' | 'Y' | 'Z'>;
	//=> { X: 'X'; Y: 'Y'; Z: 'Z' }

	type E2 = UnionToEnum<'X' | 'Y' | 'Z', {numeric: true}>;
	//=> { X: 1; Y: 2; Z: 3 }

	type E3 = TupleToEnum<['Play', 'Pause', 'Stop']}>;
	//=> { Play: 'Play'; Pause: 'Pause'; Stop: 'Stop' }

	type E4 = TupleToEnum<['Play', 'Pause', 'Stop'], {numeric: true; startIndex: 3}>;
	//=> { Play: 3; Pause: 4; Stop: 5 }
	```
	*/
	numeric?: boolean;
};

type DefaultToEnumOptions = {
	startIndex: 1;
	numeric: false;
};

/**
Converts a tuple of property keys (string, number, or symbol) into an **Enum**.

The keys are preserved, and their values are either:

- Their own literal values (by default)
- Or numeric indices (`1`, `2`, ...) if {@link ToEnumOptions.numeric `numeric`} is `true`.

By default, **numeric Enums** start from **Index `1`**. See {@link ToEnumOptions.startIndex `startIndex`} to change this behavior.

This is useful for creating strongly typed enums from a tuple of literals.

@example
```
import type {TupleToEnum} from 'type-fest';

type E1 = TupleToEnum<['A', 'B', 'C']>;
//=> { A: 'A'; B: 'B'; C: 'C' }

type E2 = TupleToEnum<['X', 'Y', 'Z'], {numeric: true}>;
//=> { X: 1; Y: 2; Z: 3 }

type E3 = TupleToEnum<['Play', 'Pause', 'Stop'], {numeric: true; startIndex: 3}>;
//=> { Play: 3; Pause: 4; Stop: 5 }

type E4 = TupleToEnum<[1, 2, 3]>;
//=> { 1: 1; 2: 2; 3: 3 }

type E5 = TupleToEnum<[1, 2, 3], {numeric: true; startIndex: -1}>;
//=> { 1: -1; 2: 0; 3: 1 }

type E6 = TupleToEnum<[]>;
//=> {}
```

@see {@link UnionToEnum}
@see {@link TupleToObject}
@category Object
*/
export type TupleToEnum<
	Keys extends readonly PropertyKey[],
	Options extends ToEnumOptions = {},
> = IsNever<Keys> extends true ? {}
	: _TupleToEnum<Keys, ApplyDefaultOptions<ToEnumOptions, DefaultToEnumOptions, Options>>;

/**
Core type for {@link TupleToEnum}.
*/
type _TupleToEnum<
	Keys extends UnknownArray,
	Options extends Required<ToEnumOptions>,
> = Simplify<{readonly [
	K in keyof Keys as K extends `${number}`
		? Keys[K] extends PropertyKey
			? IsLiteral<Keys[K]> extends true // TODO: update to accept template literals
				? Keys[K]
				: never // Not a literal
			: never // Not a property key
		: never // Not an index
	]: Options['numeric'] extends true
		? K extends `${infer N extends number}`
			? Sum<N, Options['startIndex']>
			: never // Not an index
		: Keys[K]
}>;

export {};

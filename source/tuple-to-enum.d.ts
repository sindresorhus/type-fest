import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {UnionToEnum} from './union-to-enum.d.ts';
import type {IsLiteral} from './is-literal.d.ts';
import type {Sum} from './sum.d.ts';

/**
{@link TupleToEnum `TupleToEnum`} options.
*/
export type TupleToEnumOptions = {
	/**
	Use the index of each element as its value, instead of the element itself.

	@default false

	@example
	```
	import type {TupleToEnum} from 'type-fest';

	type A = TupleToEnum<['play', 'pause']>;
	//=> {readonly play: 'play'; readonly pause: 'pause'}

	type B = TupleToEnum<['play', 'pause'], {numeric: true}>;
	//=> {readonly play: 0; readonly pause: 1}
	```
	*/
	numeric?: boolean;

	/**
	The value of the first element when `numeric` is `true`. Must be an integer.

	@default 0

	@example
	```
	import type {TupleToEnum} from 'type-fest';

	type A = TupleToEnum<['play', 'pause'], {numeric: true; startIndex: 1}>;
	//=> {readonly play: 1; readonly pause: 2}
	```
	*/
	startIndex?: number;
};

type DefaultTupleToEnumOptions = {
	numeric: false;
	startIndex: 0;
};

/**
Create an enum-like object type from a tuple of property keys, where each key maps to itself, or to its index with the `numeric` option.

Elements that are not literals, like `string` or `` `on${string}` ``, are ignored.

Use-case: Type an object built from a list of values at runtime, like `Object.fromEntries(values.map((value, index) => [value, index]))`.

Note: With `numeric`, a key that appears more than once gets a union of its indexes.

@example
```
import type {TupleToEnum} from 'type-fest';

const levels = ['debug', 'info', 'error'] as const;

type Level = TupleToEnum<typeof levels>;
//=> {readonly debug: 'debug'; readonly info: 'info'; readonly error: 'error'}

type LevelNumber = TupleToEnum<typeof levels, {numeric: true}>;
//=> {readonly debug: 0; readonly info: 1; readonly error: 2}
```

@see {@link UnionToEnum}
@category Object
*/
export type TupleToEnum<Tuple extends readonly PropertyKey[], Options extends TupleToEnumOptions = {}> = IfNotAnyOrNever<Tuple, {
	ifNot: Tuple extends unknown // For distributing `Tuple`
		? ApplyDefaultOptions<TupleToEnumOptions, DefaultTupleToEnumOptions, Options> extends infer ResolvedOptions extends Required<TupleToEnumOptions>
			? ResolvedOptions['numeric'] extends true
				? NumericTupleToEnum<Tuple, ResolvedOptions['startIndex']>
				: UnionToEnum<LiteralElements<Tuple>>
			: never // Should never happen
		: never; // Should never happen
	ifAny: {};
	ifNever: {};
}>;

// Filter per element, because a union like `string | 'foo'` collapses to `string`
type LiteralElements<Tuple extends readonly PropertyKey[]> = {
	[Index in keyof Tuple]: IsLiteral<Tuple[Index]> extends true ? Tuple[Index] : never;
}[number];

type NumericTupleToEnum<Tuple extends readonly PropertyKey[], StartIndex extends number> = {
	readonly [Index in keyof Tuple as Index extends `${number}`
		? IsLiteral<Tuple[Index]> extends true
			? Tuple[Index]
			: never // Not a literal, like `string` or `` `on${string}` ``
		: never // Not an index
	]: Index extends `${infer IndexNumber extends number}`
		? Sum<IndexNumber, StartIndex>
		: never; // Not an index
};

export {};

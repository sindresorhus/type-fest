import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {UnionToTuple} from './union-to-tuple.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {IsLiteral} from './is-literal.d.ts';
import type {Simplify} from './simplify.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {Sum} from './sum.d.ts';

/**
{@link UnionToEnum} Options.
*/
type UnionToEnumOptions = {
	/**
	The first numeric value to assign when using numeric indices.

	@default 1

	@example
	```
	type E2 = UnionToEnum<['Play', 'Pause', 'Stop'], {numeric: true}>;
	//=> { Play: 1; Pause: 2; Stop: 3 }

	type E2 = UnionToEnum<['Play', 'Pause', 'Stop'], {numeric: true; startIndex: 3}>;
	//=> { Play: 3; Pause: 4; Stop: 5 }

	type E3 = UnionToEnum<['Play', 'Pause', 'Stop'], {numeric: true; startIndex: -1}>;
	//=> { Play: -1; Pause: 0; Stop: 1 }
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

	type E3 = UnionToEnum<['Play', 'Pause', 'Stop'], {numeric: true; startIndex: 3}>;
	//=> { Play: 3; Pause: 4; Stop: 5 }
	```
	*/
	numeric?: boolean;
};

type DefaultUnionToEnumOptions = {
	startIndex: 1;
	numeric: false;
};

/**
Converts a union or tuple of property keys (string, number, or symbol) into an **Enum**.

The keys are preserved, and their values are either:

- Their own literal values (by default)
- Or numeric indices (`1`, `2`, ...) if {@link UnionToEnumOptions.numeric `numeric`} is `true`

By default, **numeric Enums** start from **Index `1`**. See {@link UnionToEnumOptions.startIndex `startIndex`} to change this behaviour.

This is useful for creating strongly typed enums from a union/tuple of literals.

@example
```
import type {UnionToEnum} from 'type-fest';

type E1 = UnionToEnum<'A' | 'B' | 'C'>;
//=> { A: 'A'; B: 'B'; C: 'C' }

type E2 = UnionToEnum<'X' | 'Y' | 'Z', {numeric: true}>;
//=> { X: 1; Y: 2; Z: 3 }

type E3 = UnionToEnum<['Play', 'Pause', 'Stop'], {numeric: true; startIndex: 3}>;
//=> { Play: 3; Pause: 4; Stop: 5 }

type E4 = UnionToEnum<['some_key', 'another_key']>;
//=> { 'some_key': 'some_key'; 'another_key': 'another_key' }

type E5 = UnionToEnum<never>;
//=> {}
```

@example
```
import type {UnionToEnum, CamelCasedProperties} from 'type-fest';

const verb = ['write', 'read', 'delete'] as const;
const resource = ['file', 'folder', 'link'] as const;

declare function createEnum<
	const T extends readonly string[],
	const U extends readonly string[],
>(x: T, y: U): CamelCasedProperties<UnionToEnum<`${T[number]}_${U[number]}`>>;

const Template = createEnum(verb, resource);
//=> {
//    writeFile: 'write_file',
//    writeFolder: 'write_folder',
//    writeLink: 'write_link',
//    readFile: 'read_file',
//    readFolder: 'read_folder',
//    readLink: 'read_link',
//    deleteFile: 'delete_file',
//    deleteFolder: 'delete_folder',
//    deleteLink: 'delete_link',
// }
```

@see UnionToTuple
@category Object
*/
export type UnionToEnum<
	Keys extends PropertyKey | readonly PropertyKey[],
	Options extends UnionToEnumOptions = {},
> = IsNever<Keys> extends true ? {}
	: _UnionToEnum<
		[Keys] extends [UnknownArray] ? Keys : UnionToTuple<Keys>,
		ApplyDefaultOptions<UnionToEnumOptions, DefaultUnionToEnumOptions, Options>
	>;

/**
Core type for {@link UnionToEnum}.
*/
type _UnionToEnum<
	Keys extends UnknownArray,
	Options extends Required<UnionToEnumOptions>,
> = Simplify<{readonly [
	K in keyof Keys as K extends `${number}`
		? Keys[K] extends PropertyKey
			? IsLiteral<Keys[K]> extends true
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

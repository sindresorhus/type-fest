import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {UnionToTuple} from './union-to-tuple.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {BuildTuple} from './internal/tuple.d.ts';
import type {CamelCase} from './camel-case.d.ts';
import type {Simplify} from './simplify.d.ts';
import type {IsNever} from './is-never.d.ts';

/**
{@link UnionToEnum} Options.
*/
type UnionToEnumOptions = {
	/**
	The starting index of Numeric enums.

	@default 1
	*/
	startIndex?: number;
	/**
	Wheter to use `CamelCase` for proprety names.

	@default false
	*/
	camelCase?: boolean;
};

type DefaultUnionToEnumOptions = {
	startIndex: 1;
	camelCase: false;
};

/**
Converts a union or tuple of property keys (`string`, `number`, or `symbol`) into an object resembling an enum.

The keys are preserved, and their values are either:

- Their own literal values (by default)
- Or numeric indices (`1`, `2`, ...) if `Numeric` is `true`

By default, **Propety** names are not **CamelCased** and **Numeric Enums** starts from **Index `1`**. See {@link UnionToEnumOptions} to change this behaviour.

This is useful for creating strongly typed enums from a union of literals.

@example-types
```
type E1 = UnionToEnum<'A' | 'B' | 'C'>;
//=> { A: 'A'; B: 'B'; C: 'C' }

type E2 = UnionToEnum<'X' | 'Y' | 'Z', true>;
//=> { X: 1; Y: 2; Z: 3 }

type E3 = UnionToEnum<['Play', 'Pause', 'Stop'], true, {startingIndex: 3}>;
//=> { Play: 3; Pause: 4; Stop: 5 }

type E4 = UnionToEnum<['some_key', 'another_key'], false, {camelCase: true}>;
//=> { someKey: 'some_key'; anotherKey: 'another_key' }

type E5 = UnionToEnum<never>;
//=> {}
```

@example-function
```
const verb = ['write', 'read', 'delete'] as const;
const resrc = ['file', 'folder', 'link'] as const;

declare function createEnum<
	const T extends readonly string[],
	const U extends readonly string[],
>(x: T, y: U): UnionToEnum<`${T[number]}_${U[number]}`, false, {camelCase: true}>;

const Template = createEnum(verb, resrc);
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

@author benzaria
@see UnionToTuple
@category Object
*/
export type UnionToEnum<
	Keys extends PropertyKey | readonly PropertyKey[],
	Numeric extends boolean = false,
	Options extends UnionToEnumOptions = {},
> = ApplyDefaultOptions<UnionToEnumOptions, DefaultUnionToEnumOptions, Options> extends infer ResolvedOptions extends Required<UnionToEnumOptions>
	? IsNever<Keys> extends true ? {}
		: _UnionToEnum<[
			...BuildTuple<ResolvedOptions['startIndex']>,
			...[Keys] extends [UnknownArray] ? Keys : UnionToTuple<Keys>,
		], Numeric, ResolvedOptions['camelCase']>
	: never;

type _UnionToEnum<
	Keys extends UnknownArray,
	Numeric extends boolean,
	CamelCase_ extends boolean,
> = Simplify<{readonly [
	K in keyof Keys as K extends `${number}`
		? Keys[K] extends PropertyKey
			? CamelCase_ extends true
				? CamelCase<Keys[K]>
				: Keys[K]
			: never
		: never
	]: Numeric extends true
		? K extends `${infer N extends number}`
			? N
			: never
		: Keys[K]
}>;

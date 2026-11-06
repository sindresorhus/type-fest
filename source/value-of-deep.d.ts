import type {IsAny} from './is-any.d.ts';
import type {IsEqual} from './is-equal.d.ts';
import type {MapsSetsOrArrays, NonRecursiveType} from './internal/type.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {ValueOf} from './value-of.d.ts'; // For `@link`
import type {Get} from './get.d.ts'; // For `@link`
import type {Paths} from './paths.d.ts'; // For `@link`

/**
Create a union of all leaf values in the given object, including values in nested objects and arrays.

Unlike {@link ValueOf}, which reads only the first level, this type reads every level and returns only the leaf values. Arrays and tuples contribute the values of their elements. Functions, `Date`, `RegExp`, `Map`, `Set`, promises, typed arrays, and DOM nodes are leaf values, because there is nothing useful to read from them.

Use-cases:
- Derive a union of string literals from a config object declared with `as const`.
- Accept any value that appears anywhere in a nested translation or schema object.
- Build a union of the values in a deeply nested API response type.

@example
```
import type {ValueOfDeep} from 'type-fest';

const config = {
	theme: {
		color: 'red',
		size: {small: 12, large: 24},
	},
	mode: 'dark',
} as const;

type ConfigValue = ValueOfDeep<typeof config>;
//=> 'red' | 12 | 24 | 'dark'

const value: ConfigValue = 'red';

// @ts-expect-error Not a deep value
const invalid: ConfigValue = 'blue';
```

@example
```
import type {ValueOfDeep} from 'type-fest';

type Form = {
	fields: Array<{value: number; enabled: boolean}>;
	tags: ['a', 'b'];
};

type FormValue = ValueOfDeep<Form>;
//=> 'a' | 'b' | boolean | number
```

An optional property includes `undefined` in the result, like {@link ValueOf}. A circular reference stops at the repeated type and contributes nothing, so with `type Node = {value: string; parent: Node}`, `ValueOfDeep<Node>` is `string`. An object with no keys contributes nothing.

Known limitations:
- Reads at most 50 levels. A deeper object stops and contributes nothing from that branch.

For the value at one deep property, use {@link Get} with a key path. For the paths themselves, use {@link Paths}.

@see {@link ValueOf}
@see {@link Get}
@see {@link Paths}

@category Object
@category Array
*/
export type ValueOfDeep<ObjectType> = ValueOfDeepRecursive<ObjectType, []>;

/**
The types that `ValueOfDeep` does not walk into. Arrays are removed from {@link MapsSetsOrArrays} because their element values are read.
*/
type NonRecursiveValue = NonRecursiveType | Exclude<MapsSetsOrArrays, UnknownArray>;

/**
Walk the object and collect its leaf values. `Seen` holds the ancestor types, so a circular reference stops instead of recursing forever. It also counts the depth, so a type that grows on every level stops at 50 levels instead of reaching the TypeScript instantiation limit.

`OriginalType` captures the input before the conditional distributes over `ObjectType`, so every member of an ancestor union is recognized when it appears again.

`any` needs its own branch because a conditional type with `any` evaluates both branches, and the recursive branch never terminates.
*/
type ValueOfDeepRecursive<ObjectType, Seen extends unknown[], OriginalType = ObjectType> =
	IsAny<ObjectType> extends true
		? ObjectType
		: ObjectType extends NonRecursiveValue
			? ObjectType
			: Seen['length'] extends 50
				? never
				: true extends IsSeen<ObjectType, Seen[number]>
					? never
					: ObjectType extends readonly unknown[]
						? ValueOfDeepRecursive<ObjectType[number], [...Seen, OriginalType]>
						: ObjectType extends object
							? ValueOfDeepRecursive<ObjectType[keyof ObjectType], [...Seen, OriginalType]>
							: ObjectType;

/**
Compare the current type with each ancestor union member separately. A `true` result for any member stops recursion; assignability alone could skip a narrower type with additional leaf values.
*/
type IsSeen<ObjectType, AncestorTypes> =
	AncestorTypes extends unknown
		? IsEqual<ObjectType, AncestorTypes>
		: never;

export {};

import type {MapsSetsOrArrays, NonRecursiveType, KeyToString} from './internal/index.d.ts';
import type {ApplyDefaultOptions} from './apply-default-options.d.ts';
import type {GreaterThan} from './greater-than.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {IsUnknown} from './is-unknown.d.ts';
import type {Paths} from './paths.d.ts'; // For `@link`
import type {Sum} from './sum.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Options for the `JsonPointer` type.

@see {@link JsonPointer}
*/
export type JsonPointerOptions = {
	/**
	The maximum depth to recurse. Range: 0 ~ 10.

	The default of `5` allows up to six reference tokens. With `0`, the result has only the empty pointer and the top-level properties. A non-literal `number` value, such as `{maxRecursionDepth: number}`, stops the recursion at the top level.

	@default 5

	@example
	```
	import type {JsonPointer} from 'type-fest';

	type Deep = {
		a: {
			b: {
				c: string;
			};
		};
	};

	type A = JsonPointer<Deep, {maxRecursionDepth: 0}>;
	//=> '' | '/a'

	type B = JsonPointer<Deep, {maxRecursionDepth: 1}>;
	//=> '' | '/a' | '/a/b'

	type C = JsonPointer<Deep, {maxRecursionDepth: 2}>;
	//=> '' | '/a' | '/a/b' | '/a/b/c'
	```
	*/
	maxRecursionDepth?: number;
};

/**
The default options for {@link JsonPointer}.
*/
type DefaultJsonPointerOptions = {
	maxRecursionDepth: 5;
};

/**
Generate a union of all possible JSON Pointer strings for the given type.

A [JSON Pointer](https://datatracker.ietf.org/doc/html/rfc6901) identifies a value inside a JSON document. Use it to type the `path` of a JSON Patch operation ([RFC 6902](https://datatracker.ietf.org/doc/html/rfc6902#section-4)) or any other API that takes a JSON Pointer.

The empty string points to the whole value. Every other pointer starts with `/` and has one reference token per level. A key that contains `~` or `/` is escaped as `~0` or `~1`. An array index is bare digits, so `/members/0/firstName` is a pointer and `/members/[0]/firstName` is not.

Use-case: Autocomplete and typo checking for JSON Patch paths, such as the `path` of a `replace` operation, or for a JSON Pointer library like [`json-joy`](https://jsonjoy.com/libs/json-joy-js/json-pointer).

@example
```
import type {JsonPointer} from 'type-fest';

type Family = {
	members: Array<{
		firstName: string;
		lastName: string;
	}>;
};

type FamilyPointer = JsonPointer<Family>;
//=> '' | '/members' | `/members/${number}` | `/members/${number}/firstName` | `/members/${number}/lastName`

declare function patch(pointer: FamilyPointer): void;

patch('/members/0/firstName');
patch('/members/1/lastName');

// @ts-expect-error
patch('/members/0/name');

// @ts-expect-error
patch('/members/[0]/firstName');
```

@example
```
import type {JsonPointer} from 'type-fest';

type Document = {
	'a/b': {
		'~': string;
	};
};

type Pointer = JsonPointer<Document>;
//=> '' | '/a~1b' | '/a~1b/~0'
```

Note: An array of unknown length uses `${number}` as the index token, because TypeScript cannot enumerate the indices. This also accepts tokens that are not valid array indices, like `1.5` or `00`. A tuple without a rest element gets exact indices. The RFC 6902 `-` append token and the URI fragment form (`#/members/0`) are not supported. A circular type stops at {@link JsonPointerOptions.maxRecursionDepth | `maxRecursionDepth`}.

A top-level `any` or `unknown` gives `` '' | `/${string}` ``, but as a property or array element value it is a leaf. A `string` index signature collapses its nested pointers into `/${string}`, because a `${string}` token can contain `/`. A `number` index signature keeps them separate.

@see {@link Paths} for dot-notation paths.

@category JSON
*/
export type JsonPointer<Type, Options extends JsonPointerOptions = {}> =
	// Resolving the options in a conditional type defers it for generic options, so declaration emit keeps this alias instead of expanding the result.
	ApplyDefaultOptions<JsonPointerOptions, DefaultJsonPointerOptions, Options> extends infer ResolvedOptions extends Required<JsonPointerOptions>
		? IsNever<Type> extends true
			? never
			// A wide type has no known shape, so only the pointer syntax is checked.
			: IsAny<Type> extends true
				? '' | `/${string}`
				: IsUnknown<Type> extends true
					? '' | `/${string}`
					: '' | `/${_JsonPointer<Type, ResolvedOptions>}`
		: never;

/**
The pointer suffixes for the given type, without the leading `/`. A value that is not walked, like a primitive, gives `never`.
*/
type _JsonPointer<Type, Options extends Required<JsonPointerOptions>, CurrentDepth extends number = 0> =
	Type extends NonRecursiveType | Exclude<MapsSetsOrArrays, UnknownArray>
		? never
		: IsAny<Type> extends true
			? never
			: Type extends object
				? {
					[Key in keyof Type]-?: Key extends string | number
						? `${EscapeJsonPointerToken<KeyToString<Key>>}${_JsonPointerSuffix<Type[Key], Options, CurrentDepth>}`
						: never;
				}[keyof Type & (Type extends UnknownArray ? number : unknown)]
				: never;

/**
The continuation after one reference token: an empty string for the property itself, or `/` plus the pointer suffixes of its value.
*/
type _JsonPointerSuffix<Value, Options extends Required<JsonPointerOptions>, CurrentDepth extends number> =
	GreaterThan<Options['maxRecursionDepth'], CurrentDepth> extends true
		? '' | `/${_JsonPointer<Value, Options, Sum<CurrentDepth, 1>>}`
		: '';

/**
Escape a reference token as RFC 6901 requires: `~` becomes `~0`, then `/` becomes `~1`. A wide token, like `string` or the placeholder in a template literal, is kept as it is, because its matches cannot be determined.
*/
type EscapeJsonPointerToken<Token extends string> = EscapeJsonPointerSlash<EscapeJsonPointerTilde<Token>>;

/**
Escape `~` as `~0`. Runs before {@link EscapeJsonPointerSlash}, because escaping `/` first would turn its `~1` output into `~01`.
*/
// The escaped part is kept in `Result`, so the recursion is in tail position and a long key does not hit the recursion limit.
type EscapeJsonPointerTilde<Token extends string, Result extends string = ''> =
	Token extends `${infer Head}~${infer Tail}`
		? EscapeJsonPointerTilde<Tail, `${Result}${Head}~0`>
		: `${Result}${Token}`;

/**
Escape `/` as `~1`. Runs after {@link EscapeJsonPointerTilde}.
*/
// The escaped part is kept in `Result`, so the recursion is in tail position and a long key does not hit the recursion limit.
type EscapeJsonPointerSlash<Token extends string, Result extends string = ''> =
	Token extends `${infer Head}/${infer Tail}`
		? EscapeJsonPointerSlash<Tail, `${Result}${Head}~1`>
		: `${Result}${Token}`;

export {};

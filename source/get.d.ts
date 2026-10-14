import type {ApplyDefaultOptions, ExactKey, ToString} from './internal/index.d.ts';
import type {_LiteralStringUnion} from './literal-union.d.ts';
import type {Paths} from './paths.d.ts';
import type {Split} from './split.d.ts';
import type {KeyAsString} from './key-as-string.d.ts';
import type {DigitCharacter} from './characters.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {OmitIndexSignature} from './omit-index-signature.d.ts';

export type GetOptions = {
	/**
	Include `undefined` in the return type when accessing properties.

	Setting this to `false` is not recommended.

	A nullish value, or a key only some union members have, includes `undefined` either way.

	@default true
	*/
	strict?: boolean;
};

type DefaultGetOptions = {
	strict: true;
};

/**
Like the `Get` type but receives an array of strings as a path parameter.
*/
type GetWithPath<BaseType, Keys, Options extends Required<GetOptions>> =
	Keys extends readonly []
		? BaseType
		: Keys extends readonly [infer Head, ...infer Tail]
			? GetWithPath<
				PropertyOf<BaseType, Extract<Head, string>, Options>,
				Extract<Tail, string[]>,
				Options
			>
			: never;

/**
Adds `undefined` to `Type` if `strict` is enabled.
*/
type Strictify<Type, Options extends Required<GetOptions>> =
	Options['strict'] extends false ? Type : (Type | undefined);

// If `Options['strict']` is `true`, includes `undefined` in the returned type when accessing properties on `Record<string, any>`.
type StrictPropertyOf<BaseType, Key extends keyof BaseType, Options extends Required<GetOptions>> =
	Record<string, any> extends BaseType
		? string extends keyof BaseType
			? Strictify<BaseType[Key], Options> // Record<string, any>
			: BaseType[Key] // Record<'a' | 'b', any> (Records with a string union as keys have required properties)
		: BaseType[Key];

/**
Splits a dot-prop style path into a tuple comprised of the properties in the path. Handles square-bracket notation.

@example
```
type A = ToPath<'foo.bar.baz'>;
//=> ['foo', 'bar', 'baz']

type B = ToPath<'foo[0].bar.baz'>;
//=> ['foo', '0', 'bar', 'baz']
```
*/
type ToPath<S extends string> = Split<FixPathSquareBrackets<S>, '.', {strictLiteralChecks: false}>;

/**
Replaces square-bracketed dot notation with dots, for example, `foo[0].bar` -> `foo.0.bar`.
*/
type FixPathSquareBrackets<Path extends string> =
	Path extends `[${infer Head}]${infer Tail}`
		? Tail extends `[${string}`
			? `${Head}.${FixPathSquareBrackets<Tail>}`
			: `${Head}${FixPathSquareBrackets<Tail>}`
		: Path extends `${infer Head}[${infer Middle}]${infer Tail}`
			? `${Head}.${FixPathSquareBrackets<`[${Middle}]${Tail}`>}`
			: Path;

/**
Returns true if `LongString` is made up out of `Substring` repeated 0 or more times.

@example
```
type A = ConsistsOnlyOf<'aaa', 'a'>; //=> true
type B = ConsistsOnlyOf<'ababab', 'ab'>; //=> true
type C = ConsistsOnlyOf<'aBa', 'a'>; //=> false
type D = ConsistsOnlyOf<'', 'a'>; //=> true
```
*/
type ConsistsOnlyOf<LongString extends string, Substring extends string> =
	LongString extends ''
		? true
		: LongString extends `${Substring}${infer Tail}`
			? ConsistsOnlyOf<Tail, Substring>
			: false;

/**
Convert a type which may have number keys to one with string keys, making it possible to index using strings retrieved from template types.

@example
```
type WithNumbers = {foo: string; 0: boolean};
type WithStrings = WithStringKeys<WithNumbers>;

type WithNumbersKeys = keyof WithNumbers;
//=> 'foo' | 0
type WithStringsKeys = keyof WithStrings;
//=> 'foo' | '0'
```
*/
type WithStringKeys<BaseType> = {
	[Key in KeyAsString<BaseType>]: UncheckedIndex<BaseType, Key>
};

/**
Perform a `T[U]` operation if `T` supports indexing.
*/
type UncheckedIndex<T, U extends string | number> = [T] extends [Record<string | number, any>] ? T[U] : never;

/**
Get a property of an object or array. Works when indexing arrays using number-literal-strings, for example, `PropertyOf<number[], '0'> = number`, and when indexing objects with number keys.

Note:
- Returns `unknown` if no member of `BaseType` has `Key`, since TypeScript uses structural typing, and it cannot be guaranteed that extra properties unknown to the type system will exist at runtime.
- Returns `undefined` for union members without `Key` when other members have it.
- Returns `undefined` from nullish values, to match the behaviour of most deep-key libraries like `lodash`, `dot-prop`, etc.
*/
// Why a missing key is `undefined` for some union members but `unknown` when no member has it (https://github.com/sindresorhus/type-fest/issues/1205):
// - This mirrors TypeScript. `'key' in union` narrows to the members that declare the key, and a fresh object literal union gets `key?: undefined` on the other members. On a single type, `'key' in value` gives `value.key` the type `unknown`.
// - `Paths` gives a path that only some union members have, so `Get` must resolve it. Otherwise `Get<T, Paths<T>>` can be `unknown`, and `dot-prop` loses the value type.
// - Do not make every missing key `undefined` (rejected in https://github.com/sindresorhus/type-fest/pull/1463). `Get` accepts any string path, so `unknown` is the only sign of a typo, and an object can structurally have a key its type does not declare.
// - Each member returns a marker instead of `unknown`, because `unknown` absorbs the other members of the union, which made the whole result `unknown`.
// - A nullish member has its own marker, so `Get<{a?: {b: 1}}, 'a.typo'>` stays `unknown`. If its `undefined` counted as having the key, a typo behind an optional property or an array index would be `undefined`.
// - The markers are object types with a private symbol key. A `unique symbol` marker would be merged into a `symbol` member, and checking the marker with `extends` instead of `Extract` would also match values such as `{}` and `object`.
// - The resulting rule: if any non-nullish member has the key, the result is its value, plus `undefined` when another member lacks the key or is nullish. Otherwise, it is `unknown` when a non-nullish member lacks the key, and `undefined` when every member is nullish. A member whose value is `never` cannot exist, so it does not count as having the key. This `undefined` is added even with `strict: false`, because it describes a value that is absent, not a key that may be absent.
type PropertyOf<BaseType, Key extends string, Options extends Required<GetOptions>> =
	MemberPropertyOf<BaseType, Key, Options> extends infer Result
		? [Exclude<Result, MemberMarker>] extends [never]
			// No member has the key. A member without it makes the result `unknown`, and nullish members alone read as `undefined`.
			? [Extract<Result, MissingKey>] extends [never]
				? [Result] extends [never] ? never : undefined
				: unknown
			: Exclude<Result, MemberMarker> | ([Extract<Result, MemberMarker>] extends [never] ? never : undefined)
		: never;

declare const memberMarker: unique symbol;

// Marks a member that does not have the key.
type MissingKey = {readonly [memberMarker]: 'missing'};

// Marks a member that is `null` or `undefined`.
type NullishMember = {readonly [memberMarker]: 'nullish'};

type MemberMarker = MissingKey | NullishMember;

/**
Get a property of each member of `BaseType`, with a marker for a member that lacks it or is nullish.
*/
type MemberPropertyOf<BaseType, Key extends string, Options extends Required<GetOptions>> =
	BaseType extends null | undefined
		? NullishMember
		// Normalize declared numeric members before the array-like fallback, so its index signature does not hide their more precise types.
		: Key extends keyof BaseType | (BaseType extends object ? KeyAsString<OmitIndexSignature<BaseType>> : never)
			? StrictPropertyOf<BaseType, (Key | ExactKey<OmitIndexSignature<BaseType>, Key>) & keyof BaseType, Options>
			// Handle arrays and tuples
			: BaseType extends readonly unknown[]
				? Key extends `${number}`
					// For arrays with unknown length (regular arrays)
					? number extends BaseType['length']
						? Strictify<BaseType[number], Options>
						// For tuples: check if the index is valid
						: Key extends keyof BaseType
							? Strictify<BaseType[Key & keyof BaseType], Options>
							// Out-of-bounds access for tuples
							: MissingKey
					// Non-numeric string key for arrays/tuples
					: MissingKey
				// Handle array-like objects
				: BaseType extends {
					[n: number]: infer Item;
					length: number; // Note: This is needed to avoid being too lax with records types using number keys like `{0: string; 1: boolean}`.
				}
					? (
						ConsistsOnlyOf<Key, DigitCharacter> extends true
							? Strictify<Item, Options>
							: MissingKey
					)
					// A key that names a member of the subject is read from the subject, not from its string keys: a number index signature covers every numeric key, so `'0' extends keyof` is false for `{[k: number]: string; 0: 'x'}` even though the member is right there.
					: BaseType extends object
						? ExactKey<BaseType, Key> extends infer Exact extends keyof BaseType
							? IsNever<Exact> extends true
								// `never` is assignable to every key set, so it has to be told apart from a key that was found, or a key the subject does not have answers `never`.
								? Key extends keyof WithStringKeys<BaseType>
									? StrictPropertyOf<WithStringKeys<BaseType>, Key, Options>
									: MissingKey
								: StrictPropertyOf<BaseType, Exact, Options>
							: MissingKey
						: MissingKey;

// This works by first splitting the path based on `.` and `[...]` characters into a tuple of string keys. Then it recursively uses the head key to get the next property of the current object, until there are no keys left. Number keys extract the item type from arrays, or are converted to strings to extract types from tuples and dictionaries with number keys.
/**
Get a deeply-nested property from an object using a key path, like [Lodash's `.get()`](https://lodash.com/docs#get) function.

Use-case: Retrieve a property from deep inside an API response or some other complex object.

A path can also be a number, such as `Get<string[], 0>`, read like its string form, so `Get<BaseType, Paths<BaseType>>` works for a generic `BaseType`.

A key only some union members have resolves to `undefined` for the others, so `Get<{data: {user: {id: string} | {error: string}}}, 'data.user.id'>` is `string | undefined`. A key no member has resolves to `unknown`.

Known limitations:
- For a numeric segment that lands in the rest of a variadic tuple, answers the union of every element type, so it also includes the positions the tuple declares itself. `Get<{t: [1, [2, {a: string}], ...Array<{b: number}>]}, 't.2'>` is `1 | [2, {a: string}] | {b: number} | undefined` rather than `{b: number} | undefined`, because a variadic tuple has an unbounded `length` and TypeScript cannot recover the rest element type here. A path one level deeper into the rest reads from each of those element types. Positions the tuple declares itself are correct.
- With `strict` (the default), `undefined` is added for a key read through a `Record<string, …>` or an array, but not for a key read through an index signature on an object that also has named keys (`{a: string; [key: string]: string}`), or through a number index signature.
- A string path cannot read a key that contains a dot, because every `.` separates two keys. `Get<{'a.b': {c: number}}, 'a.b.c'>` is `unknown`. Use the array form instead: `Get<{'a.b': {c: number}}, ['a.b', 'c']>` is `number`.

@example
```
import type {Get} from 'type-fest';

declare function get<BaseType, const Path extends string | readonly string[]>(object: BaseType, path: Path): Get<BaseType, Path>;

type ApiResponse = {
	hits: {
		hits: Array<{
			_id: string;
			_source: {
				name: Array<{
					given: string[];
					family: string;
				}>;
				birthDate: string;
			};
		}>;
	};
};

const getName = (apiResponse: ApiResponse) => get(apiResponse, 'hits.hits[0]._source.name');
//=> (apiResponse: ApiResponse) => {
// 	given: string[];
// 	family: string;
// }[] | undefined

// Path also supports a readonly array of strings
const getNameWithPathArray = (apiResponse: ApiResponse) => get(apiResponse, ['hits', 'hits', '0', '_source', 'name']);
//=> (apiResponse: ApiResponse) => {
// 	given: string[];
// 	family: string;
// }[] | undefined

// Non-strict mode:
type A = Get<string[], '3', {strict: false}>;
//=> string

type B = Get<Record<string, string>, 'foo', {strict: true}>;
//=> string | undefined
```

@category Object
@category Array
@category Template literal
*/
export type Get<
	BaseType,
	Path extends
	| readonly string[]
	| number
	| _LiteralStringUnion<ToString<Paths<BaseType, {bracketNotation: false; maxRecursionDepth: 2}> | Paths<BaseType, {bracketNotation: true; maxRecursionDepth: 2}>>>,
	Options extends GetOptions = {},
> =
	GetWithPath<
		BaseType,
		Path extends string | number ? ToPath<ToString<Path>> : Path,
		ApplyDefaultOptions<GetOptions, DefaultGetOptions, Options>
	>;

export {};

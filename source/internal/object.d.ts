import type {ExactKey} from '../exact-key.d.ts';
import type {IsEqual} from '../is-equal.d.ts';
import type {KeysOfUnion} from '../keys-of-union.d.ts';
import type {IsNever} from '../is-never.d.ts';
import type {StringToNumber} from '../string-to-number.d.ts';
import type {Primitive} from '../primitive.d.ts';
import type {TagContainer, UnwrapTagged} from '../tagged.d.ts';
import type {OmitIndexSignature} from '../omit-index-signature.d.ts';
import type {PickIndexSignature} from '../pick-index-signature.d.ts';
import type {CollapseLiterals} from '../collapse-literals.d.ts';
import type {DefinedKeyFilter, OptionalKeyFilter} from './keys.d.ts';
import type {IfNotAnyOrNever} from './type.d.ts';
import type {ToString} from './string.d.ts';

/**
Flatten an object type. This is the plain definition `Simplify` had before it started returning a function, a class constructor, or a branded primitive as is.

Internal types use this instead of `Simplify`, because they only flatten object types they built themselves, where any call signature is already dropped or handled separately and no branded primitive can appear, so they do not need that check. Use `Simplify` if the input can be a function, a class constructor, or a branded primitive. Keeping the check out of them avoids its cost in every type that flattens its result, and avoids the risk of "excessively deep" errors in user code, which a conditional in `Simplify` once caused for types like `SetRequired`. See https://github.com/sindresorhus/type-fest/issues/436.
*/
export type SimplifyObject<Type> = {[KeyType in keyof Type]: Type[KeyType]} & {};

/**
Create an object type with the given key `<Key>` and value `<Value>`.

It will copy the prefix and optional status of the same key from the given object `CopiedFrom` into the result.

@example
```
type A = BuildObject<'a', string>;
//=> {a: string}

// Copy `readonly` and `?` from the key `a` of `{readonly a?: any}`
type B = BuildObject<'a', string, {readonly a?: any}>;
//=> {readonly a?: string}
```
*/
export type BuildObject<Key extends PropertyKey, Value, CopiedFrom extends object = {}> =
	Key extends unknown // Keep separate objects for a union of keys.
		// Look up both forms of a numeric key before copying its modifiers.
		? IsNever<ExactKey<CopiedFrom, Key>> extends true
			? {[_ in Key]: Value}
			: Pick<{[_ in keyof CopiedFrom]: Value}, ExactKey<CopiedFrom, Key>>
		: never;

/**
Extract the object field type if T is an object and K is a key of T, return `never` otherwise.

It creates a type-safe way to access the member type of `unknown` type.
*/
export type ObjectValue<T, K> =
	K extends keyof T
		? T[K]
		: ToString<K> extends keyof T
			? T[ToString<K>]
			: K extends `${infer NumberK extends number}`
				? NumberK extends keyof T
					? T[NumberK]
					: never
				: never;

/**
Prepare object properties for `Jsonify` by filtering omitted keys and replacing unions with `undefined` with optional properties.

It also removes the properties that `JSON.stringify` drops: symbol keys, properties that are only `undefined`, required properties that are only a symbol, and properties whose type includes a function. A `never` property is removed too. An `any` or `unknown` property is kept as it is, including whether it is optional.

@example
```
type User = {
	firstName: string;
	lastName: string | undefined;
};

type OptionalizedUser = JsonifyObjectProperties<User>;
//=> {
// 	firstName: string;
// 	lastName?: string;
// }
```
*/
export type JsonifyObjectProperties<T extends object> = SimplifyObject<
	// Each key is filtered on its own in the `as` clause. Filtering `keyof T` as a union would merge a literal key like `foo` into a `string` index signature.
	{
	// Property is not a union with `undefined`, keep it as-is.
		[Key in keyof T as DefinedKeyFilter<T, Key>]: T[Key];
	} & {
	// Property _is_ a union with defined value. Set as optional (via `?`) and remove `undefined` from the union.
		[Key in keyof T as OptionalKeyFilter<T, Key>]?: Exclude<T[Key], undefined>;
	}
>;

/**
Extract all possible values for a given key from a union of object types.

@example
```
type Statuses = ValueOfUnion<{id: 1; status: 'open'} | {id: 2; status: 'closed'}, 'status'>;
//=> "open" | "closed"
```
*/
// This per-member lookup keeps `AllUnionFields` index values precise. Public `ValueOf` includes an undistributed read to preserve generic getter assignability, but that read can return `unknown` for mixed numeric or symbol index domains. It cannot replace this helper until that precision issue is fixed; switching also deliberately widens index values to include overlapping named properties.
export type ValueOfUnion<Union, Key extends KeysOfUnion<Union>> =
	Union extends unknown ? Key extends keyof Union ? Union[Key] : never : never;

/**
Returns whether the given key of `ObjectType` has the `readonly` modifier.

The key belongs to the object, so no distribution or `any` handling is needed.
*/
export type IsReadonlyProperty<ObjectType, Key extends keyof ObjectType> = IsEqual<
	{[Property in Key]: ObjectType[Property]},
	{readonly [Property in Key]: ObjectType[Property]}
>;

/**
Returns the base type of a branded type.

@example
```
type Brand = {readonly __brand: unique symbol};

type A = UnwrapBrand<string & Brand>;
//=> string

type B = UnwrapBrand<number & Brand>;
//=> number

type C = UnwrapBrand<PropertyKey & Brand>;
//=> PropertyKey

type D = UnwrapBrand<(1 | 200n | 'foo' | 'bar') & Brand>;
//=> 1 | 200n | 'foo' | 'bar'
```
*/
export type UnwrapBrand<T> = IfNotAnyOrNever<T, {ifNot: _UnwrapBrand<T, Primitive>}>;

type _UnwrapBrand<T, Base> = T extends Primitive
	// Separate tag layers do not match a single object containing all brand properties.
	// `CollapseLiterals` removes `& {}` first, because TypeScript defers `keyof` on types like `` `on${string}` & {} ``.
	? UnwrapBrandProperties<CollapseLiterals<T extends TagContainer<unknown> ? UnwrapTagged<T> : T>, Base>
	: T;

type UnwrapBrandProperties<T, Base> = T extends infer U & Pick<T, Exclude<keyof T, KeysOfUnion<Base>>>
	? U
	: T;

/**
Normalize keys by including string and number representations wherever applicable.

@example
```ts
type A = NormalizedKeys<0 | '1'>;
//=> 0 | '0' | 1 | '1'

type B = NormalizedKeys<string>;
//=> string | number

type C = NormalizedKeys<number>;
//=> number | `${number}`

type D = NormalizedKeys<symbol | 'foo'>;
//=> symbol | 'foo'
```
*/
export type NormalizedKeys<Keys extends PropertyKey> =
	| Keys
	| (string extends Keys ? number : never)
	| StringToNumber<Keys & string>
	| ToString<Keys & number>;

/**
Get the given keys with their numeric and string aliases, including the runtime string spelling of enum keys.

@example
```ts
enum Color {
	Red = 'red',
}

type A = KeyAliases<0 | Color.Red>;
//=> 0 | '0' | Color.Red | 'red'
```
*/
export type KeyAliases<Keys extends PropertyKey> = NormalizedKeys<Keys | ToString<Keys>>;

/**
Finds the keys of `BaseType` that the terminal paths name for deep setters, matching numeric, string, and enum spellings, and keeping a numeric key such as `1.2` distinct from a dotted string path such as `'1.2'`.
*/
export type DeepTerminalKeys<KeyPaths, BaseType> = KeyPaths extends `${string}.${string}`
	? never
	: KeyAliases<KeyPaths & PropertyKey> extends infer Keys
		// An enum key and its literal spelling do not intersect, so declared keys are also matched by assignability. A key that an index signature covers is left to the intersection, because `number` is assignable to a numeric enum.
		? (Keys & keyof BaseType) | Extract<keyof OmitIndexSignature<BaseType>, Exclude<Keys, keyof PickIndexSignature<BaseType>>>
		: never;

/**
Finds the subpaths whose first property matches `Key` in `BaseType`. A declared property is selected on its own, without also changing its covering index signature.
*/
export type DeepSubPaths<KeyPaths, Key, BaseType> = KeyPaths extends `${infer Property}.${infer RestPath}`
	// A noncanonical numeric segment, such as `01`, does not name a number key or an array index.
	? Property extends ToString<(Key & string) | ExactKey<Record<Key & number, unknown>, Property>>
		? Property extends `${keyof OmitIndexSignature<BaseType> & (string | number)}`
			? `${Key & (string | number)}` extends Property
				? RestPath
				: never
			: RestPath
		// A non-literal segment also selects each key assignable to its native template pattern.
		: Extract<ToString<Key>, Property> extends never
			? never
			: RestPath
	: never;

export {};

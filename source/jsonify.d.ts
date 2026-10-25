import type {JsonPrimitive, JsonValue} from './json-value.d.ts';
import type {EmptyObject} from './empty-object.d.ts';
import type {IsArrayOfUnknownLength, UndefinedToOptional} from './internal/index.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {IsEqual} from './is-equal.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {IsUnknown} from './is-unknown.d.ts';
import type {NegativeInfinity, PositiveInfinity} from './numeric.d.ts';
import type {Tag, TagContainer, UnwrapTagged, tag} from './tagged.d.ts';
import type {TypedArray} from './typed-array.d.ts';
import type {UnionMember} from './union-member.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

// `Function` matches a call signature, both construct signatures, and the `Function` interface itself, none of which `JSON.stringify` writes.
type NotJsonable = Function | undefined | symbol;

type NeverToNull<T> = IsNever<T> extends true ? null : T;

// Symbol-valued and function-valued object properties disappear, just like undefined-valued properties.
type OmittedValueToUndefined<Value> = Value extends symbol | Function ? undefined : Value;

// `JSON.stringify` turns array members that are not JSON-able into `null`. The `extends` is distributive so that each member of a union is handled on its own. Without it, a non-JSON-able member collapses the whole union, as `Jsonify<symbol | number>` would become `number`.
type JsonifyListItem<T> = JsonifyListItemResult<ToJsonResult<T>>;

// Classify the toJSON result before Jsonify can remove undefined from a union.
type JsonifyListItemResult<T> = T extends NotJsonable ? null : NeverToNull<Jsonify<T>>;

// Handles tuples and arrays
// The leading required elements are kept in `Result`, so the recursion over them is in tail position and a long tuple does not hit the recursion limit.
type JsonifyList<T extends UnknownArray, Result extends UnknownArray = []> = T extends readonly [infer F, ...infer R]
	// A tuple position always holds a value, so a `never` member becomes `null`. `JsonifyListItem` distributes, which would turn it into `never`.
	? [F, ...R] extends T // With TS 5.8.3, if `string[] & ['foo']`, `R` is `unknown[]` here, making the inferred types not equal to the original one
		? JsonifyList<R, [...Result, NeverToNull<JsonifyListItem<F>>]>
		: [...Result, NeverToNull<JsonifyListItem<F>>]
	// The rest is jsonified on its own, so an array that is already JSON is kept as it is, including whether it is readonly.
	: Result extends []
		? T extends readonly []
			? []
			: '0' extends keyof T
				// Optional positions may be absent, so keep each possible tuple shape. A hole before another element is serialized as null.
				? T extends readonly [(infer F)?, ...infer R]
					? [] | [JsonifyListItem<F | undefined>, ...JsonifyList<R>]
					: never
				: IsUnknown<T[number]> extends true
					? JsonValue[]
					// Transforming an array that contains itself, like `JsonValue[]` in `JsonValue`, would recurse forever. Keep it when it is already JSON, and otherwise fall back to `JsonValue[]`.
					: true extends ContainsItself<T>
						? T extends JsonValue
							? T
							: JsonValue[]
						: Array<JsonifyListItem<T[number]>>
		: [...Result, ...JsonifyList<T>];

// TypeScript cannot infer the elements of a tuple that is intersected with an object type, so the tags and flavors of a tuple are removed first. `JSON.stringify` drops the tag's symbol key anyway. A tagged or flavored array of unknown length keeps its tag, so that `ContainsItself` still matches an array that contains itself.
type UntagTuple<T extends UnknownArray> = typeof tag extends keyof T
	? IsArrayOfUnknownLength<T> extends true
		? T
		: RemoveFlavors<T extends TagContainer<unknown> ? UnwrapTagged<T> : T>
	: T;

// Removes the `Flavor` layers one at a time, like `UnwrapTagged` does for tags. Every order of removing them ends at the same type, so following only one of them is enough.
type RemoveFlavors<T> = T extends unknown
	? typeof tag extends keyof T
		? [RemoveFlavor<T>] extends [never]
			? T
			: RemoveFlavors<UnionMember<RemoveFlavor<T>>>
		: T
	: never;

// A flavor applied with a single name is a layer of its own, and a flavor applied with a union of names is one layer holding all of them, so both shapes are matched. The match is exact, because a flavor always has `unknown` metadata. A result that is still the input is dropped, so that the recursion always makes progress. The check cannot be assignability, as with tags, because a plain value is assignable to its flavor.
type RemoveFlavor<T, Names extends PropertyKey = keyof NonNullable<T[typeof tag & keyof T]>> =
	| {
		[Name in Names]: T extends infer Underlying & Partial<Tag<Name, unknown>>
			? IsEqual<Underlying, T> extends true ? never : Underlying
			: never
	}[Names]
	| (T extends infer Underlying & Partial<Tag<Names, unknown>>
		? IsEqual<Underlying, T> extends true ? never : Underlying
		: never);

// Whether the array is one of its own item types. Distributes over the item types so that each one is compared with the array on its own.
// Only array members can equal the array, so skip the more expensive equality check for other values.
type ContainsItself<T extends UnknownArray, Item = T[number]> = Item extends UnknownArray ? IsEqual<Item, T> : false;

/**
JSON serialize objects (not including arrays) and classes. The caller has already filtered their keys with `UndefinedToOptional`.
*/
type JsonifyObject<T extends object> = {
	[Key in keyof T]: Jsonify<T[Key]>;
};

// A value that accepts every JSON value, like `JsonValue` or `any`, has no leaves to normalize, so it is kept as is instead of expanding the recursive alias. Primitives go through `Jsonify`. Objects and arrays are mapped so that their modifiers stay, and only their leaves are normalized.
type NormalizeJsonValue<Value> = JsonValue extends Value
	? Value
	: (() => Value) extends () => JsonPrimitive
		? Jsonify<Value>
		: Value extends UnknownArray
			? NormalizeJsonList<UntagTuple<Value>>
			: Value extends object
				? {[Key in keyof Value as Key extends symbol ? never : Key]: NormalizeJsonValue<Value[Key]>}
				: Jsonify<Value>;

// Rebuild arrays directly so recursive JSON values do not expand through a mapped array type.
type NormalizeJsonList<Value extends UnknownArray> = IsArrayOfUnknownLength<Value> extends true
	? Value extends unknown[]
		? Array<NormalizeJsonValue<Value[number]>>
		: ReadonlyArray<NormalizeJsonValue<Value[number]>>
	: {[Key in keyof Value]: NormalizeJsonValue<Value[Key]>};

// Object properties may disappear when their own toJSON method returns undefined.
type ToJsonResult<T> = T extends {toJSON(...arguments_: any[]): infer Result} ? WithoutToJson<Result> : T;

// `JSON.stringify` calls `toJSON` only once per value, so the `toJSON` method of a `toJSON` result is ignored. A `Date` returned by `toJSON` becomes `{}`, not a string. Calling it again would also recurse forever when the result can be the same type, as with `Jsonifiable`.
type WithoutToJson<T> = T extends {toJSON(...arguments_: any[]): unknown}
	// Removing properties from a function also removes its call signature. Keep it classified as a function so the returned value is still omitted.
	? T extends Function ? Function : Omit<T, 'toJSON'>
	: T;

/**
Transform a type to one that is assignable to the `JsonValue` type.

This includes:
1. Transforming JSON `interface` to a `type` that is assignable to `JsonValue`.
2. Transforming non-JSON value that is *jsonable* to a type that is assignable to `JsonValue`, where *jsonable* means the non-JSON value implements the `.toJSON()` method that returns a value that is assignable to `JsonValue`.

Note: An enum is already a subtype of `string` or `number`, so it passes through unchanged where a primitive would. `Jsonify<{status: Status}>` is `{status: Status}`, and a plain string is not assignable to it, even though that is what `JSON.parse` gives back. TypeScript cannot tell an enum from a union of the same literals, so nothing here unwraps one. `LiteralToPrimitive` does, so `LiteralToPrimitiveDeep<T>` is the type to reach for when enums should become their primitives.

Note: A tagged primitive, like `Tagged<number, 'UserId'>`, keeps its tag, because `JSON.parse` gives back the same value. A tagged object, array, or `Date` loses its tag, because it becomes a new value. Use `UnwrapTagged` to remove the tag from a single type, or `LiteralToPrimitiveDeep` to remove all tags, which also widens literals like `'Point'` to `string`.

Note: An array type that contains itself, like `Json[]` in `type Json = string | Json[]`, cannot be transformed without infinite recursion. It stays unchanged when it is already JSON, and otherwise becomes `JsonValue[]`. A cycle through a tuple, like `type Pair = string | [Pair, Pair]`, or through more than one array type, like `type A = string | B[]` with `type B = number | A[]`, is too deep to transform.

Note: A tuple intersected with an object type other than a tag, like `[string, number] & {extra: true}`, can lose elements, because TypeScript cannot infer the elements of such a tuple. A tagged or flavored tuple, like `Tagged<[number, number], 'Point'>`, is not affected.

@remarks

An interface cannot be structurally compared to `JsonValue` because an interface can be re-opened to add properties that may not satisfy `JsonValue`.

@example
```
import type {Jsonify, JsonValue} from 'type-fest';

interface Geometry {
	type: 'Point' | 'Polygon';
	coordinates: [number, number];
}

const point: Geometry = {
	type: 'Point',
	coordinates: [1, 1],
};

declare function problemFn(data: JsonValue): void;

// @ts-expect-error
problemFn(point); // Error: type Geometry is not assignable to parameter of type JsonValue because it is an interface

declare function fixedFn<T>(data: Jsonify<T>): void;

fixedFn(point); // Good: point is assignable. Jsonify<T> transforms Geometry into value assignable to JsonValue

// @ts-expect-error
fixedFn(new Date()); // Error: As expected, Date is not assignable. Jsonify<T> cannot transform Date into a value assignable to JsonValue
```

Non-JSON values such as `Date` implement `.toJSON()`, so they can be transformed to a value assignable to `JsonValue`:

@example
```
import type {Jsonify} from 'type-fest';

const time = {
	timeValue: new Date(),
};

// `Jsonify<typeof time>` is equivalent to `{timeValue: string}`
const timeJson = JSON.parse(JSON.stringify(time)) as Jsonify<typeof time>;
```

Note: `JSON.stringify` writes `NaN`, `Infinity`, and `-Infinity` as `null`, but TypeScript types these values as `number`, so `Jsonify<number>` is `number`. Only the {@link PositiveInfinity} and {@link NegativeInfinity} number types become `null`. Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/28682) if you want to have a `NaN` type as a built-in in TypeScript.

@see https://github.com/Microsoft/TypeScript/issues/1897#issuecomment-710744173

@category JSON
*/
export type Jsonify<T> = IsAny<T> extends true
	? any
	: T extends PositiveInfinity | NegativeInfinity
		? null
		: T extends JsonPrimitive
			? T
			// Any object with toJSON is special case. `JSON.stringify` always passes the property key, so `toJSON` may declare parameters.
			: T extends {toJSON(...arguments_: any[]): infer J}
				? (() => J) extends () => JsonValue // Is J assignable to JsonValue?
					? NormalizeJsonValue<J> // Normalize numeric leaves even when J is already JSON-compatible.
					: Jsonify<WithoutToJson<J>> // Maybe if we look a level deeper we'll find a JsonValue
				// Instanced primitives are objects
				: T extends Number
					? number
					: T extends String
						? string
						: T extends Boolean
							? boolean
							// `Map`, `Set`, `RegExp`, `ArrayBuffer`, `SharedArrayBuffer`, and `DataView` all stringify to `{}`, because their properties are not enumerable. `ReadonlyMap`/`ReadonlySet` are covered here too, as they are the same as `Map`/`Set` at runtime.
							: T extends ReadonlyMap<any, any> | ReadonlySet<any> | RegExp | ArrayBuffer | SharedArrayBuffer | DataView
								? EmptyObject
								: T extends TypedArray
									// Bigint elements cannot be serialized, so only an empty bigint view can produce the resulting record.
									? Record<string, Jsonify<T[number]>>
									// A BigInt wrapper is unboxed before serialization, and both forms throw.
									: T extends NotJsonable | BigInt
										? never // Non-JSONable type union was found not empty
										: T extends UnknownArray
											? JsonifyList<UntagTuple<T>>
											: T extends object
												// An object without keys becomes `{}`. The homomorphic mapped type below would return a bare `object` as is, which is not assignable to `JsonValue`.
												? [keyof T] extends [never]
													? {}
													: JsonifyObject<UndefinedToOptional<{[Key in keyof T]: OmittedValueToUndefined<ToJsonResult<T[Key]>>}>> // JsonifyObject recursive call for its children
												: IsUnknown<T> extends true
													? JsonValue
													: never; // Otherwise any other non-object is removed

export {};

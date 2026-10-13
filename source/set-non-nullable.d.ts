import type {IsArrayReadonly} from './internal/index.d.ts';
import type {GreaterThanOrEqual} from './greater-than-or-equal.d.ts';
import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {IsAny} from './is-any.d.ts';

/**
Create a type that makes the given keys non-nullable, while keeping the remaining keys as is.

If no keys are given, all keys will be made non-nullable.

Note: Literal numeric keys are unsupported for arrays and tuples that start with a rest element, such as `string[]` or `[...string[], number]`. Use `number` or omit the keys to make all their elements non-nullable.

Use-case: You want to define a single model where the only thing that changes is whether or not some or all of the keys are non-nullable.

@example
```
import type {SetNonNullable} from 'type-fest';

type Foo = {
	a: number | null;
	b: string | undefined;
	c?: boolean | null;
};

// Note: In the following example, `c` can no longer be `null`, but it's still optional.
type SomeNonNullable = SetNonNullable<Foo, 'b' | 'c'>;
//=> {a: null | number; b: string; c?: boolean}

type AllNonNullable = SetNonNullable<Foo>;
//=> {a: number; b: string; c?: boolean}
```

@see {@link SetNullable}

@category Object
*/
export type SetNonNullable<BaseType, Keys extends KeysOfUnion<BaseType> = KeysOfUnion<BaseType>> =
	BaseType extends unknown // To distribute `BaseType` when it's a union type.
		? BaseType extends UnknownArray
			// A tuple is keyed by index, but a homomorphic mapped type is handed its elements under their string index, so a numeric `Keys` never matches. An array with elements before its rest element is walked with a counter instead, which turns each index into the same string `keyof` does. An array of unknown length goes through the mapped type, which reaches the element type directly.
			// `any` takes both branches of the array check, so its array branch is dropped to leave just the object branch.
			? IsAny<BaseType> extends true
				? never
				: '0' extends keyof BaseType
					? IsArrayReadonly<BaseType> extends true
						? Readonly<SetArrayNonNullable<BaseType, Keys>>
						: SetArrayNonNullable<BaseType, Keys>
					: {
						[Key in keyof BaseType]: Key extends Keys & keyof BaseType
							? NonNullable<BaseType[Key]>
							: BaseType[Key];
					}
			: {
				[Key in keyof BaseType]: Key extends Keys & keyof BaseType
					? NonNullable<BaseType[Key]>
					: BaseType[Key];
			}
		: never; // Should never happen

/**
A tuple is keyed by index, but a homomorphic mapped type is handed its elements under their string index, so a numeric `Keys` never matches. The tuple is walked with a counter instead, which turns each index into the same string `keyof` does.

An array of unknown length has no elements to walk, so its element type is compared against the keys at once, which is what the mapped type it replaces did.
*/
type SetArrayNonNullable<
	Array_ extends UnknownArray,
	Keys,
	Counter extends UnknownArray = [],
	Accumulator extends UnknownArray = [],
> = Array_ extends unknown // To distribute `Array_` when it's a union
	? '0' extends keyof Array_
		? Array_ extends readonly [(infer First)?, ...infer Rest]
			// Unlike the other array loops, this one has no `any` guard above it, so the check is wrapped in tuples to stop `any` from matching both branches.
			? [Array_] extends [readonly [unknown, ...unknown[]]]
				// A tuple allows fewer than one element only when its first element is optional, so the `?` is written in exactly this shape.
				? `${Counter['length']}` extends `${Keys & (string | number)}` // If the current index needs to be non-nullable
					? SetArrayNonNullable<Rest, Keys, [...Counter, any], [...Accumulator, NonNullable<First>]>
					: SetArrayNonNullable<Rest, Keys, [...Counter, any], [...Accumulator, First]>
				: `${Counter['length']}` extends `${Keys & (string | number)}`
					? SetArrayNonNullable<Rest, Keys, [...Counter, any], [...Accumulator, NonNullable<First>?]>
					: SetArrayNonNullable<Rest, Keys, [...Counter, any], [...Accumulator, First?]>
			: never // Should never happen, since `[(infer F)?, ...infer R]` is a top-type for arrays.
		// Exit if `Array_` is empty (e.g., []), or `Array_` contains no non-rest elements preceding the rest element (e.g., `[...string[]]` or `[...string[], string]`). A rest element is the type of every index from there on, so an index that lands in it makes the rest element non-nullable too. `number` is in `keyof` for a tuple that has one, so the default `Keys`, which is every key, matches here as well.
		: [
			...Accumulator,
			// An empty tuple has no rest element, so there is nothing to make non-nullable. The result of the key check is a union of a `true` and a `false` for every key of the tuple, so it is only false when no key at all reaches the rest element.
			...([Array_] extends [readonly []]
				? Array_
				: [RestReachesKey<Keys, Counter>] extends [false]
					? Array_
					// A homomorphic map keeps the rest element, the elements after it, and `readonly`.
					: {[Key in keyof Array_]: NonNullable<Array_[Key]>}),
		]
	: never; // Should never happen

/**
Whether any of the given keys is an index the rest element covers, which starts where the elements before it ran out. `number` is a key of a tuple that has a rest element, so the default `Keys`, which is every key, matches on the first arm.
*/
type RestReachesKey<Keys, Counter extends UnknownArray, Start extends number = Counter['length']> =
	Keys extends unknown // To distribute `Keys`, so each key is compared on its own
		? `${Keys & (string | number)}` extends `${infer Key extends number}`
			? number extends Key
				? true
				: GreaterThanOrEqual<Key, Start>
			: false
		: false;

export {};

import type {Except} from './except.d.ts';
import type {If} from './if.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {CallSignatureOf, HomomorphicPick, IsArrayReadonly, SimplifyObject} from './internal/index.d.ts';
import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Create a type that makes the given keys required, while keeping the remaining keys as is.

Use-case: You want to define a single model where the only thing that changes is whether or not some of the keys are required.

Note: This only removes the optional modifier, the same as the built-in `Required`. It does not remove `undefined` from the value type of a non-optional key, so `SetRequired<{a: number | undefined}, 'a'>` is `{a: number | undefined}`. Use `SetNonNullable` to remove `null` and `undefined` from the value type.

@example
```
import type {SetRequired} from 'type-fest';

type Foo = {
	a?: number;
	b: string;
	c?: boolean;
};

type SomeRequired = SetRequired<Foo, 'b' | 'c'>;
//=> {a?: number; b: string; c: boolean}

// Set specific indices in an array to be required.
type ArrayExample = SetRequired<[number?, number?, number?], 0 | 1>;
//=> [number, number, number?]
```

Known limitations:
- A key that lands after an optional element of a tuple is ignored. TypeScript rejects a required element that follows an optional one, so `[number?, number]` is not a tuple type, and the walk stops at the first optional element. `SetRequired<[number?, number?], 1>` is `[number?, number?]`, while naming both keys gives `[number, number]`. `SetRequiredDeep` answers the same way for a path that lands on such a key.
- A key that lands in a rest element is ignored, because a rest element has no optionality to remove: its elements are always present, and the `undefined` in a rest element of `Array<number | undefined>` is a value the element may hold rather than the element being absent. `SetRequired<[string, number?], 1>` is `[string, number]` because there the `?` is real optionality. `SetNonNullable` does make a rest element non-nullable, because that is a change to the value rather than to the optionality.
- Index keys are not supported on an array with extra members, such as a `Tagged` tuple, because the tuple is rebuilt from its elements. On an array, only index keys are supported, or only other keys. Other keys, such as `length`, make the result an object type.

@category Object
*/
export type SetRequired<BaseType, Keys extends KeysOfUnion<BaseType>> =
	// The call signature is rebuilt per member, so a union of callables does not mix their signatures.
	BaseType extends unknown
		? CallSignatureOf<BaseType> & _SetRequired<BaseType, Keys>
		: never;

type _SetRequired<BaseType, Keys> =
	BaseType extends UnknownArray
		// `any` takes both branches of the array check, so its array branch is dropped to leave just the object branch.
		? IsAny<BaseType> extends true
			? never
			// Returned as is, since rebuilding the array would drop non-index members, such as the tag of a `Tagged` array.
			: IsNever<Keys> extends true
				? BaseType
				// Only index keys are handled as tuple elements. Other keys, such as an extra property of an augmented array, take the object branch.
				: [Keys] extends [number | `${number}`]
					? SetArrayRequired<BaseType, Keys> extends infer ResultantArray
						? If<IsArrayReadonly<BaseType>, Readonly<ResultantArray>, ResultantArray>
						: never
					: _SetObjectRequired<BaseType, Keys>
		: _SetObjectRequired<BaseType, Keys>;

type _SetObjectRequired<BaseType, Keys> = SimplifyObject<
	// Pick just the keys that are optional from the base type.
	Except<BaseType, Keys & keyof BaseType>
	// Pick the keys that should be required from the base type and make them required.
	& Required<HomomorphicPick<BaseType, Keys & keyof BaseType>>
>;

/**
Remove the optional modifier from the specified keys in an array.
*/
type SetArrayRequired<
	TArray extends UnknownArray,
	Keys,
	Counter extends any[] = [],
	Accumulator extends UnknownArray = [],
> = TArray extends unknown // For distributing `TArray` when it's a union
	? '0' extends keyof TArray
		? TArray extends readonly [(infer First)?, ...infer Rest]
			// A tuple allows fewer than one element only when its first element is optional. Written in exactly this shape because equivalent ones, such as `[] extends TArray`, are several times slower.
			// Unlike the other array loops, this one has no `any` guard above it, so the check is wrapped in tuples to stop `any` from matching both branches.
			? [TArray] extends [readonly [unknown, ...unknown[]]]
				? SetArrayRequired<Rest, Keys, [...Counter, any], [...Accumulator, First]>
				: `${Counter['length']}` extends `${Keys & (string | number)}` // If the current index needs to be required
					? SetArrayRequired<Rest, Keys, [...Counter, any], [...Accumulator, First]>
					// If the current element is optional, but it doesn't need to be required,
					// then we can exit early, since no further elements can now be made required.
					: [...Accumulator, ...TArray]
			: never // Should never happen, since `[(infer F)?, ...infer R]` is a top-type for arrays.
		// Exit if `TArray` is empty (e.g., []), or
		// `TArray` contains no non-rest elements preceding the rest element (e.g., `[...string[]]` or `[...string[], string]`).
		: [...Accumulator, ...TArray]
	: never; // Should never happen

export {};

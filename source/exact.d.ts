import type {IsArrayOfUnknownLength, IsReadonlyProperty, KeyAliases, NormalizedKeys} from './internal/index.d.ts';
import type {PropertyValue} from './property-value.d.ts';
import type {RequireNone} from './require-none.d.ts';
import type {ArrayElement} from './array-element.d.ts';
import type {IsEqual} from './is-equal.d.ts';
import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {IsUnknown} from './is-unknown.d.ts';
import type {Primitive} from './primitive.d.ts';
import type {OmitIndexSignature} from './omit-index-signature.d.ts';
import type {PickIndexSignature} from './pick-index-signature.d.ts';
import type {MatchingKey} from './matching-key.d.ts';

/**
Apply `Exact` to each property of `ParameterType`, with the value of the same key in `InputType`.

The value is read from each member of `InputType` separately, because `keyof` of a union only has the keys that all members share. For an optional or nullable input like `{a: string} | undefined`, `keyof` is `never`, so the value would be `never`, and `Exact<…, never>` accepts no value.

Primitive members of `InputType` are skipped, because they have no properties to compare.
*/
type ExactProperties<ParameterType, InputType> = {
	// Primitive parameters pass through unchanged, so their input values do not need to be read or compared.
	[Key in keyof ParameterType]: [ParameterType[Key]] extends [Primitive]
		? ParameterType[Key]
		: Exact<ParameterType[Key], InputType extends Primitive ? never : PropertyValue<InputType, Key>>;
};

/**
Apply `Exact` to each key of `InputObject` that is not a declared key of `ParameterType`, with the value of the parameter's index signature for that key and the input value of that key.

Each key is checked with its own value. Checking all the values together, against the union of the values, makes the check grow with each value, and a generic value can make the check of every other value fail.

A key that no index signature of `ParameterType` matches gets `never`, like the excess keys in `ExactObject`.

The keys are optional, because a member of a union input can be without the key. Each key keeps the readonly modifier of the matching parameter property or index signature.

For an index signature key of a union input, like `string` in `Record<string, …> | {a: …}`, the values of the keys of each member that match it are read together, because `KeysOfUnion` gives only `string` for such a union. A generic value in such a union input can make the check of the other values fail (limitation).
*/
type ExactIndexSignatureProperties<ParameterType, InputObject, Properties = {
	[Key in KeysOfUnion<InputObject> as Key extends keyof OmitIndexSignature<ParameterType>
		? never
		: Key]?: Exact<PropertyValue<ParameterType, Key>, InputObject extends unknown ? PropertyValue<InputObject, Key> | InputObject[Extract<keyof InputObject, Key>] : never>;
}> = Readonly<Properties> & {
	// Writable properties override their readonly counterparts in the intersection.
	[Key in keyof Properties as IsReadonlyProperty<ParameterType, MatchingKey<ParameterType & object, Key>> extends true ? never : Key]: Properties[Key];
};

/**
Create a type from `ParameterType` and `InputType` and change keys exclusive to `InputType` to `never`.
- Generate a list of keys that exists in `InputType` but not in `ParameterType`.
- Mark these excess keys as `never`.
*/
type ExactObject<ParameterType, InputType, InputObject = Exclude<InputType, Primitive | Function | readonly unknown[]>> = ([keyof PickIndexSignature<ParameterType>] extends [never]
	// Without an index signature, each input key is a declared key or an excess key.
	? ExactProperties<ParameterType, InputType>
	// The index signatures are kept as they are, because the input keys they match are checked by `ExactIndexSignatureProperties`.
	: ExactProperties<OmitIndexSignature<ParameterType>, InputType>
		& PickIndexSignature<ParameterType>
		& ExactIndexSignatureProperties<ParameterType, InputObject>)
	// Only object members of the input are read, because the keys of a primitive or array member (like `length`), or of a callable member, are not excess keys of this object member.
	& Record<Exclude<keyof InputObject, ExactObjectKeys<ParameterType>>, never>
	// `KeysOfUnion` rather than `keyof`, because `keyof` of a union is the intersection of its members' keys, so a key only one member has would vanish and the member carrying it would be accepted.
	// Such a key is optional, because the members without it can be for another member of `ParameterType`, like `{a: 1} | {b: 1}` for `{a: number} | {b: number}`. Without `exactOptionalPropertyTypes`, this also accepts the key with an `undefined` value.
	& RequireNone<Exclude<KeysOfUnion<InputObject>, ExactObjectKeys<ParameterType>>>;

// Include aliases for declared keys, and the keys that TypeScript matches with an index signature, like number keys for a `string` index signature and numeric strings for a `number` one.
type ExactObjectKeys<Type> = NormalizedKeys<KeysOfUnion<Type>> | KeyAliases<keyof OmitIndexSignature<Type>>;

/**
Create a type that does not allow extra properties, meaning it only allows properties that are explicitly declared.

This is useful for function type-guarding to reject arguments with excess properties. Due to the nature of TypeScript, it does not complain if excess properties are provided unless the provided value is an object literal.

Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/12936) if you want to have this type as a built-in in TypeScript.

@example
```
type OnlyAcceptName = {name: string};

declare function onlyAcceptName(arguments_: OnlyAcceptName): void;

// TypeScript complains about excess properties when an object literal is provided.
// @ts-expect-error
onlyAcceptName({name: 'name', id: 1});
// `id` is excess

// TypeScript does not complain about excess properties when the provided value is a variable (not an object literal).
const invalidInput = {name: 'name', id: 1};
onlyAcceptName(invalidInput); // No errors
```

Having `Exact` allows TypeScript to reject excess properties.

@example
```
import type {Exact} from 'type-fest';

type OnlyAcceptName = {name: string};

declare function onlyAcceptNameImproved<T extends Exact<OnlyAcceptName, T>>(arguments_: T): void;

const invalidInput = {name: 'name', id: 1};
// @ts-expect-error
onlyAcceptNameImproved(invalidInput); // Compilation error
```

Note: A property value with a generic object type, like `Value extends {a: number}`, is rejected, because it can have extra properties. A generic primitive type is accepted.

Note: An excess property in an intersection of an index signature and an object, like `Record<string, {a: number}> & {b: {a: number; extra: true}}`, is not detected.

[Read more](https://stackoverflow.com/questions/49580725/is-it-possible-to-restrict-typescript-object-to-contain-only-properties-defined)

@category Utilities
*/
export type Exact<ParameterType, InputType> =
	// Before distributing, check if the two types are equal and if so, return the parameter type immediately
	IsEqual<ParameterType, InputType> extends true ? ParameterType
		// If the parameter is a primitive, return it as is immediately to avoid it being converted to a complex type
		: ParameterType extends Primitive ? ParameterType
			// If the parameter is an unknown, return it as is immediately to avoid it being converted to a complex type
			: IsUnknown<ParameterType> extends true ? unknown
				// If the parameter is a Function, return it as is because this type is not capable of handling function, leave it to TypeScript
				: ParameterType extends Function ? ParameterType
					: ParameterType extends readonly unknown[]
						? IsArrayOfUnknownLength<ParameterType> extends true
							// Convert union of array to array of union: A[] & B[] => (A & B)[]
							? ParameterType extends unknown[]
								? Array<Exact<ArrayElement<ParameterType>, ArrayElement<InputType>>>
								: ReadonlyArray<Exact<ArrayElement<ParameterType>, ArrayElement<InputType>>>
							// A tuple has fixed positions even when it includes a rest element, so map it position by position to keep its shape, its `readonly` and reject excess elements.
							: ExactProperties<ParameterType, InputType>
						: ExactObject<ParameterType, InputType>;

export {};

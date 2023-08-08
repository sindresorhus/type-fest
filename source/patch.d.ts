/**
Type function that accepts a record, recursively removes all optional property modifiers, and `undefined` (or whatever is passed as the second
argument) is added to the value at that property.

- Note that this replacement also occurs in all union types (this function is distributive).
- Also note that in non-optional union values that include `undefined`, `undefined` is not removed (undefined is only replaced for optional keys).

Optionally, providing the second parameter to `Patch` lets you specify the type to replace `undefined` with (otherwise it defaults to `undefined`).

Use-cases:

- JSON, for example, does not accept `undefined` as a value. If you need to send an object containing undefined over the wire, without a function
like `Patch`, you'd need to write that type by hand.

- Since JavaScript runtimes will implicitly insert `undefined` in the absence of a value, using `undefined` can create ambiguity (is this value
undefined because someone forgot to add a value, or because `undefined` was used specifically?).

@example
import type {Patch} from 'type-fest';

type TypeWithOptionalProps = {a?: 1; b: 2; c: 3 | undefined; d: {e?: 3}};
type TypeWithoutOptionals = Patch<TypeWithOptionalProps>;
//   ^? {a: 1 | undefined; b: 2; c: 3 | undefined; d: {e: 3 | undefined}}

type NestedUnionWithOptionalProps = {a?: {b?: 1} | {b?: 2}};
type NestedUnionWithoutOptionals = Patch<NestedUnionWithOptionalProps, null>;
//   ^? {a: null | {b: 1 | null} | {b: 2 | null}}

type TypeWithCustomReplacement = Patch<TypeWithOptionalProps, "yolo">;
//   ^? {a: 1 | "yolo"; b: 2; c: 3 | undefined; d: {e: 3 | "yolo"}}

@category Type
@category Object
*/
export type Patch<
	Type,
	Replacement = undefined,
> = ReplaceDeep<
	UndefinedToPlaceholderDeep<Type, Replacement>,
	Placeholder,
	undefined
>;

declare namespace Any {
	export type record = Record<symbol, any>;
	export type array = readonly any[];
}

/** @internal */
type Placeholder = typeof Placeholder;
/** @internal */
declare const Placeholder: unique symbol;

/**
 * This could probably be separated into its own module and exported
 */
type ReplaceDeep<
	Type,
	Find,
	Replace,
> = Type extends Find ? Replace
	: Type extends Record<symbol, any> ? { [Key in keyof Type]: ReplaceDeep<Type[Key], Find, Replace> }
	: Type extends readonly any[] ? { [Ix in keyof Type]: ReplaceDeep<Type[Ix], Find, Replace> }
	: Type
	;

/** @internal */
type UndefinedToPlaceholderDeep<
	Type,
	Replacement,
>
	= Type extends undefined ? Placeholder
	// Is `Type` a record?
	: Type extends Record<symbol, any>
	? {
		// Make the properties of `Type` required
		[Key in keyof Type]-?:
		// Visit each value recursively
		UndefinedToPlaceholderDeep<
			// Is `Key` optional in `Type`?
			{} extends Pick<Type, Key>
			// ...if yes, replace `undefined` with `null` in `Type[Key]` union
			? ReplaceUnionMember<Type[Key], undefined, Replacement>
			// ...otherwise just use `Type[Key]` when recursing
			: Type[Key],
			Replacement
		>
	}
	: Type
	;

/** @internal */
type ReplaceUnionMember<Union, Find, Replace> = Union extends Find ? Replace : Union;

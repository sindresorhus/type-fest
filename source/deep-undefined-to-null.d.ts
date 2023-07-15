/**
 * Type function that accepts a record, recursively removes all optional property modifiers, and in those properties' values replaces `undefined` with `null`.
 *
 * - Note that this replacement also occurs in all union types (this function is distributive).
 * - Also note that in non-optional union values that include `undefined`, `undefined` is not removed (undefined is only replaced for optional keys).
 *
 * Optionally, providing the second parameter to `DeepUndefinedToNull` lets you specify the type to replace `undefined` with (otherwise it defaults to null).
 *
 * Use-cases:
 *
 * - JSON, for example, does not accept `undefined` as a value. If you need to send an object containing undefined over the wire, without a function
 * like `DeepUndefinedToNull`, you'd need to write that type by hand.
 *
 * - Since JavaScript runtimes will implicitly insert `undefined` in the absence of a value, using `undefined` can create ambiguity (is this value
 * undefined because someone forgot to add a value, or because `undefined` was used specifically?).
 *
 * @example
 * import type {DeepUndefinedToNull} from 'type-fest';
 *
 * type TypeWithOptionalProps = {a?: 1; b: 2; c: 3 | undefined; d: {e?: 3}};
 * type TypeWithoutOptionals = DeepUndefinedToNull<TypeWithOptionalProps>;
 * //   ^? {a: 1 | null; b: 2; c: 3 | undefined; d: {e: 3 | null}}
 *
 * type NestedUnionWithOptionalProps = {a?: {b?: 1} | {b?: 2}};
 * type NestedUnionWithoutOptionals = DeepUndefinedToNull<NestedUnionWithOptionalProps>;
 * //   ^? {a: null | {b: 1 | null} | {b: 2 | null}}
 *
 * type TypeWithCustomReplacement = DeepUndefinedToNull<TypeWithOptionalProps, "yolo">;
 * //   ^? {a: 1 | "yolo"; b: 2; c: 3 | undefined; d: {e: 3 | "yolo"}}
 *
 * @category Type
 * @category Object
 */
export type DeepUndefinedToNull<
	Type,
	Replace = null,
> = DeepReplace<DeepUndefinedToPlaceholder<Type, Replace>, Placeholder, undefined>;

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
type DeepReplace<
	Type,
	Find,
	Replace,
> = Type extends Type
	? Type extends Find
	? Replace
	: Type extends Any.record
	? { [Key in keyof Type]: DeepReplace<Type[Key], Find, Replace> }
	: Type extends Any.array
	? { [Ix in keyof Type]: DeepReplace<Type[Ix], Find, Replace> }
	: Type
	: never;

type ReplaceUnionMember<
	Union,
	Find,
	Replace,
> = Union extends Union
	? Union extends Find
	? Replace
	: Union
	: never;

/** @internal */
type DeepUndefinedToPlaceholder<
	Type,
	Replace,
>
	/**
	 * `Type extends Type` distributes `Type`, so for the rest of this
	 * function `Type` refers to the individual member of the union,
	 * rather than the union itself
	 */
	= Type extends Type
	/**
	 * Does this member of the union extend `undefined`? Replace it in
	 * the union it belongs to as `Placeholder`
	 */
	? Type extends undefined
	? Placeholder
	/**
		 * Is `Type` a record?
	 */
	: Type extends Record<symbol, any>
	? {
		/**
		 * Make the properties of `Type` required
		 */
		[Key in keyof Type]-?:
		/**
		 * Traverse each value recursively
		 */
		DeepUndefinedToPlaceholder<
			/**
			 * Is `Key` optional in `Type`?
			 */
			{} extends Pick<Type, Key>
			/**
			 * ...if yes, replace `undefined` with `null` in `Type[Key]` union
			 */
			? ReplaceUnionMember<Type[Key], undefined, Replace>
			/**
			 * ...otherwise just use `Type[Key]` when recursing
			 */
			: Type[Key]
			, Replace
		>
	}
	: Type
	: never;

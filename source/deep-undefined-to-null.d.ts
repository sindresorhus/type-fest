type TempPlaceholder = typeof TempPlaceholder
declare const TempPlaceholder: unique symbol

export type DeepReplace<
	BaseType,
	Find,
	Replace,
>
	= BaseType extends BaseType ? BaseType extends Find ? Replace
	: BaseType extends Record<symbol, any> ? { [k in keyof BaseType]: DeepReplace<BaseType[k], Find, Replace> }
	: BaseType extends readonly any[] ? { [ix in keyof BaseType]: DeepReplace<BaseType[ix], Find, Replace> }
	: BaseType
	: never

type ReplaceUnionMember<
	BaseType,
	Find,
	Replace
>
	= BaseType extends BaseType
	? BaseType extends Find
	? Replace
	: BaseType
	: never

type DeepUndefinedToNull_<
	BaseType,
	Replace
>
	= BaseType extends BaseType ? BaseType extends undefined ? TempPlaceholder
	: BaseType extends Record<symbol, any>
	? { [k in keyof BaseType]-?: DeepUndefinedToNull_<{} extends Pick<BaseType, k> ? ReplaceUnionMember<BaseType[k], undefined, Replace> : BaseType[k], Replace> }
	: BaseType
	: never

type DeepUndefinedToNull<
	BaseType,
	Replace = null
>
	= DeepReplace<
		DeepUndefinedToNull_<
			BaseType,
			Replace
		>,
		TempPlaceholder,
		undefined
	>


// /**
//  * Type function that accepts a record, recursively removes all optional property modifiers, and in those properties' values replaces `undefined` with `null`.
//  *
//  * Optionally, providing the second parameter to `DeepUndefinedToNull` lets you specify the type to replace `undefined` with.
//  *
//  * Use-case:
//  *
//  * JSON, for example, does not accept `undefined` as a value. If you need to send an object containing undefined over the wire, without a function
//  * like `DeepUndefinedToNull`, you'd need to write that type by hand.
//  *
//  * Also, since JavaScript runtimes will implicitly insert `undefined` in the absence of a
//  * value, using `undefined` can create ambiguity (is this value undefined because someone forgot to add a value, or because `undefined` was used specifically?).
//  *
//  * @example
//  * import type {DeepUndefinedToNull} from 'type-fest';
//  * type TypeWithOptionalProps = {a?: 1; b: 2; c: 3 | undefined; d: {e?: 3}};
//  * type TypeWithNullReplaced = DeepUndefinedToNull<TypeWithOptionalProps>;
//  * //   ^? { a: 1 | null; b: 2; c: 3 | undefined; d: { e: 3 | null }}
//  *
//  * @category Type
//  * @category Object
//  */
// export type DeepUndefinedToNull___<
// 	BaseType extends AnyRecord,
// 	Replacement = null,
// > =
// 	/**
// 	 * Any type unioned with `never` is an identity for that type; the reason we add it
// 	 * here is because it "forces" the TypeScript LSP to evaluate it, showing the full type
// 	 */
// 	| never // eslint-disable-line @typescript-eslint/no-redundant-type-constituents
// 	| {
// 		[Key in keyof Required<BaseType>]:
// 		/**
// 		 * Here we check if the original record at this key was optional, so we
// 		 * don't forget to union the value with `Replacement` when recursing
// 		 */
// 		Required<BaseType>[Key] extends AnyRecord
// 		? undefined extends BaseType[Key]
// 		? Required<BaseType>[Key] extends any ? Replacement | DeepUndefinedToNull<Required<BaseType>[Key]> : never
// 		: Required<BaseType>[Key] extends any ? DeepUndefinedToNull<Required<BaseType>[Key]> : never
// 		: Key extends OptionalKeysOf<BaseType>
// 		? Exclude<BaseType, undefined>[Key] extends any ? Replacement | Exclude<BaseType[Key], undefined> : never
// 		: Key extends RequiredKeysOf<BaseType>
// 		? BaseType[Key]
// 		: never
// 	};

// /**
//  * Here we declare an intermediate type variable called `Value` so we don't perform the
//  * same lookup again and and (and so we don't have to keep typing the whole thing out).
//  * Prepending the type variable with `|` calls attention to the new identifier.
//  */

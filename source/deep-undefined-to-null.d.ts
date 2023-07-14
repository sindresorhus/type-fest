import type {OptionalKeysOf} from './optional-keys-of';
import type {RequiredKeysOf} from './required-keys-of';

/** Any record is assignable to `AnyRecord`, but arrays are not. */
type AnyRecord = Record<symbol, unknown>;

/**
 * Type function that accepts a record, recursively removes all optional property modifiers, and in those properties' values replaces `undefined` with `null`.
 *
 * Optionally, providing the second parameter to `DeepUndefinedToNull` lets you specify the type to replace `undefined` with.
 *
 * Use-case:
 *
 * JSON, for example, does not accept `undefined` as a value. If you need to send an object containing undefined over the wire, without a function
 * like `DeepUndefinedToNull`, you'd need to write that type by hand.
 *
 * Also, since JavaScript runtimes will implicitly insert `undefined` in the absence of a
 * value, using `undefined` can create ambiguity (is this value undefined because someone forgot to add a value, or because `undefined` was used specifically?).
 *
 * @example
 * import type {DeepUndefinedToNull} from 'type-fest';
 * type TypeWithOptionalProps = {a?: 1; b: 2; c: 3 | undefined; d: {e?: 3}};
 * type TypeWithNullReplaced = DeepUndefinedToNull<TypeWithOptionalProps>;
 * //   ^? { a: 1 | null; b: 2; c: 3 | undefined; d: { e: 3 | null }}
 *
 * @category Type
 * @category Object
 */
export type DeepUndefinedToNull<
	BaseType extends AnyRecord,
	Replacement = null,
> =
  /**
	 * Any type unioned with `never` is an identity for that type; the reason we add it
	 * here is because it "forces" the TypeScript LSP to evaluate it, showing the full type
	 */
	| never // eslint-disable-line @typescript-eslint/no-redundant-type-constituents
	| {
		[Key in keyof Required<BaseType>]:
		Required<BaseType>[Key] extends AnyRecord
			? undefined extends BaseType[Key]
				? Replacement | DeepUndefinedToNull<Exclude<Required<BaseType>[Key], undefined>>
				: DeepUndefinedToNull<Exclude<Required<BaseType>[Key], undefined>>
			: Key extends OptionalKeysOf<BaseType>
				? Replacement | Exclude<BaseType[Key], undefined>
				: Key extends RequiredKeysOf<BaseType>
					? BaseType[Key]
					: never
	};

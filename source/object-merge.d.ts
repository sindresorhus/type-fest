import type {If} from './if.d.ts';
import type {StringToNumber, ToString} from './internal/string.d.ts';
import type {IsExactOptionalPropertyTypesEnabled} from './internal/type.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {IsOptionalKeyOf} from './is-optional-key-of.d.ts';
import type {OmitIndexSignature} from './omit-index-signature.d.ts';
import type {PickIndexSignature} from './pick-index-signature.d.ts';
import type {RequiredKeysOf} from './required-keys-of.d.ts';
import type {Simplify} from './simplify.d.ts';

/**
@category Object
*/
export type ObjectMerge<First, Second> = First extends unknown // For distributing `First`
	? Second extends unknown // For distributing `Second`
		? _ObjectMerge<
			First & object,
			Second & object,
			NormalizedLiteralKeys<First>,
			NormalizedLiteralKeys<Second>,
			IsExactOptionalPropertyTypesEnabled extends true ? Required<First> : First,
			IsExactOptionalPropertyTypesEnabled extends true ? Required<Second> : Second
		>
		: never // Should never happen
	: never; // Should never happen

type _ObjectMerge<
	First extends object,
	Second extends object,
	NormalizedFirstLiteralKeys,
	NormalizedSecondLiteralKeys,
	NormalizedFirst extends object,
	NormalizedSecond extends object,
> = Simplify<{
	// Map over literal keys of `Second`, except those that are optional and also present in `First`.
	[P in keyof Second as P extends NormalizedSecondLiteralKeys
		? P extends NormalizedFirstLiteralKeys
			? If<IsOptionalKeyOf<Second, P>, never, P>
			: P
		: never]:
			| Second[P]
			| (P extends NormalizedKeys<keyof PickIndexSignature<First>>
				? If<IsOptionalKeyOf<Second, P>, First[NormalizedKeys<P> & keyof First], never>
				: never)
} & {
	// Map over literal keys of `First`, except those that are not present in `Second`.
	[P in keyof First as P extends NormalizedFirstLiteralKeys
		? P extends NormalizedSecondLiteralKeys
			? never
			: P
		: never]:
			| First[P]
				// If there's a matching index signature in `Second`, then add the type for it as well,
				// for example, in `Merge<{a: string}, {[x: string]: number}>`, `a` is of type `string | number`.
			| (P extends NormalizedKeys<keyof Second>
				? Second[NormalizedKeys<P> & keyof Second]
				: never);
} & {
	// Map over non-literal keys of `Second`.
	[P in keyof Second as P extends NormalizedSecondLiteralKeys ? never : P]:
		| Second[P]
			// If there's a matching key in `First`, then add the type for it as well,
			// for example, in `Merge<{a: number}, {[x: string]: string}>`,
			// the resulting type is `{[x: string]: number | string; a: number | string}`.
			// But, exclude keys from `First` that would surely get overwritten,
			// for example, in `Merge<{a: number}, {[x: string]: string; a: string}>`,
			// `a` from `First` would get overwritten by `a` from `Second`, so don't add type for it.
		| (NormalizedKeys<P> & Exclude<keyof First, NormalizedKeys<RequiredKeysOf<OmitIndexSignature<Second>>>> extends infer NonOverwrittenKeysOfFirst
			? If<IsNever<NonOverwrittenKeysOfFirst>, // This check is required because indexing with `never` doesn't always yield `never`, for example, `{[x: string]: number}[never]` results in `number`.
				never,
				NormalizedFirst[NonOverwrittenKeysOfFirst & keyof NormalizedFirst]>
			: never); // Should never happen
} & {
	// Map over non-literal keys of `First`
	[P in keyof First as P extends NormalizedFirstLiteralKeys ? never : P]:
		| First[P]
		| If<IsNever<NormalizedKeys<P> & keyof Second>, // This check is required because indexing with `never` doesn't always yield `never`, for example, `{[x: string]: number}[never]` results in `number`.
			never,
			NormalizedSecond[NormalizedKeys<P> & keyof NormalizedSecond]>;
} & {
	// Handle optional keys of `Second` that are also present in `First`.
	// Map over `First` instead of `Second` because the modifier is in accordance with `First`.
	[P in keyof First as P extends NormalizedFirstLiteralKeys
		? P extends NormalizedSecondLiteralKeys
			? If<IsOptionalKeyOf<Second, NormalizedKeys<P> & keyof Second>, P, never>
			: never
		: never]:
			| First[P]
			| NormalizedSecond[NormalizedKeys<P> & keyof NormalizedSecond]
}>;

type NormalizedKeys<Keys extends PropertyKey> =
	| Keys
	| (string extends Keys ? number : never)
	| StringToNumber<Keys & string>
	| ToString<Keys & number>;

type NormalizedLiteralKeys<Type> = Type extends unknown // For distributing `Type`
	? NormalizedKeys<keyof OmitIndexSignature<Type>>
	: never; // Should never happen

export {};

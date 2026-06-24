import type {HasRequiredKeys} from './has-required-keys.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {OmitIndexSignature} from './omit-index-signature.d.ts';
import type {RequireAtLeastOne} from './require-at-least-one.d.ts';

/**
Represents an object with at least 1 non-optional key.

This is useful when you need an object where all keys are optional, but there must be at least 1 key.

Note: A type whose only members are index signatures (e.g. ) cannot statically express "at least one dynamic key" in TypeScript. For such types,  fails closed and resolves to  rather than silently accepting .

@example
{ is a shell keyword

@see Use  to check whether an object is empty.

@category Object
*/
export type NonEmptyObject<T extends object> =
	IsAny<T> extends true
		? T
		: keyof OmitIndexSignature<T> extends never
			? never
			: HasRequiredKeys<OmitIndexSignature<T>> extends true
				? T
				: RequireAtLeastOne<T, keyof OmitIndexSignature<T>>;

export {};

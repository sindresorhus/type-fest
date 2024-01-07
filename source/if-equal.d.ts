import type {IsEqual} from './is-equal';

/**
 * An if-else-like type that resolves depending on whether the two given types are equal.
 *
 * @see {@link IsEqual}
 *
 * @example
 * ```
 * import type {IfEqual} from 'type-fest';
 *
 * type Result1 = IfEqual<string, string, 'Equal', 'NotEqual'>;
 * //=> 'Equal'
 *
 * type Result2 = IfEqual<string, number, 'Equal', 'NotEqual'>;
 * //=> 'NotEqual'
 * ```
 *
 * @category Type Guard
 * @category Utilities
 */
export type IfEqual<A, B, TypeIfEqual = true, TypeIfNotEqual = false> = (
    IsEqual<A, B> extends true ? TypeIfEqual : TypeIfNotEqual
);

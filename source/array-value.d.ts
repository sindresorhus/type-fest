import type {IterableElement} from './iterable-element';
/**
 * Get a union of all the possible array/tuple values, with improved readability.
 * This type is useful when you want to extract all the possible element types of an array.
 *
 * It is advised that one uses other, built in language methods where applicable, e.g:
 * ```ts
 * const foo: string[] = [];
 * type Value = typeof foo[number]; // => string
 * ```
 *
 * The creation of this type was discussed here - {@link https://github.com/sindresorhus/type-fest/issues/271}
 *
 * @category Array
 *
 * @example
 * ```ts
 * const foo: Array<(string | boolean)> = [];
 * type ValueFoo = ArrayValue<typeof foo>; // => string | boolean
 *
 * type Bar = {dataPoint: number, timestamp: number}[];
 * type ValueBar = ArrayValue< Bar>; // => {dataPoint: number, timestamp: number}
 *```
 *
 */
export type ArrayValue<TArray extends unknown[]> = IterableElement<TArray>;

import {Split} from './utilities';
import {Integers} from '../source/utilities';

/**
 * Gets a deeply-nested property from an object, like lodash's `get` method.
 *
 * Use-case: retrieve a property from deep inside an API response or other complex object.
 *
 * @example
 * import { Get } from 'type-fest'
 *
 * interface ApiResponse {
 *   hits: {
 *     hits: Array<{
 *       _id: string
 *       _source: {
 *         name: Array<{
 *           given: string[]
 *           family: string
 *         }>
 *         birthDate: string
 *       }
 *     }>
 *   }
 * }
 *
 * type Name = Get<ApiResponse, 'hits.hits[0]._source.name'> // Array<{ given: string[]; family: string }>
 *
 * @explanation
 *
 * This works by first splitting the path based on `.` and `[...]` characters into a tuple of string keys.
 * Then it recursively uses the head key to get the next property of the current object, until there are no keys
 * left. Number keys extract the item type from arrays, or are converted to strings to extract types from tuples
 * and dictionaries with number keys.
 */
export type Get<Object, Path extends string> = GetWithPath<Object, ToPath<Path>>;

/**
 * Like @see Get but receives an array of strings as a path parameter.
 */
type GetWithPath<T, Keys extends string[]> =
  Keys extends []
  ? T
  : Keys extends [infer Head, ...infer Tail]
  ? GetWithPath<PropertyOf<T, Extract<Head, string>>, Extract<Tail, string[]>>
  : never;

type ToPath<S extends string> = Split<FixPathSquareBrackets<S>, '.'>;

type FixPathSquareBrackets<S extends string> =
  S extends `${infer T}[${infer U}]${infer V}`
  ? `${T}.${U}${FixPathSquareBrackets<V>}`
  : S;

type ConsistsOnlyOf<S extends string, C extends string> =
  S extends ''
  ? true
  : S extends `${C}${infer Tail}`
  ? ConsistsOnlyOf<Tail, C>
  : false;

type IsInteger<S extends string> = ConsistsOnlyOf<S, Integers>;

type WithStringKeys<T extends Record<string | number, any>> = {
  [K in `${Extract<keyof T, string | number>}`]: T[K]
};

/**
 * Get a property of an object or array. Works when indexing arrays using number-literal-strings, e.g. `PropertyOf<number[], '0'>  = number`,
 * and when indexing objects with number keys.
 * Returns `never` if `Key` is not a property of `Object`,
 */
type PropertyOf<Object, Key extends string> =
  Key extends keyof Object
  ? Object[Key]
  : Object extends Array<infer Item>
  ? IsInteger<Key> extends true
  ? Item
  : never
  : Key extends keyof WithStringKeys<Object>
  ? WithStringKeys<Object>[Key]
  : never;

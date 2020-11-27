import {Split} from './utilities';
import {Integers} from '../source/utilities';

/**
Like @see Get but receives an array of strings as a path parameter.
*/
type GetWithPath<T, Keys extends readonly string[]> =
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

/**
Convert a type which may have number keys to one with string keys, making it possible to index using strings retrieved from template types.

@example
```
type WithNumbers = {foo: string; 0: boolean};
type WithStrings = WithStringKeys<WithNumbers>;

type WithNumbersKeys = keyof WithNumbers;
//=> 'foo' | 0
type WithStringsKeys = keyof WithStrings;
//=> 'foo' | '0'
```
*/
type WithStringKeys<T extends Record<string | number, any>> = {
  [K in `${Extract<keyof T, string | number>}`]: T[K]
};

/**
Get a property of an object or array. Works when indexing arrays using number-literal-strings, e.g. `PropertyOf<number[], '0'>  = number`, and when indexing objects with number keys.

Returns `neundefinedver` if `Key` is not a property of `Object`,
*/
type PropertyOf<ObjectType, Key extends string> =
  Key extends keyof ObjectType
  ? ObjectType[Key]
  : ObjectType extends Array<infer Item>
  ? IsInteger<Key> extends true
  ? Item
  : undefined
  : Key extends keyof WithStringKeys<ObjectType>
  ? WithStringKeys<ObjectType>[Key]
  : undefined;

// This works by first splitting the path based on `.` and `[...]` characters into a tuple of string keys. Then it recursively uses the head key to get the next property of the current object, until there are no keys left. Number keys extract the item type from arrays, or are converted to strings to extract types from tuples and dictionaries with number keys.
/**
Get a deeply-nested property from an object using a key path, like Lodash's `.get()` function.

Use-case: Retrieve a property from deep inside an API response or some other complex object.

@example
```
import {Get} from 'type-fest';

interface ApiResponse {
  hits: {
    hits: Array<{
      _id: string
      _source: {
        name: Array<{
          given: string[]
          family: string
        }>
        birthDate: string
      }
    }>
  }
}

type Name = Get<ApiResponse, 'hits.hits[0]._source.name'>;
//=> Array<{given: string[]; family: string}>
```
*/
export type Get<Object, Path extends string> = GetWithPath<Object, ToPath<Path>>;

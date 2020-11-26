/**
 * Targets a property from a nested object using a dot path.
 *
 * Use case: Extracting a given value from a complex API requests that is otherwise non-essential outside that value.
 *
 * @see KeyPath
 * @example
 * declare function get<T, P extends KeyPath<T>>(obj: T, path: P): PathValue<T, P>;
 * const user = {
 *   firstName: 'Foo',
 *   lastName: 'Bar',
 *   projects: [
 *     { name: 'Baz', contributors: 68 },
 *     { name: 'Waldo', contributors: 12 },
 *   ]
 * };
 *
 * get(user, 'projects.0.name');
 */
export type PathValue<ObjectType, PathType extends KeyPath<ObjectType>> =
  P extends `${infer KeyType}.${infer Rest}`
  ? KeyType extends keyof ObjectType
    ? Rest extends KeyPath<ObjectType[KeyType]>
      ? PathValue<ObjectType[KeyType], Rest>
      : never
    : never
  : PathType extends keyof ObjectType
    ? ObjectType[PathType]
    : never;

/**
 * Represents a dot path to a nested object property.
 *
 * Use case: to be used in any helper function that extracts values based on a string dot path, like [lodash.get](https://lodash.com/docs/#get) or [dot-prop](https://github.com/sindresorhus/dot-prop).
 *
 * @see PathValue
 * @example
 * declare function get<T, P extends KeyPath<T>>(obj: T, path: P): PathValue<T, P>;
 * const user = {
 *   firstName: 'Foo',
 *   lastName: 'Bar',
 *   projects: [
 *     { name: 'Baz', contributors: 68 },
 *     { name: 'Waldo', contributors: 12 },
 *   ]
 * };
 *
 * get(user, 'projects.0.name');
 */
export type KeyPath<ObjectType> =
  ImpliedPath<ObjectType> extends string | keyof ObjectType
      ? ImpliedPath<ObjectType>
      : keyof ObjectType;

type ImpliedPath<ObjectType> = ImpliedPathDeep<ObjectType, keyof ObjectType> | keyof ObjectType;

type ImpliedPathDeep<ObjectType, KeyType extends keyof ObjectType> =
    KeyType extends string
        ? ObjectType[KeyType] extends Record<string, any>
            ?
                | `${KeyType}.${ImpliedPathDeep<ObjectType[KeyType], Exclude<keyof ObjectType[KeyType], keyof any[]>> & string}`
                | `${KeyType}.${Exclude<keyof ObjectType[KeyType], keyof any[]> & string}`
            : never
        : never;

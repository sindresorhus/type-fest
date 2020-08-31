// `Map` Helpers
type MapKey<BaseType> = BaseType extends Map<infer KeyType, unknown> ? KeyType : never;
type MapValue<BaseType> = BaseType extends Map<unknown, infer KeyType> ? KeyType : never;

// `Entry` Helpers
type ArrayEntry<BaseType extends readonly unknown[]> = [number, BaseType[number]];
type MapEntry<BaseType> = [MapKey<BaseType>, MapValue<BaseType>];
type ObjectEntry<BaseType> = [keyof BaseType, BaseType[keyof BaseType]];
type SetEntry<BaseType> = BaseType extends Set<infer ItemType> ? [ItemType, ItemType] : never;

/**
Many collections have a `.entries()` method that will return an enumerable array of that structure's keys and values.  The `Entry` type will return the type of that collection's entry give the type itself.

For example the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries|`Object`}, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries|`Map`}, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries|`Array`}, and {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/entries|`Set`}
collections all have this method.  Note that since `WeakMap` and `WeakSet` do not have this method because they are not enumerable.

@see `Entries` if you want to just access the type of the array of entries (which is the return of the `.entries()` method).

@example
```
// Objects
const objectExample = { a: 1 };
const objectEntry: Entry<typeof objectExample> = ['a', 1];

// Maps
const mapExample = new Map([['a', 1]]);
const mapEntry: Entry<typeof map> = ['a', 1];

// Arrays
const arrayExample = ['a', 1];
const arrayEntryString: Entry<typeof arrayExample> = [0, 'a'];
const arrayEntryNumber: Entry<typeof arrayExample> = [1, 1];

// Sets
const setExample = new Set(['a', 1]);
const setEntryString: Entry<typeof setExample> = ['a', 'a'];
const setEntryNumber: Entry<typeof setExample> = [1, 1];
```
*/
export type Entry<BaseType> =
    BaseType extends Map<unknown, unknown> ? MapEntry<BaseType>
  : BaseType extends Set<unknown> ? SetEntry<BaseType>
  : BaseType extends unknown[] ? ArrayEntry<BaseType>
  : BaseType extends object ? ObjectEntry<BaseType>
  : never;

// `Entries` Helpers
type ArrayEntries<BaseType extends readonly unknown[]> = Array<ArrayEntry<BaseType>>;
type MapEntries<BaseType> = Array<MapEntry<BaseType>>;
type ObjectEntries<BaseType> = Array<ObjectEntry<BaseType>>;
type SetEntries<BaseType extends Set<unknown>> = Array<SetEntry<BaseType>>;

/**
Many collections have a `.entries()` method that will return an enumerable array of that structure's keys and values.  The `Entries` type will return the type of that collection's entries give the type itself.

For example the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries|`Object`}, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries|`Map`}, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries|`Array`}, and {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/entries|`Set`}
collections all have this method.  Note that since `WeakMap` and `WeakSet` do not have this method because they are not enumerable.

@see `Entry` if you want to just access the type of a single entry.

@example
```
// Objects
const objectExample = { a: 1 };
const objectEntries: Entries<typeof objectExample> = [['a', 1]];

// Maps
const mapExample = new Map([['a', 1]]);
const mapEntries: Entries<typeof map> = [['a', 1]];

// Arrays
const arrayExample = ['a', 1];
const arrayEntries: Entries<typeof arrayExample> = [[0, 'a'], [1, 1]];

// Sets
const setExample = new Set(['a', 1]);
const setEntries: Entries<typeof setExample> = [['a', 'a'], [1, 1]];
```
*/
export type Entries<BaseType> =
    BaseType extends Map<unknown, unknown> ? MapEntries<BaseType>
  : BaseType extends Set<unknown> ? SetEntries<BaseType>
  : BaseType extends unknown[] ? ArrayEntries<BaseType>
  : BaseType extends object ? ObjectEntries<BaseType>
  : never;

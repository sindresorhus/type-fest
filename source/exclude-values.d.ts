import type {ConditionalExcept} from './conditional-except.d.ts'; // For `@link`
import type {NonNullableDeep} from './non-nullable-deep.d.ts'; // For `@link`
import type {RequiredNonNullable} from './required-non-nullable.d.ts'; // For `@link`
import type {SubstituteDeep} from './substitute-deep.d.ts'; // For `@link`
import type {FilterValues} from './internal/index.d.ts';
import type {ExtractValues} from './extract-values.d.ts'; // For `@link`
import type {Falsy} from './falsy.d.ts'; // For `@link`

/**
Exclude the given type from the value of every property in an object type, or every element in an array type.

It works like `Exclude` on each value. A property or element whose value type is fully excluded is removed. Use {@link ExtractValues} to keep only the given type instead.

Use-cases:
- Normalizing types from external sources, like removing `undefined` from a `Partial` after defaults are applied.
- Cleaning `null` from database rows and API responses.

@example
```
import type {ExcludeValues} from 'type-fest';

type Foo = {
	foo: number | null;
	bar?: string;
	baz: undefined;
};

type WithoutUndefined = ExcludeValues<Foo, undefined>;
//=> {foo: number | null; bar?: string}

type WithoutUndefinedOrNull = ExcludeValues<Foo, undefined | null>;
//=> {foo: number; bar?: string}
```

Note: The optional and `readonly` modifiers are preserved, because an optional property can still be absent even when its value can no longer be `undefined`. An optional property is removed when its declared value is fully excluded, while a property that also explicitly declares `undefined` is kept with an `undefined` value. To require every key, wrap the result in `Required`: `Required<ExcludeValues<Foo, undefined>>` is `{foo: number | null; bar: string}`.

@example
```
import type {ExcludeValues} from 'type-fest';

type DbUser = {
	id: number;
	name: string | null;
	email: string | null;
};

type User = ExcludeValues<DbUser, null>;
//=> {id: number; name: string; email: string}
```

Matching uses assignability, like `Exclude`: excluding `string` also removes a `'unicorn'` value, and an `ExcludedType` of `never` changes nothing.

@example
```
import type {ExcludeValues} from 'type-fest';

type Example = ExcludeValues<{a: string | undefined; b?: undefined}, undefined>;
//=> {a: string}

type ArrayExample = ExcludeValues<Array<string | undefined>, undefined>;
//=> string[]

type TupleExample = ExcludeValues<[string, number | undefined, undefined?], undefined>;
//=> [string, number]
```

Use {@link Falsy} to remove the falsy values, like `.filter(Boolean)`:

@example
```
import type {ExcludeValues, Falsy} from 'type-fest';

type Truthy = ExcludeValues<[0, 'a', '', null, 1, boolean], Falsy>;
//=> ['a', 1, true]
```

Note: This works on types, not values. An element that is a union keeps its remaining members, so `ExcludeValues<[1 | 'a'], string>` is `[1]`, even though filtering `['a']` at runtime gives `[]`.

@see {@link ConditionalExcept} to remove keys matching a condition without touching the remaining values.
@see {@link NonNullableDeep} or {@link RequiredNonNullable} to strip only `null` and `undefined`, deeply or while removing the optional modifier.
@see {@link SubstituteDeep} to replace a type with another type, deeply.
@see https://github.com/sindresorhus/type-fest/issues/462

Known limitations:
- Only the top level is checked, so a nested value keeps the excluded type.
- A generic `Base` is not assignable to the result.
- Call and construct signatures are dropped, like with `Pick`.
- Intersections are flattened by the mapped type.
- An object with no property left becomes `{}`, which accepts any non-null value.
- `Map`, `Set`, `Promise`, and similar types are treated as plain objects: their methods are kept as is, so their inner values are not stripped. Use {@link SubstituteDeep} for those.

@category Object
@category Array
*/
export type ExcludeValues<Base extends object, ExcludedType> = FilterValues<Base, ExcludedType, 'exclude'>;

export {};

import type {FilterValues} from './internal/index.d.ts';
import type {ConditionalPick} from './conditional-pick.d.ts'; // For `@link`
import type {ExcludeValues} from './exclude-values.d.ts'; // For `@link`

/**
Extract the given type from the value of every property in an object type, or every element in an array type.

It works like `Extract` on each value. A property or element whose value type has no matching member is removed. It is the counterpart of {@link ExcludeValues}.

Use-cases:
- Get the elements of a tuple that match a type, like the numbers in a list of mixed values.
- Pick the properties of an object by the type of their values, and narrow union values to the matching members.

@example
```
import type {ExtractValues} from 'type-fest';

type A = ExtractValues<[1, 'a', 2, 'b'], number>;
//=> [1, 2]

type B = ExtractValues<readonly [string, number?, ...boolean[]], number | boolean>;
//=> readonly [number?, ...boolean[]]

type C = ExtractValues<Array<string | number>, number>;
//=> number[]

type D = ExtractValues<[1 | 'a', 2, 'b'], number>;
//=> [1, 2]
```

@example
```
import type {ExtractValues} from 'type-fest';

type User = {
	id: number;
	name: string;
	nickname?: string;
	contact: string | {email: string};
	isAdmin: boolean;
};

type StringProperties = ExtractValues<User, string>;
//=> {name: string; nickname?: string; contact: string}
```

Matching uses assignability, like `Extract`: a member of a value type is kept only when it is assignable to the given type. A wide type is not narrowed, so `ExtractValues<string[], 'a'>` is `[]`, while `.filter((value): value is 'a' => value === 'a')` gives `'a'[]`. An `ExtractedType` of `unknown` changes nothing, and `never` removes everything.

Use {@link ExcludeValues} with `Falsy` to remove the falsy values, like `.filter(Boolean)`.

Note: The optional and `readonly` modifiers are preserved. An optional property or element is removed when its declared value has no matching member.

@see {@link ConditionalPick} to pick the keys whose whole value type matches a condition, without narrowing the values.

Known limitations:
- Only the top level is checked, so a nested value is not narrowed.
- A generic `Base` is not assignable to the result.
- Call and construct signatures are dropped, like with `Pick`.
- Intersections are flattened by the mapped type.
- An object with no property left becomes `{}`, which accepts any non-null value.

@category Object
@category Array
*/
export type ExtractValues<Base extends object, ExtractedType> = FilterValues<Base, ExtractedType, 'extract'>;

export {};

import type {UnknownArray} from './unknown-array.d.ts';
import type {UnknownMap} from './unknown-map.d.ts';
import type {UnknownSet} from './unknown-set.d.ts';

/**
Matches an array, map, or set, including readonly and weak variants.

Use as a constraint or to select collection members from a union without specifying their element, key, or value types. Tuples are included.

Matching is structural, so custom types with a compatible collection interface are included. Typed arrays and types that are only array-like or iterable are not included. Weak collections are included, so this type does not guarantee iteration or a `size` property.

@example
```
import type {UnknownCollection} from 'type-fest';

type CacheValue = string[] | Map<string, number> | WeakSet<object> | {updatedAt: Date};

type Collections = Extract<CacheValue, UnknownCollection>;
//=> string[] | Map<string, number> | WeakSet<object>
```

@category Type
@category Array
*/
export type UnknownCollection = UnknownArray | UnknownMap | UnknownSet | WeakMap<WeakKey, unknown> | WeakSet<WeakKey>;

export {};

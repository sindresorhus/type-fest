import type {IsAny} from './is-any.d.ts';
import type {MapKey} from './map-key.d.ts'; // For `@link`
import type {ValueOf} from './value-of.d.ts'; // For `@link`

/**
Get the value type of a `Map`, `ReadonlyMap`, or `WeakMap`.

This is the `Map` equivalent of {@link ValueOf} for objects.

Use-cases:
- Get the value type of a `Map` that is created from data, without writing the type by hand.
- Type a value before it is added to a given map.

Note: Returns `never` if the type is not a map. In a union, the members that are not maps are ignored, so `MapValue<Map<string, number> | undefined>` is `number`.

@example
```
import type {MapValue} from 'type-fest';

const users = new Map<string, {name: string; age: number}>();

type User = MapValue<typeof users>;
//=> {name: string; age: number}

function addUser(id: string, user: User) {
	users.set(id, user);
}

addUser('1', {name: 'Jane', age: 30});

// @ts-expect-error
addUser('2', {name: 'John'});
```

@see {@link MapKey}

@category Map
*/
export type MapValue<MapType> = IsAny<MapType> extends true
	// `infer` gives `unknown` for `any`, so `any` is passed through as is.
	? any
	// `ReadonlyMap` also matches `Map`. The key of a `WeakMap` must be a `WeakKey`, so it cannot be `unknown` like the key of `ReadonlyMap`.
	: MapType extends ReadonlyMap<unknown, infer Value>
		? Value
		: MapType extends WeakMap<WeakKey, infer Value>
			? Value
			: never;

export {};

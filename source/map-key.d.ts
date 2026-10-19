import type {IsAny} from './is-any.d.ts';
import type {MapValue} from './map-value.d.ts'; // For `@link`

/**
Get the key type of a `Map`, `ReadonlyMap`, or `WeakMap`.

This is the `Map` equivalent of `keyof` for objects.

Use-cases:
- Get the key type of a `Map` that is created from data, without writing the type by hand.
- Accept only the keys of a given map in a function parameter.

Note: Returns `never` if the type is not a map. In a union, the members that are not maps are ignored, so `MapKey<Map<string, number> | undefined>` is `string`.

@example
```
import type {MapKey} from 'type-fest';

const fieldLabels = new Map([
	['first', 'First Name'],
	['last', 'Last Name'],
] as const);

type Field = MapKey<typeof fieldLabels>;
//=> 'first' | 'last'

function getLabel(field: Field) {
	return fieldLabels.get(field);
}

getLabel('first');

// @ts-expect-error
getLabel('middle');
```

@see {@link MapValue}

@category Map
*/
export type MapKey<MapType> = IsAny<MapType> extends true
	// `infer` gives `unknown` for `any`, so `any` is passed through as is.
	? any
	// `ReadonlyMap` also matches `Map`. It must be checked before `WeakMap`, because the methods of `WeakMap` are compared bivariantly, which makes a `Map` with object, symbol, `unknown`, `any`, or `never` keys assignable to `WeakMap` too. A key inferred from `WeakMap` is limited to `WeakKey`, so `Map<unknown, string>` would give `WeakKey`.
	: MapType extends ReadonlyMap<infer Key, unknown>
		? Key
		: MapType extends WeakMap<infer Key, unknown>
			? Key
			: never;

export {};

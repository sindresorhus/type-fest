import type {AnyFunction} from './basic.d.ts';
import type {IsAnyOrNever, MapsSetsOrArrays, NonRecursiveType} from './internal/type.d.ts';
import type {UnknownRecord} from './unknown-record.d.ts'; // For `@link`

/**
Returns a boolean for whether the given type is a record-like object.

Useful for deciding which values to inspect in a recursive type transformation. Excludes primitives, `void`, functions, constructors, arrays, maps, sets, `PromiseLike` values, dates, regular expressions, array buffers, typed arrays, `DataView`, and DOM nodes when the DOM library is available.

This is a structural check: Ordinary class instances and interfaces are included unless they match an excluded type. It does not recurse into property values. The wide `object` and `{}` types are included too, although they also accept values that are not records. It does not inspect prototypes, exclude every built-in object, or check assignability to {@link UnknownRecord}.

Distributes over unions, returning `boolean` for mixed results. Returns `false` for `any`, `never`, and `unknown`.

@example
```
import type {IsRecordLike} from 'type-fest';

type Settings = IsRecordLike<{theme: string}>;
//=> true

type Collection = IsRecordLike<Map<string, unknown>>;
//=> false

declare class User {
	name: string;
}

type Instance = IsRecordLike<User>;
//=> true

type Mixed = IsRecordLike<{name: string} | undefined>;
//=> boolean
```

@example
```
import type {IsRecordLike} from 'type-fest';

type RecordProperties<Value> = {
	[Key in keyof Value as IsRecordLike<Value[Key]> extends true ? Key : never]: Value[Key];
};

type Selected = RecordProperties<{
	settings: {theme: string};
	entries: Map<string, string>;
	callback: () => void;
	count: number;
}>;
//=> {settings: {theme: string}}
```

@category Type Guard
@category Utilities
*/
export type IsRecordLike<Value> =
	IsAnyOrNever<Value> extends true
		? false
		// An own property can make a callable incompatible with `Function`, so exclude `AnyFunction` as well.
		: Value extends NonRecursiveType | MapsSetsOrArrays | AnyFunction
			? false
			: Value extends object
				? true
				: false;

export {};

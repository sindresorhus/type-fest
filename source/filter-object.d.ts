import type {FilterOptions, FilterType, ApplyFilterOptions} from './filter.d.ts';
import type {UnknownRecord} from './unknown-record.d.ts';
import type {CleanEmpty} from './internal/array.d.ts';
import type {Simplify} from './simplify.d.ts';
import type {IsAny} from './is-any.d.ts';

/**
Filters properties from an object where the property value extend the given type.

If `Type` is `Boolean`, it filters out `falsy` values like `Boolean(T)` does.

Optional control for strict or loose type comparison.

@default loose

@example
```
import type {Filter} from 'type-fest';

type T1 = Filter<{a: 1; b: 2; c: 3 | 4; d?: 3; e?: 4}, 3>;
//=> {c: 3 | 4; d?: 3}

type T2 = Filter<{a: 1; b: 2; c: 3 | 4; d?: 3; e?: 4}, 3, {strict: true}>;
//=> {c?: 3}

type T3 = Filter<{a: 'foo1'; b: 'bar2'; c: 'fooo'; d: 'foo3'}, `foo${number}`>;
//=> {a: 'foo1'; d: 'foo3'}

type T4 = Filter<{a: 1; b: '2'; c: 3; d: 'foo'; e: false}, string | number>;
//=> {a: 1; b: '2'; c: 3; d: 'foo'}

type T5 = Filter<{a: true; b: false; c: boolean; d: 0; e: 1}, Boolean>;
//=> {a: true; e: 1}

type T6 = Filter<{a: 0; b: ''; c: false; d: null; e: undefined; f: 'ok'; g: 42}, Boolean>;
//=> {f: 'ok'; g: 42}
```

@see Filter
@category Object
@category Utilities
*/
export type FilterObject<
	Object_ extends UnknownRecord, Type,
	Options extends FilterOptions = {},
> = IsAny<Object_> extends true ? {}
	: CleanEmpty<
		_ObjectFilter<
			Object_, Type,
			ApplyFilterOptions<Options>
		>
	>;

type _ObjectFilter<
	Object_ extends UnknownRecord, Type,
	Options extends Required<FilterOptions>,
> = Simplify<{
	[Key in keyof Object_ as
	FilterType<Object_[Key], Type, Options['strict']> extends true
		? Key
		: never
	]: Object_[Key]
}>;

export {};

import type {UnknownRecord} from './unknown-record.d.ts';
import type {CleanEmpty} from './internal/array.d.ts';
import type {FilterType} from './array-filter.d.ts';
import type {Simplify} from './simplify.d.ts';

/**
Filters properties from an object where the property value matches the given type.

If `Type` is `Boolean`, it filters out `falsy` values like `Boolean(T)` does.

Strict controls whether strict or loose type comparison is used (defaults to loose).
*/
export type ObjectFilter<
	Object_ extends UnknownRecord, Type,
	Strict extends boolean = false,
> = CleanEmpty<Simplify<{
	[K in keyof Object_ as FilterType<Object_[K], Type, Strict> extends true ? K : never]: Object_[K]
}>>;

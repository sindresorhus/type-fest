import type {FilterOptions, FilterType, ApplyFilterOptions} from './filter.d.ts';
import type {UnknownRecord} from './unknown-record.d.ts';
import type {CleanEmpty} from './internal/array.d.ts';
import type {Simplify} from './simplify.d.ts';

/**
Filters properties from an object where the property value matches the given type.

If `Type` is `Boolean`, it filters out `falsy` values like `Boolean(T)` does.

Strict controls whether strict or loose type comparison is used (defaults to loose).
*/
type ObjectFilter<
	Object_ extends UnknownRecord, Type,
	Options extends FilterOptions = {}
> = _ObjectFilter<Object_, Type, ApplyFilterOptions<Options>['strict']>

export type _ObjectFilter<
	Object_ extends UnknownRecord, Type,
	Strict extends boolean = false,
> = CleanEmpty<Simplify<{
	[Key in keyof Object_ as
	FilterType<Object_[Key], Type, Strict> extends true
		? Key
		: never
	]: Object_[Key]
}>>;

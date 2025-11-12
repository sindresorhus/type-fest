import type {If} from './if.d.ts';
import type {CollapseRestElement} from './internal/array.d.ts';
import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {IfNotAnyOrNever, Not} from './internal/type.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {Or} from './or.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
@see {@link AllExtend}
*/
export type AllExtendOptions = {
	/**
	Consider `never` elements to match the target type only if the target type itself is `never` (or `any`).

	- When set to `true` (default), `never` is _not_ treated as a bottom type, instead, it is treated as a type that matches only itself (or `any`).
	- When set to `false`, `never` is treated as a bottom type, and behaves as it normally would.

	@default true

	@example
	```
	import type {AllExtend} from 'type-fest';

	type A = AllExtend<[1, 2, never], number, {strictNever: true}>;
	//=> false

	type B = AllExtend<[1, 2, never], number, {strictNever: false}>;
	//=> true

	type C = AllExtend<[never, never], never, {strictNever: true}>;
	//=> true

	type D = AllExtend<[never, never], never, {strictNever: false}>;
	//=> true

	type E = AllExtend<['a', 'b', never], any, {strictNever: true}>;
	//=> true

	type F = AllExtend<['a', 'b', never], any, {strictNever: false}>;
	//=> true

	type G = AllExtend<[never, 1], never, {strictNever: true}>;
	//=> false

	type H = AllExtend<[never, 1], never, {strictNever: false}>;
	//=> false
	```
	[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gQQDbYKIAeMKAdgCYC+cAZlBCHAORKoC01KAzjIwNwBQ-FmkxwAvHBz4ipMgB4A2gEYANHABMakigBuKKAF0tAVxAAjfWvTcowAMYwAcrv0AuBFGMoKAPgEB6fzEfGgBDbE4UQWE4ACFxSVxCYnJFVQ0tF0MTc0sMG3snLPdqcMjfAKCQmE8ooWQ0AGEEqWTZRW09KEyuozhOvOsawucu9xqvCv5A4I8vaIa4ABEWpJlUhQHu-qy+rasCh1G3MIjvP2mqubqYvFXpFPkFRlDGNUYzN53etVCSRAOwyOxWuUxm1VqC1QcAAYvc2hsXl8Pl8tn0-gD8kCimNTuULuDrlC0ABxeHrJ77OBKPZZQG2YG4ibnSqzUpnYlwAAS5MeHTp1NpXXpIxB7PxrJC4pQQA)
	*/
	strictNever?: boolean;
};

type DefaultAllExtendOptions = {
	strictNever: true;
};

/**
Returns a boolean for whether every element in an array type extends another type.

@example
```
import type {AllExtend} from 'type-fest';

type A = AllExtend<[1, 2, 3], number>;
//=> true

type B = AllExtend<[1, 2, '3'], number>;
//=> false

type C = AllExtend<[number, number | string], number>;
//=> boolean

type D = AllExtend<[true, boolean, true], true>;
//=> boolean
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gQQDbYKIAeMKAdgCYC+cAZlBCHAORKoC01KAzjIwNwBQ-FmkxwAvHBz4ipMgB4A2gEYANHABMagMwBdNSQCuIAEYooAPgEB6K2PMIoBlIOFwAQuMm5CxcotUaaoxajHpwhiZmlvw2djQAhticzkLIaADCnlI+sooRplD6RgVwAD5w3FDAJADmYflR1rb2xhAQ2CjxJC5pcAAiWd4yfgowjihqre2dJGpjTmHzKNGxLW0dXUA)

Note: Behaviour of optional elements depend on the `exactOptionalPropertyTypes` compiler option. When the option is disabled, the target type must include `undefined` for a successful match.

```
import type {AllExtend} from 'type-fest';

// `exactOptionalPropertyTypes` enabled
type A = AllExtend<[1?, 2?, 3?], number>;
//=> true

// `exactOptionalPropertyTypes` disabled
type B = AllExtend<[1?, 2?, 3?], number>;
//=> false

// `exactOptionalPropertyTypes` disabled
type C = AllExtend<[1?, 2?, 3?], number | undefined>;
//=> true
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gQQDbYKIAeMKAdgCYC+cAZlBCHAORKoC01KAzjIwNwBQ-APRC4AAxQEAhgGMYAeTAxgEElOwAFOqliIAKsi5i4pKQCNsKMvxZpMcALxwc+IqTIAeANoBGAPwANHAATIFwAMx+ALpBJACuIGYoUAB8AiIOKQhQcSiCIuKSsgpKKmqa2slIBqicxmTAnOaW1rZwAEKOzriExOTe-kGhQZExcPGJyWnCQpk06px5M4XScorKqupaEDrVhnVwDU0WVjaGcADCXS697gNhwxHRsQlJUHAAPnBx5CjUwCQrNMMlkYDkUEA)

@see {@link AllExtendOptions}

@category Utilities
@category Array
*/
export type AllExtend<TArray extends UnknownArray, Type, Options extends AllExtendOptions = {}> =
	_AllExtend<CollapseRestElement<TArray>, Type, ApplyDefaultOptions<AllExtendOptions, DefaultAllExtendOptions, Options>>;

type _AllExtend<TArray extends UnknownArray, Type, Options extends Required<AllExtendOptions>> = IfNotAnyOrNever<TArray, If<IsAny<Type>, true,
	TArray extends readonly [infer First, ...infer Rest]
		? IsNever<First> extends true
			? Or<IsNever<Type>, Not<Options['strictNever']>> extends true
				// If target `Type` is also `never` OR `strictNever` is disabled, recurse further.
				? _AllExtend<Rest, Type, Options>
				: false
			: First extends Type
				? _AllExtend<Rest, Type, Options>
				: false
		: true
>, false, false>;

export {};

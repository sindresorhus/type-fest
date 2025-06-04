import type {If} from './if.d.ts';
import type {CollapseRestElement} from './internal/array.d.ts';
import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
@see {@link Every}
*/
type EveryOptions = {
	/**
	Consider `never` elements to match the target type only if the target type itself is `never` (or `any`).

	- When set to `true` (default), `never` is _not_ treated as a bottom type, instead, it is treated as a type that matches only itself (or `any`).
	- When set to `false`, `never` is treated as a bottom type, and behaves as it normally would.

	@default true

	@example
	```
	import type {Every} from 'type-fest';

	type A = Every<[1, 2, never], number, {strictNever: true}>;
	//=> false

	type B = Every<[1, 2, never], number, {strictNever: false}>;
	//=> true

	type C = Every<[never, never], never, {strictNever: true}>;
	//=> true

	type D = Every<[never, never], never, {strictNever: false}>;
	//=> true

	type E = Every<['a', 'b', never], any, {strictNever: true}>;
	//=> true

	type F = Every<['a', 'b', never], any, {strictNever: false}>;
	//=> true

	type G = Every<[never, 1], never, {strictNever: true}>;
	//=> false

	type H = Every<[never, 1], never, {strictNever: false}>;
	//=> false
	```
	*/
	strictNever?: boolean;
};

type DefaultEveryOptions = {
	strictNever: true;
};

/**
Returns a boolean for whether every element in an array type extends another type.

@example
```
import type {Every} from 'type-fest';

type A = Every<[1, 2, 3], number>;
//=> true

type B = Every<[1, 2, '3'], number>;
//=> false

type C = Every<[number, number | string], number>;
//=> boolean

type D = Every<[true, boolean, true], true>;
//=> boolean
```

Note: Behaviour of optional elements depend on the `exactOptionalPropertyTypes` compiler option. When the option is disabled, the target type must include `undefined` for a successful match.

```
import type {Every} from 'type-fest';

// `exactOptionalPropertyTypes` enabled
type A = Every<[1?, 2?, 3?], number>;
//=> true

// `exactOptionalPropertyTypes` disabled
type B = Every<[1?, 2?, 3?], number>;
//=> false

// `exactOptionalPropertyTypes` disabled
type C = Every<[1?, 2?, 3?], number | undefined>;
//=> true
```

@see {@link EveryOptions}

@category Utilities
@category Array
*/
export type Every<TArray extends UnknownArray, Type, Options extends EveryOptions = {}> =
	_Every<CollapseRestElement<TArray>, Type, ApplyDefaultOptions<EveryOptions, DefaultEveryOptions, Options>>;

type _Every<TArray extends UnknownArray, Type, Options extends Required<EveryOptions>> = IfNotAnyOrNever<TArray, If<IsAny<Type>, true,
	TArray extends readonly [infer First, ...infer Rest]
		? IsNever<First> extends true
			? IsNever<Type> extends true
				? _Every<Rest, Type, Options>
				: Options['strictNever'] extends true
					? false
					: _Every<Rest, Type, Options>
			: First extends Type
				? _Every<Rest, Type, Options>
				: false
		: true
>, false, false>;

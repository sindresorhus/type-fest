import type {IsNever} from './is-never.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {And} from './and.d.ts';
import type {Or} from './or.d.ts';
import type {IsUnknown} from './is-unknown.d.ts';
import type {OrAll} from './or-all.d.ts';

export type ExtendsStrictOptions = {
	/**
	Whether to distribute over unions.

	@default false

	@example
	```
	import type {ExtendsStrict} from 'type-fest';

	type T1 = ExtendsStrict<string | number, string, {distributiveUnions: true}>;
	//=> boolean

	type T2 = ExtendsStrict<string | number, string, {distributiveUnions: false}>;
	//=> false
	```
	*/
	distributiveUnions?: boolean;

	/**
	Whether `never` extends every other type.

	When enabled, `never` is not treated as a bottom type and only extends itself (or `any` / `unknown`).

	@default true

	@example
	```
	import type {ExtendsStrict} from 'type-fest';

	type T1 = ExtendsStrict<never, number, {strictNever: true}>;
	//=> false

	type T2 = ExtendsStrict<never, number, {strictNever: false}>;
	//=> true

	type T3 = ExtendsStrict<never, never, {strictNever: true}>;
	//=> true

	type T4 = ExtendsStrict<never, any, {strictNever: true}>;
	//=> true

	type T5 = ExtendsStrict<never, unknown, {strictNever: true}>;
	//=> true
	```

	Note: This option only has an effect when checking assignability from `never` (`ExtendsStrict<never, ...>`), and not when checking assignability to `never` (`ExtendsStrict<..., never>`).
	*/
	strictNever?: boolean;

	/**
	Whether `any` extends every other type.

	When enabled, `any` does not extend every other type, it only extends itself (or `unknown`).

	@default false

	@example
	```
	import type {ExtendsStrict} from 'type-fest';

	type T1 = ExtendsStrict<any, number, {strictAny: true}>;
	//=> false

	type T2 = ExtendsStrict<any, number, {strictAny: false; distributiveUnions: false}>;
	//=> true

	type T3 = ExtendsStrict<any, any, {strictAny: true}>;
	//=> true

	type T4 = ExtendsStrict<any, unknown, {strictAny: true}>;
	//=> true
	```

	Note: If `strictAny` is `false` and `distributiveUnions` is `true`, then `any` would distribute and the result would be the `boolean` type, except when checking assignability to `any` or `unknown`.

	@example
	```
	import type {ExtendsStrict} from 'type-fest';

	type T1 = ExtendsStrict<any, number, {strictAny: false; distributiveUnions: true}>;
	//=> boolean

	type T2 = ExtendsStrict<any, any, {strictAny: false; distributiveUnions: true}>;
	//=> true

	type T3 = ExtendsStrict<any, unknown, {strictAny: false; distributiveUnions: true}>;
	//=> true
	```

	Note: This option only has an effect when checking assignability from `any` (`ExtendsStrict<any, ...>`), and not when checking assignability to `any` (`ExtendsStrict<..., any>`).
	*/
	strictAny?: boolean;
};

type DefaultExtendsStrictOptions = {
	distributiveUnions: false;
	strictNever: true;
	strictAny: false;
};

/**
A customizable version of `extends` for checking whether one type is assignable to another.

Refer {@link ExtendsStrictOptions} for the different ways you can customize the behavior of this type.

@example
```
import type {ExtendsStrict} from 'type-fest';

type T1 = ExtendsStrict<number | string, string, {distributiveUnions: false}>;
//=> false

type T2 = ExtendsStrict<never, number, {strictNever: true}>;
//=> false

type T3 = ExtendsStrict<any, number, {strictAny: true}>;
//=> false
```

@see {@link ExtendsStrictOptions}

@category Improved Built-in
*/
export type ExtendsStrict<Left, Right, Options extends ExtendsStrictOptions = {}> =
	_ExtendsStrict<Left, Right, ApplyDefaultOptions<ExtendsStrictOptions, DefaultExtendsStrictOptions, Options>>;

type _ExtendsStrict<Left, Right, Options extends Required<ExtendsStrictOptions>> =
	And<IsAny<Left>, Options['strictAny']> extends true
		? Or<IsAny<Right>, IsUnknown<Right>>
		: IsNever<Left> extends true
			? Options['strictNever'] extends true
				? OrAll<[IsNever<Right>, IsAny<Right>, IsUnknown<Right>]>
				: true
			: Options['distributiveUnions'] extends true
				? Left extends Right
					? true
					: false
				: [Left] extends [Right]
					? true
					: false;

export {};

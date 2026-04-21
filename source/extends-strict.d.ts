import type {IsNever} from './is-never.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {And} from './and.d.ts';
import type {Not} from './internal/type.d.ts';
import type {Or} from './or.d.ts';
import type {IsUnknown} from './is-unknown.d.ts';

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

	When enabled, `never` is not treated as a bottom type and only extends itself (or `any`).

	@default false

	@example
	```
	import type {ExtendsStrict} from 'type-fest';

	type T1 = ExtendsStrict<never, number, {neverExtendsAll: true}>;
	//=> true

	type T2 = ExtendsStrict<never, number, {neverExtendsAll: false}>;
	//=> false

	type T3 = ExtendsStrict<never, never, {neverExtendsAll: true}>;
	//=> true

	type T4 = ExtendsStrict<never, any, {neverExtendsAll: true}>;
	//=> true
	```
	*/
	neverExtendsAll?: boolean;

	/**
	Whether `any` extends every other type.

	When enabled, `any` does not extend every other type, it only extends itself (or `unknown`).

	@default true

	@example
	```
	import type {ExtendsStrict} from 'type-fest';

	type T1 = ExtendsStrict<any, number, {anyExtendsAll: true; distributiveUnions: false}>;
	//=> true

	type T2 = ExtendsStrict<any, number, {anyExtendsAll: false}>;
	//=> false

	type T3 = ExtendsStrict<any, any, {anyExtendsAll: true}>;
	//=> true

	type T4 = ExtendsStrict<any, unknown, {anyExtendsAll: true}>;
	//=> true
	```

	Note: If both `anyExtendsAll` and `distributiveUnions` are `true`, then `any` would distribute and the result would be the `boolean` type, except when checking assignability to `any` or `unknown`.

	@example
	```
	import type {ExtendsStrict} from 'type-fest';

	type T1 = ExtendsStrict<any, number, {anyExtendsAll: true; distributiveUnions: true}>;
	//=> boolean

	type T2 = ExtendsStrict<any, any, {anyExtendsAll: true; distributiveUnions: true}>;
	//=> true

	type T3 = ExtendsStrict<any, unknown, {anyExtendsAll: true; distributiveUnions: true}>;
	//=> true
	```
	*/
	anyExtendsAll?: boolean;
};

type DefaultExtendsStrictOptions = {
	distributiveUnions: false;
	neverExtendsAll: false;
	anyExtendsAll: true;
};

/**
A customizable version of `extends` for checking whether one type is assignable to another.

Refer {@link ExtendsStrictOptions} for the different ways you can customize the behavior of this type.

@example
```
import type {ExtendsStrict} from 'type-fest';

type T1 = ExtendsStrict<number | string, string, {distributiveUnions: false}>;
//=> false

type T2 = ExtendsStrict<never, number, {neverExtendsAll: false}>;
//=> false

type T3 = ExtendsStrict<any, number, {anyExtendsAll: false}>;
//=> false
```

@see {@link ExtendsStrictOptions}

@category Improved Built-in
*/
export type ExtendsStrict<Left, Right, Options extends ExtendsStrictOptions = {}> =
	_ExtendsStrict<Left, Right, ApplyDefaultOptions<ExtendsStrictOptions, DefaultExtendsStrictOptions, Options>>;

type _ExtendsStrict<Left, Right, Options extends Required<ExtendsStrictOptions>> =
	And<IsAny<Left>, Not<Options['anyExtendsAll']>> extends true
		? Or<IsAny<Right>, IsUnknown<Right>>
		: IsNever<Left> extends true
			? Options['neverExtendsAll'] extends true
				? true
				: Or<IsNever<Right>, IsAny<Right>>
			: Options['distributiveUnions'] extends true
				? Left extends Right
					? true
					: false
				: [Left] extends [Right]
					? true
					: false;

export {};

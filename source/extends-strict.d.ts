import type {IsNever} from './is-never.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {ApplyDefaultOptions} from './apply-default-options.d.ts';
import type {IsMutuallyAssignable} from './is-mutually-assignable.d.ts'; // For `@link`

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
	Restrict `never` to extending itself, `any`, and `unknown`.

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
	Restrict `any` to extending itself and `unknown`.

	When enabled, `any` does not extend every other type, it only extends itself (or `unknown`).

	Disable it to get the built-in behavior, where `any` extends every type except `never`.

	@default true

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

	Note: If `strictAny` is `false` and `distributiveUnions` is `true`, then `any` distributes and the result is the `boolean` type, except when checking assignability to `any` or `unknown`.

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

	Note: This option only has an effect when checking assignability from `any` (`ExtendsStrict<any, ...>`), and not when checking assignability to `any` (`ExtendsStrict<..., any>`). It also only checks the top level, so `ExtendsStrict<any[], string[]>` and `ExtendsStrict<{a: any}, {a: string}>` are `true`.
	*/
	strictAny?: boolean;
};

type DefaultExtendsStrictOptions = {
	distributiveUnions: false;
	strictNever: true;
	strictAny: true;
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

type T3 = ExtendsStrict<any, number>;
//=> false
```

Note: This type checks one direction. For both directions, use {@link IsMutuallyAssignable}, which treats `never` like the default options, but `any` like the built-in `extends`.

@see {@link ExtendsStrictOptions}

@category Improved Built-in
*/
export type ExtendsStrict<Left, Right, Options extends ExtendsStrictOptions = {}> =
	_ExtendsStrict<Left, Right, ApplyDefaultOptions<ExtendsStrictOptions, DefaultExtendsStrictOptions, Options>>;

type _ExtendsStrict<Left, Right, Options extends Required<ExtendsStrictOptions>> =
	// Only a literal `false` turns a strict flag off, so a non-literal flag resolves like the default.
	(IsAny<Left> extends true ? Options['strictAny'] : false) extends false
		? IsNever<Left> extends true
			? Options['strictNever'] extends false
				? true
				// `unknown` is assignable to both `any` and `unknown`, so one check covers both.
				: unknown extends Right ? true : IsNever<Right>
			: Options['distributiveUnions'] extends true
				? Left extends Right
					? true
					: false
				: [Left] extends [Right]
					? true
					: false
		// `unknown` is assignable to exactly the top targets accepted by strict `any`.
		: unknown extends Right ? true : false;

export {};

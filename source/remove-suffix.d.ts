import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {IfNotAnyOrNever, Not} from './internal/type.d.ts';
import type {IsStringLiteral} from './is-literal.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {Or} from './or.d.ts';
import type {If} from './if.d.ts';

/**
@see {@link RemoveSuffix}
*/
export type RemoveSuffixOptions = {
	/**
	When enabled, instantiations with non-literal suffixes (e.g., `string`, `Uppercase<string>`, `` `${string}` ``) simply return `string`, since their precise structure cannot be statically determined.

	Note: Disabling this option can produce misleading results that might not reflect the actual runtime behavior.
	For example, ``RemoveSuffix<'on-change', `-${string}`, {strict: false}>`` returns `'on-'`, but at runtime, suffix could be `'-error'` (which satisfies `` `-${string}` ``) and removing `'-error'` from `'on-change'` would not result in `'on-'`.

	So, it is recommended to not disable this option unless you are aware of the implications.

	@default true

	@example
	```
	import type {RemoveSuffix} from 'type-fest';

	type A = RemoveSuffix<'on-change', `-${string}`, {strict: true}>;
	//=> string

	type B = RemoveSuffix<'on-change', `-${string}`, {strict: false}>;
	//=> 'on-'

	type C = RemoveSuffix<'on-change', string, {strict: true}>;
	//=> string

	type D = RemoveSuffix<'on-change', string, {strict: false}>;
	//=> 'on-chang'

	type E = RemoveSuffix<`${string}/${number}`, `/${number}`, {strict: true}>;
	//=> string

	type F = RemoveSuffix<`${string}/${number}`, `/${number}`, {strict: false}>;
	//=> `${string}`
	```

	Note: This option has no effect when only the input string type is non-literal. For example, ``RemoveSuffix<`on-${string}`, '-change'>`` will always return `string`.

	@example
	```
	import type {RemoveSuffix} from 'type-fest';

	type A = RemoveSuffix<`on-${string}`, '-change', {strict: true}>;
	//=> string

	type B = RemoveSuffix<`on-${string}`, '-change', {strict: false}>;
	//=> string

	type C = RemoveSuffix<`id-${number}`, '-id', {strict: true}>;
	//=> `${number}`

	type D = RemoveSuffix<`id-${number}`, '-id', {strict: false}>;
	//=> `${number}`
	```

	Note: If it can be statically determined that the input string can never end with the specified non-literal suffix, then the input string is returned as-is, regardless of the value of this option.
	For example, ``RemoveSuffix<`${string}/${number}`, `:${string}`>`` returns `` `${string}/${number}` ``, since a string of type `` `${string}/${number}` `` can never end with a suffix of type `` `:${string}` ``.
	```
	import type {RemoveSuffix} from 'type-fest';

	type A = RemoveSuffix<`${string}/${number}`, `:${string}`, {strict: true}>;
	//=> `${string}/${number}`

	type B = RemoveSuffix<`${string}/${number}`, `:${string}`, {strict: false}>;
	//=> `${string}/${number}`

	type C = RemoveSuffix<'on-change', `${number}-`, {strict: true}>;
	//=> 'on-change'

	type D = RemoveSuffix<'on-change', `${number}-`, {strict: false}>;
	//=> 'on-change'
	```
	*/
	strict?: boolean;
};

type DefaultRemoveSuffixOptions = {
	strict: true;
};

/**
Remove the specified suffix from the end of a string.

@example
```
import type {RemoveSuffix} from 'type-fest';

type A = RemoveSuffix<'on-change', '-change'>;
//=> 'on'

type B = RemoveSuffix<'index.html' | 'style.css', '.css'>;
//=> 'index.html' | 'style'

type C = RemoveSuffix<'on-change', '-error'>;
//=> 'on-change'

type D = RemoveSuffix<`user${Capitalize<string>}`, 'user'>;
//=> Capitalize<string>
```

@see {@link RemoveSuffixOptions}

@category String
@category Template literal
*/
export type RemoveSuffix<S extends string, Suffix extends string, Options extends RemoveSuffixOptions = {}> =
	IfNotAnyOrNever<
		S,
		If<
			IsNever<Suffix>,
			S,
			_RemoveSuffix<S, Suffix, ApplyDefaultOptions<RemoveSuffixOptions, DefaultRemoveSuffixOptions, Options>>
		>
	>;

type _RemoveSuffix<S extends string, Suffix extends string, Options extends Required<RemoveSuffixOptions>> =
	Suffix extends string // For distributing `Suffix`
		? S extends `${infer Rest}${Suffix}`
			? Or<IsStringLiteral<Suffix>, Not<Options['strict']>> extends true
				? Rest
				: string // Fallback to `string` when `Suffix` is non-literal and `strict` is disabled
			: S // Return back `S` when `Suffix` is not present at the end of `S`
		: never;

export {};

import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {IfNotAnyOrNever, Not} from './internal/type.d.ts';
import type {IsStringLiteral} from './is-string-literal.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {Or} from './or.d.ts';
import type {If} from './if.d.ts';

/**
@see {@link RemoveSuffix}
*/
export type RemoveSuffixOptions = {
	/**
	When enabled, instantiations with non-literal suffixes (e.g., `string`, `Uppercase<string>`, `` `.${string}` ``) simply return `string`, since their precise structure cannot be statically determined.

	Note: Disabling this option can produce misleading results that might not reflect the actual runtime behavior.
	For example, ``RemoveSuffix<'report.pdf', `.${string}`, {strict: false}>`` returns `'report'`, but at runtime, suffix could be `'.txt'` (which satisfies `` `.${string}` ``) and removing `'.txt'` from `'report.pdf'` would not result in `'report'`.

	So, it is recommended to not disable this option unless you are aware of the implications.

	@default true

	@example
	```
	import type {RemoveSuffix} from 'type-fest';

	type A = RemoveSuffix<'report.pdf', `.${string}`, {strict: true}>;
	//=> string

	type B = RemoveSuffix<'report.pdf', `.${string}`, {strict: false}>;
	//=> 'report'

	type C = RemoveSuffix<'on-change', string, {strict: true}>;
	//=> string

	type D = RemoveSuffix<'on-change', string, {strict: false}>;
	//=> 'o'

	type E = RemoveSuffix<`${number}/${string}`, `/${string}`, {strict: true}>;
	//=> string

	type F = RemoveSuffix<`${number}/${string}`, `/${string}`, {strict: false}>;
	//=> `${number}`
	```

	Note: This option has no effect when only the input string type is non-literal. For example, ``RemoveSuffix<`${string}.pdf`, '.pdf'>`` will always return `string`.

	@example
	```
	import type {RemoveSuffix} from 'type-fest';

	type A = RemoveSuffix<`${string}.pdf`, '.pdf', {strict: true}>;
	//=> string

	type B = RemoveSuffix<`${string}.pdf`, '.pdf', {strict: false}>;
	//=> string

	type C = RemoveSuffix<`${number}px`, 'px', {strict: true}>;
	//=> `${number}`

	type D = RemoveSuffix<`${number}px`, 'px', {strict: false}>;
	//=> `${number}`
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

type A = RemoveSuffix<'report.pdf', '.pdf'>;
//=> 'report'

type B = RemoveSuffix<'bg-blue-500' | 'text-green-500' | 'border-slate-500', '-500'>;
//=> 'bg-blue' | 'border-slate' | 'text-green'

type C = RemoveSuffix<'report.pdf', '.txt'>;
//=> 'report.pdf'

type D = RemoveSuffix<`api/${string}/analytics`, '/analytics'>;
//=> `api/${string}`
```

@see {@link RemoveSuffixOptions}

@category String
@category Template literal
*/
export type RemoveSuffix<S extends string, Suffix extends string, Options extends RemoveSuffixOptions = {}> =
	IfNotAnyOrNever<S, {
		ifNot: If<
			IsNever<Suffix>,
			S,
			_RemoveSuffix<S, Suffix, ApplyDefaultOptions<RemoveSuffixOptions, DefaultRemoveSuffixOptions, Options>>
		>;
	}>;

type _RemoveSuffix<S extends string, Suffix extends string, Options extends Required<RemoveSuffixOptions>> =
	Suffix extends string // For distributing `Suffix`
		? Or<IsStringLiteral<Suffix>, Not<Options['strict']>> extends true
			? S extends `${infer Rest}${Suffix}`
				? Rest
				: S // Return back `S` when `Suffix` is not present at the end of `S`
			: string // Fallback to `string` when `Suffix` is non-literal and `strict` is enabled
		: never;

export {};

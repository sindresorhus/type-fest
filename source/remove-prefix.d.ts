import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {IfNotAnyOrNever, Not} from './internal/type.d.ts';
import type {IsStringLiteral} from './is-string-literal.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {Or} from './or.d.ts';
import type {If} from './if.d.ts';

/**
@see {@link RemovePrefix}
*/
export type RemovePrefixOptions = {
	/**
	When enabled, instantiations with non-literal prefixes (e.g., `string`, `Uppercase<string>`, `` `on${string}` ``) simply return `string`, since their precise structure cannot be statically determined.

	Note: Disabling this option can produce misleading results that might not reflect the actual runtime behavior.
	For example, ``RemovePrefix<'on-change', `${string}-`, {strict: false}>`` returns `'change'`, but at runtime, prefix could be `'handle-'` (which satisfies `` `${string}-` ``) and removing `'handle-'` from `'on-change'` would not result in `'change'`.

	So, it is recommended to not disable this option unless you are aware of the implications.

	@default true

	@example
	```
	import type {RemovePrefix} from 'type-fest';

	type A = RemovePrefix<'on-change', `${string}-`, {strict: true}>;
	//=> string

	type B = RemovePrefix<'on-change', `${string}-`, {strict: false}>;
	//=> 'change'

	type C = RemovePrefix<'on-change', string, {strict: true}>;
	//=> string

	type D = RemovePrefix<'on-change', string, {strict: false}>;
	//=> 'n-change'

	type E = RemovePrefix<`${string}/${number}`, `${string}/`, {strict: true}>;
	//=> string

	type F = RemovePrefix<`${string}/${number}`, `${string}/`, {strict: false}>;
	//=> `${number}`
	```

	Note: This option has no effect when only the input string type is non-literal. For example, ``RemovePrefix<`on-${string}`, 'on-'>`` will always return `string`.

	@example
	```
	import type {RemovePrefix} from 'type-fest';

	type A = RemovePrefix<`on-${string}`, 'on-', {strict: true}>;
	//=> string

	type B = RemovePrefix<`on-${string}`, 'on-', {strict: false}>;
	//=> string

	type C = RemovePrefix<`id-${number}`, 'id-', {strict: true}>;
	//=> `${number}`

	type D = RemovePrefix<`id-${number}`, 'id-', {strict: false}>;
	//=> `${number}`
	```
	*/
	strict?: boolean;
};

type DefaultRemovePrefixOptions = {
	strict: true;
};

/**
Remove the specified prefix from the start of a string.

@example
```
import type {RemovePrefix} from 'type-fest';

type A = RemovePrefix<'on-change', 'on-'>;
//=> 'change'

type B = RemovePrefix<'sm:flex' | 'sm:p-4' | 'sm:gap-2', 'sm:'>;
//=> 'flex' | 'p-4' | 'gap-2'

type C = RemovePrefix<'on-change', 'off-'>;
//=> 'on-change'

type D = RemovePrefix<`handle${Capitalize<string>}`, 'handle'>;
//=> Capitalize<string>
```

@see {@link RemovePrefixOptions}

@category String
@category Template literal
*/
export type RemovePrefix<S extends string, Prefix extends string, Options extends RemovePrefixOptions = {}> =
	IfNotAnyOrNever<S, {
		ifNot: If<
			IsNever<Prefix>,
			S,
			_RemovePrefix<S, Prefix, ApplyDefaultOptions<RemovePrefixOptions, DefaultRemovePrefixOptions, Options>>
		>;
	}>;

type _RemovePrefix<S extends string, Prefix extends string, Options extends Required<RemovePrefixOptions>> =
	Prefix extends string // For distributing `Prefix`
		? Or<IsStringLiteral<Prefix>, Not<Options['strict']>> extends true
			? S extends `${Prefix}${infer Rest}`
				? Rest
				: S // Return back `S` when `Prefix` is not present at the start of `S`
			: string // Fallback to `string` when `Prefix` is non-literal and `strict` is enabled
		: never;

export {};

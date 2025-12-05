import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {IfNotAnyOrNever, Not} from './internal/type.d.ts';
import type {IsStringLiteral} from './is-literal.d.ts';
import type {Or} from './or.d.ts';

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
	const foo = {a: 1, b: 2, c: 3} as const;
	//=> {readonly a: 1; readonly b: 2; readonly c: 3}
	```
	*/
	strict?: boolean;
};

type DefaultRemovePrefixOptions = {
	strict: true;
};

/**
Remove the specified prefix from the start of a string.

@see {@link RemovePrefixOptions}

@category String
@category Template literal
*/
export type RemovePrefix<S extends string, Prefix extends string, Options extends RemovePrefixOptions = {}> =
IfNotAnyOrNever<
	S,
	IfNotAnyOrNever<
		Prefix,
		_RemovePrefix<S, Prefix, ApplyDefaultOptions<RemovePrefixOptions, DefaultRemovePrefixOptions, Options>>,
		string,
		S
	>
>;

type _RemovePrefix<S extends string, Prefix extends string, Options extends Required<RemovePrefixOptions>> =
Prefix extends string // For distributing `Prefix`
	? S extends `${Prefix}${infer Rest}`
		? Or<IsStringLiteral<Prefix>, Not<Options['strict']>> extends true
			? Rest
			: string // Fallback to `string` when `Prefix` is non-literal and `strict` is disabled
		: S // Return back `S` when `Prefix` is not present at the start of `S`
	: never;

export {};

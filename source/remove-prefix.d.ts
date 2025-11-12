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
	[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gJRSCA3FABShQDNgAPAXzlKghDgHIlUBaUlAZxiYG4AUANZoAgnAC8cbLgLEylADxMIAOzYBjABYBDVQHMUTADRwABgBJ0PKMANU2Z09Zi2NMAFwIoAVxRUAPkEAemCJALgbO30hETgAIUlpHHwiEnIKZTVNXQMjU0sXW3tHZyj3L1IdABsufyCBUPDmbT1DJljkNABhJJlU+Qys9Va8k0jXaLLJiu8-QJCwiKiDTtQ4ABE+lLl0pRUR3PbTFf1pt09aGrqFxqXmQ7ajNbQAUW3ZNIVMwtOqYKsqh8IAARigoFQnOYrH9glCisBZq55g0mstJqthF04AAxD4DPY-GEY-T-QHAsEQqG-En-eHlS5VWr1RbNQpA0HgyFAA)

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
	[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gJRSCA3FABShQDNgAPAXzlKghDgHIlUBaUlAZxiYG4AUANZoAgnAC8cbLgLEylADwADCADs2AEnQ8owNQHMqygDTN1bJmZ0w9AYxgAuBFACuKKgD5BAeh8TPOF19AyEROAAhSWkcfCIScgoVC21gw2MzJgsrDGCHZ1IAQwAbLg9vAT8AoNsQsOQ0AGFomTj5RJVgABMtdDVXEAAjFCgM5m7LazynF3cvX39A5W1+oZHjetQ4ABEW2LkEpWUJlYHh0dNxnpybexmi0vKF6uW+s-XlIA)

	Note: If it can be statically determined that the input string can never start with the specified non-literal prefix, then the input string is returned as-is, regardless of the value of this option.
	For example, ``RemovePrefix<`${string}/${number}`, `${string}:`>`` returns `` `${string}/${number}` ``, since a string of type `` `${string}/${number}` `` can never start with a prefix of type `` `${string}:` ``.
	```
	import type {RemovePrefix} from 'type-fest';

	type A = RemovePrefix<`${string}/${number}`, `${string}:`, {strict: true}>;
	//=> `${string}/${number}`

	type B = RemovePrefix<`${string}/${number}`, `${string}:`, {strict: false}>;
	//=> `${string}/${number}`

	type C = RemovePrefix<'on-change', `${number}-`, {strict: true}>;
	//=> 'on-change'

	type D = RemovePrefix<'on-change', `${number}-`, {strict: false}>;
	//=> 'on-change'
	```
	[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gJRSCA3FABShQDNgAPAXzlKghDgHIlUBaUlAZxiYG4AUANZoAgnAC8cbLgLEylADwADACToeUYADsA5lQD067QFcQAIxRQqygDRw1GmFr1UAXHYybgAYxhuEKBMUKgA+QQMDCVCHdW9XI3RTCysbIRE4ACFJaRx8IhJyChU45x19ROTLa09HeP0PeyctPwDSAEMAGy4Q8IFI6Njm8sNjM2q04WQ0AGEcmXz5IsUmCG02HwALdr0UJntHKtS2T2HWwOCwiKiY1fWtnd099Om4ABF5vLlCpTuN7d2+yGR2sJya3nOHW6vWugz+D0BQA)
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
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gJRSCA3FABShQDNgAPAXzlKghDgHIlUBaUlAZxiYG4AUANZoAgnAC8cbLgLEylADxMIAOzYBjABYBDVQHMUTADTM1bJgD5BAehsTLzbXsNMhIuACFJ0nPiIk5BTKXCAAXKQANigUTHAAPsyhYWBsACxxiUzJ+jqpAEwmSeFWtvaOTFExmcypGQnMuQVuwshoAMI+Mv7yQcrmzgZGpiqkpBbWAnYOZuqDru5tcAAiXX5ygUoABrqqACbRACTo7XnAMDqRwABeKIo8UMAGllRbI7sHRpPTjqdg55cbncHk99JYgA)

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

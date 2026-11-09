import type {SimplifyObject} from './internal/object.d.ts';
import type {RequiredKeysOf} from './required-keys-of.d.ts';
import type {_Merge} from './merge.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {If} from './if.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {ExactKey} from './exact-key.d.ts';
import type {DefaultsFor} from './defaults-for.d.ts'; // For `@link`

/**
Apply default options to specified options, preserving literal types.

Useful for authors of configurable utility types. `Defaults` must give every optional option a default and must not give a default for a required option. Each default must be assignable to its option type. `SpecifiedOptions` must satisfy `Options`, including its required properties. Use {@link DefaultsFor} to define a defaults object.

The resolution is shallow, so a nested object is replaced as a whole. A specified option overrides its default. An optional or `undefined`-including specified option uses the default when the declared type does not admit `undefined`, and still overrides when the declared type admits `undefined`, such as `unknown` or `string | undefined`. A numeric key can use either spelling, so `0` and `'0'` name the same option. Every option declared in `Options` is required, and its `readonly` modifier comes from the chosen default or override.

@example
```
import type {ApplyDefaultOptions} from 'type-fest';

type FormatOptions = {
	uppercase?: boolean;
	prefix?: string;
};

type DefaultFormatOptions = {
	uppercase: false;
	prefix: '';
};

type Format<Value extends string, Options extends FormatOptions = {}> = FormatWithOptions<Value, ApplyDefaultOptions<FormatOptions, DefaultFormatOptions, Options>>;

type FormatWithOptions<Value extends string, Options extends Required<FormatOptions>> = `${Options['prefix']}${Options['uppercase'] extends true ? Uppercase<Value> : Value}`;

type Plain = Format<'hello'>;
//=> 'hello'

type Heading = Format<'hello', {uppercase: true; prefix: '# '}>;
//=> '# HELLO'

type Resolved = ApplyDefaultOptions<FormatOptions, DefaultFormatOptions, {uppercase?: true}>;
//=> {uppercase: false; prefix: ''}
```

Known limitations:
- Intended for an object with named properties. Arrays, tuples, and functions are not supported. A string index signature on `Options` blocks defaults for its named options.
- A union of option types or a union-valued option uses one resolution, usually the defaults. A `never` option value is not supported.
- Extra properties are allowed: an extra specified property is kept unless it can be `undefined`, and extra `Defaults` keys are kept.
- With `any` or `never` as `SpecifiedOptions`, the defaults are used, or `never` if `Options` has a required property.
- This does not model runtime object spread, so TypeScript may require concrete specified options instead of unresolved generics.

@see {@link DefaultsFor}
@category Object
*/
export type ApplyDefaultOptions<
	Options extends object,
	Defaults extends SimplifyObject<Omit<Required<Options>, RequiredKeysOf<Options>> & Partial<Record<RequiredKeysOf<Options>, never>>>,
	SpecifiedOptions extends Options,
> =
	// Keep the resolved type assignable to `Required<Options>` without inferring a result that can widen a specified generic value to its constraint.
	_ApplyDefaultOptions<Options, Defaults, SpecifiedOptions> extends Required<Options>
		? _ApplyDefaultOptions<Options, Defaults, SpecifiedOptions>
		: never;

type _ApplyDefaultOptions<
	Options extends object,
	Defaults,
	SpecifiedOptions,
> =
	If<IsAny<SpecifiedOptions>, Defaults,
		If<IsNever<SpecifiedOptions>, Defaults,
			// The overrides are already an object map, so skip `Merge`'s array and equality dispatch.
			_Merge<Defaults, {
				// The first `as` branch keeps the key of an option whose declared type admits `undefined`, like `unknown`, because `undefined` is one of its valid values. `-?` then strips the optional modifier, so an unnarrowed options type still resolves instead of failing the `Required<Options>` guard above.
				[Key in keyof SpecifiedOptions
				as undefined extends Required<Options>[ExactKey<Options, Key>] ? Key : undefined extends SpecifiedOptions[Key] ? never : Key
				]-?: SpecifiedOptions[Key]
			}>>>;

export {};

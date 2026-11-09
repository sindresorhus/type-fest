import {expectTypeOf} from 'nz';
import type {ApplyDefaultOptions, DefaultsFor} from '../index.d.ts';

type PathsOptions = {
	maxRecursionDepth?: number;
	bracketNotation?: boolean;
	leavesOnly?: boolean;
	depth?: number;
};

type DefaultPathsOptions = {
	maxRecursionDepth: 10;
	bracketNotation: false;
	leavesOnly: false;
	depth: number;
};

declare const noOptionsSpecified: ApplyDefaultOptions<PathsOptions, DefaultPathsOptions, {}>;
expectTypeOf(noOptionsSpecified).toBe<DefaultPathsOptions>();

declare const someOptionsSpecified: ApplyDefaultOptions<PathsOptions, DefaultPathsOptions, {leavesOnly: true; depth: 2}>;
expectTypeOf(someOptionsSpecified).toBe<{maxRecursionDepth: 10; bracketNotation: false; leavesOnly: true; depth: 2}>();

declare const someOptionsSpecified2: ApplyDefaultOptions<PathsOptions, DefaultPathsOptions, {maxRecursionDepth: 5}>;
expectTypeOf(someOptionsSpecified2).toBe<{maxRecursionDepth: 5; bracketNotation: false; leavesOnly: false; depth: number}>();

declare const allOptionsSpecified: ApplyDefaultOptions<
	PathsOptions, DefaultPathsOptions, {maxRecursionDepth: 5; bracketNotation: false; leavesOnly: false; depth: 1}
>;
expectTypeOf(allOptionsSpecified).toBe<{maxRecursionDepth: 5; bracketNotation: false; leavesOnly: false; depth: 1}>();

declare const requiredOptions: ApplyDefaultOptions<{fixedLengthOnly?: boolean; strict: boolean}, {fixedLengthOnly: false}, {strict: true}>;
expectTypeOf(requiredOptions).toBe<{fixedLengthOnly: false; strict: true}>();

// @ts-expect-error - An option that does not admit `undefined` cannot be set to it.
declare const undefinedIsRejected: ApplyDefaultOptions<PathsOptions, DefaultPathsOptions, {maxRecursionDepth: undefined}>;

declare const undefinedsGetOverwritten2: ApplyDefaultOptions<{recurseIntoArrays?: boolean | undefined}, {recurseIntoArrays: true}, {recurseIntoArrays: undefined}>;
expectTypeOf(undefinedsGetOverwritten2).toBe<{recurseIntoArrays: undefined}>();

declare const undefinedAsValidValue: ApplyDefaultOptions<{recurseIntoArrays: boolean | undefined}, {}, {recurseIntoArrays: undefined}>;
expectTypeOf(undefinedAsValidValue).toBe<{recurseIntoArrays: undefined}>();

declare const optionalOptionsGetOverwritten: ApplyDefaultOptions<PathsOptions, DefaultPathsOptions, {maxRecursionDepth?: 5; bracketNotation?: true}>;
expectTypeOf(optionalOptionsGetOverwritten).toBe<DefaultPathsOptions>();

declare const anyAsValue: ApplyDefaultOptions<{includes?: any}, {includes: any}, {includes: string}>;
expectTypeOf(anyAsValue).toBe<{includes: string}>();

declare const neverAsOptionsGetOverwritten: ApplyDefaultOptions<PathsOptions, DefaultPathsOptions, never>;
expectTypeOf(neverAsOptionsGetOverwritten).toBe<DefaultPathsOptions>();

declare const anyAsOptionsGetOverwritten: ApplyDefaultOptions<PathsOptions, DefaultPathsOptions, any>;
expectTypeOf(anyAsOptionsGetOverwritten).toBe<DefaultPathsOptions>();

// @ts-expect-error - `Defaults` should be compatible with `Options`
declare const defaultsShouldBeCompatible: ApplyDefaultOptions<{fixedLengthOnly?: boolean}, {fixedLengthOnly: 'no'}, {}>;

// @ts-expect-error - `SpecifiedOptions` should be compatible with `Options`
declare const specifiedOptionsShouldBeCompatible: ApplyDefaultOptions<{fixedLengthOnly?: boolean}, {fixedLengthOnly: false}, {fixedLengthOnly: 'yes'}>;

// @ts-expect-error - Optional options should have a default value
declare const defaultForOptionalOptions: ApplyDefaultOptions<PathsOptions, Omit<DefaultPathsOptions, 'depth'>, {}>;

// @ts-expect-error - Required options should be specified
declare const requiredOptionsShouldBeSpecified: ApplyDefaultOptions<{fixedLengthOnly: boolean}, {}, {}>;

// @ts-expect-error - Required options should not have a default value
declare const noDefaultForRequiredOptions: ApplyDefaultOptions<{fixedLengthOnly: boolean}, {fixedLengthOnly: false}, {fixedLengthOnly: false}>;

// The output of `ApplyDefaultOptions<SomeOption, ...>` should be assignable to `Required<SomeOption>`
type SomeType<Options extends PathsOptions = {}> = _SomeType<ApplyDefaultOptions<PathsOptions, DefaultPathsOptions, Options>>;
type _SomeType<Options extends Required<PathsOptions>> = Options;

// @ts-expect-error
type SomeType2<Options extends PathsOptions = {}> = _SomeType2<ApplyDefaultOptions<PathsOptions, DefaultPathsOptions, Options>>;
type _SomeType2<Options extends Required<PathsOptions> & {extra: string}> = Options;

type SomeTypeOptions = {foo: string; bar?: number};
type DefaultSomeTypeOptions = {bar: 0};

type SomeType3<Options extends SomeTypeOptions> = _SomeType3<ApplyDefaultOptions<SomeTypeOptions, DefaultSomeTypeOptions, Options>>;
type _SomeType3<Options extends Required<SomeTypeOptions>> = Options;

// @ts-expect-error
type SomeType4<Options extends SomeTypeOptions> = _SomeType4<ApplyDefaultOptions<SomeTypeOptions, DefaultSomeTypeOptions, Options>>;
type _SomeType4<Options extends Required<SomeTypeOptions> & {extra: string}> = Options;

// Default and specified fields keep their own modifiers when the values are overridden.
expectTypeOf<ApplyDefaultOptions<
	{readonly mode?: 'default' | 'override'; count?: number},
	{readonly mode: 'default'; count: 0},
	{readonly mode: 'override'}
>>().toBe<{readonly mode: 'override'; count: 0}>();

// Canonical numeric aliases override the same field, while a broad index leaves a named default intact.
expectTypeOf<ApplyDefaultOptions<{0?: number}, {0: 0}, {'0': 1}>>().toBe<{'0': 1}>();
expectTypeOf<ApplyDefaultOptions<{value?: number}, {value: 0}, {[key: string]: number}>>()
	.toBe<{[key: string]: number; value: 0}>();

// A resolved generic option cannot be replaced with its broad constraint or default value.
function _incorrectGenericStrictness<Strict extends boolean>(value: false): ApplyDefaultOptions<{strict?: boolean}, {strict: false}, {strict: Strict}>['strict'] {
	// @ts-expect-error Strict may be true, so the default cannot stand in for its specified value.
	return value;
}

function _incorrectGenericCount<Count extends number>(value: 0): ApplyDefaultOptions<{count?: number}, {count: 0}, {count: Count}>['count'] {
	// @ts-expect-error Count may be a different number.
	return value;
}

// Extra specified metadata keeps its declared value and readonly modifier.
expectTypeOf<ApplyDefaultOptions<
	{mode?: boolean},
	{mode: false},
	{mode: true; readonly metadata: {id: number}}
>>().toBe<{mode: true; readonly metadata: {id: number}}>();

// Resolved fields retain their specified generic value instead of widening to the option constraint.
function _readGenericStrictness<Strict extends boolean>(value: ApplyDefaultOptions<{strict?: boolean}, {strict: false}, {strict: Strict}>['strict']): Strict {
	return value;
}

function _readGenericCount<Count extends number>(value: ApplyDefaultOptions<{count?: number}, {count: 0}, {count: Count}>['count']): Count {
	return value;
}

// An option whose declared type admits `undefined`, like `unknown`, resolves instead of collapsing to `never` when the options type is not narrowed.
expectTypeOf<ApplyDefaultOptions<
	{match?: unknown},
	{match: unknown},
	{match?: unknown}
>>().toBe<{match: unknown}>();

// Such an option still resolves when the whole options type is forwarded unnarrowed.
expectTypeOf<ApplyDefaultOptions<
	{match?: unknown; mode?: boolean},
	{match: unknown; mode: false},
	{match?: unknown; mode?: boolean}
>>().toBe<{match: unknown; mode: false}>();

// An explicit `undefined` is still a value such an option can take, rather than a request for the default.
expectTypeOf<ApplyDefaultOptions<
	{match?: unknown},
	{match: unknown},
	{match: undefined}
>>().toBe<{match: undefined}>();

// Both spellings of a numeric option allow the same explicitly declared `undefined` value.
expectTypeOf<ApplyDefaultOptions<{0?: number | undefined}, {0: 0}, {'0': undefined}>>().toBe<{'0': undefined}>();
expectTypeOf<ApplyDefaultOptions<{'0'?: number | undefined}, {'0': 0}, {0: undefined}>>().toBe<{0: undefined}>();

// Empty options and required-only options need no defaults.
expectTypeOf<ApplyDefaultOptions<{}, {}, {}>>().toBe<{}>();
expectTypeOf<ApplyDefaultOptions<{mode: string}, {}, {mode: 'strict'}>>().toBe<{mode: 'strict'}>();
expectTypeOf<ApplyDefaultOptions<{value: string | undefined}, {}, {value: string | undefined}>>()
	.toBe<{value: string | undefined}>();

// Falsy values are overrides, not requests for defaults.
expectTypeOf<ApplyDefaultOptions<
	{enabled?: boolean; count?: number; prefix?: string; fallback?: string | null},
	{enabled: true; count: 3; prefix: '>'; fallback: 'none'},
	{enabled: false; count: 0; prefix: ''; fallback: null}
>>().toBe<{enabled: false; count: 0; prefix: ''; fallback: null}>();

// A broad specified value must not be narrowed to a literal default.
expectTypeOf<ApplyDefaultOptions<
	{enabled?: boolean; count?: number; prefix?: string},
	{enabled: false; count: 0; prefix: ''},
	{enabled: boolean; count: number; prefix: string}
>>().toBe<{enabled: boolean; count: number; prefix: string}>();

// Keys specified as optional use defaults; keys specified as required override them.
expectTypeOf<ApplyDefaultOptions<
	{mode?: string; count?: number},
	{mode: 'default'; count: 0},
	{readonly mode?: 'strict'; count: 5}
>>().toBe<{mode: 'default'; count: 5}>();
expectTypeOf<ApplyDefaultOptions<PathsOptions, DefaultPathsOptions, Partial<PathsOptions>>>().toBe<DefaultPathsOptions>();
expectTypeOf<ApplyDefaultOptions<PathsOptions, DefaultPathsOptions, Required<PathsOptions>>>().toBe<Required<PathsOptions>>();

// Explicitly permitted undefined, including on optional properties, is a value.
expectTypeOf<ApplyDefaultOptions<{mode?: string | undefined}, {mode: 'default'}, {mode: string | undefined}>>()
	.toBe<{mode: string | undefined}>();
expectTypeOf<ApplyDefaultOptions<{mode?: string | undefined}, {mode: 'default'}, {mode?: 'strict' | undefined}>>()
	.toBe<{mode: 'strict' | undefined}>();
expectTypeOf<ApplyDefaultOptions<{mode?: undefined}, {mode: undefined}, {}>>().toBe<{mode: undefined}>();
expectTypeOf<ApplyDefaultOptions<{mode?: string | undefined}, {mode: undefined}, {mode: 'strict'}>>().toBe<{mode: 'strict'}>();

// Any and unknown values are preserved when the option explicitly permits them.
expectTypeOf<ApplyDefaultOptions<{value?: unknown}, {value: 'default'}, {value: any}>>().toBe<{value: any}>();
expectTypeOf<ApplyDefaultOptions<{value?: any}, {value: 'default'}, {value: unknown}>>().toBe<{value: unknown}>();
expectTypeOf<ApplyDefaultOptions<{value?: any}, {value: 'default'}, {}>>().toBe<{value: 'default'}>();
expectTypeOf<ApplyDefaultOptions<{value?: unknown}, {value: 0}, {value: {id: 1}}>>().toBe<{value: {id: 1}}>();
expectTypeOf<ApplyDefaultOptions<{value: unknown}, {}, {value: unknown}>>().toBe<{value: unknown}>();

// Defaults alone cannot supply required options, even when specified options are any or never.
expectTypeOf<ApplyDefaultOptions<{mode: string; count?: number}, {count: 0}, any>>().toBe<never>();
expectTypeOf<ApplyDefaultOptions<{mode: string; count?: number}, {count: 0}, never>>().toBe<never>();
expectTypeOf<ApplyDefaultOptions<any, {}, {}>>().toBe<{}>();
expectTypeOf<ApplyDefaultOptions<never, {}, never>>().toBe<never>();
// @ts-expect-error - unknown is not an options object.
type UnknownOptions = ApplyDefaultOptions<unknown, {}, {}>;
// @ts-expect-error - unknown cannot satisfy the specified options constraint.
type UnknownSpecifiedOptions = ApplyDefaultOptions<PathsOptions, DefaultPathsOptions, unknown>;
// @ts-expect-error - unknown cannot supply defaults.
type UnknownDefaults = ApplyDefaultOptions<PathsOptions, unknown, {}>;
// @ts-expect-error - A primitive cannot describe options.
type PrimitiveOptions = ApplyDefaultOptions<string, {}, {}>;
// @ts-expect-error - undefined is not an options object.
type UndefinedSpecifiedOptions = ApplyDefaultOptions<PathsOptions, DefaultPathsOptions, undefined>;

// Resolution replaces nested values without recursively applying defaults.
expectTypeOf<ApplyDefaultOptions<
	{output?: {indent?: number; suffix?: string}; columns?: readonly string[]},
	{output: {indent: 2; suffix: '\n'}; columns: readonly ['id']},
	{output: {indent: 4}; columns: readonly ['name', 'email']}
>>().toBe<{output: {indent: 4}; columns: readonly ['name', 'email']}>();

// Callback signatures retain their type parameters and predicates.
type Identity = <Value>(value: Value) => Value;
type StringPredicate = (value: unknown) => value is string;
expectTypeOf<ApplyDefaultOptions<{transform?: Identity}, {transform: Identity}, {transform: Identity}>>()
	.toBe<{transform: Identity}>();
expectTypeOf<ApplyDefaultOptions<{test?: (value: unknown) => boolean}, {test: StringPredicate}, {}>>()
	.toBe<{test: StringPredicate}>();

// The `readonly` modifier comes from the selected property, not from the options declaration.
expectTypeOf<ApplyDefaultOptions<
	{readonly mode?: string; count?: number},
	{mode: 'default'; readonly count: 0},
	{mode: 'strict'}
>>().toBe<{mode: 'strict'; readonly count: 0}>();
expectTypeOf<ApplyDefaultOptions<{mode?: string}, {readonly mode: 'default'}, {mode: 'strict'}>>()
	.toBe<{mode: 'strict'}>();

// Named option objects, intersections, and symbol keys are supported.
type OutputOptions = {
	name: string;
	readonly pretty?: boolean;
};
type SpecifiedOutputOptions = {
	name: 'report';
	pretty: true;
} & OutputOptions;
expectTypeOf<ApplyDefaultOptions<OutputOptions, {pretty: false}, SpecifiedOutputOptions>>()
	.toBe<{name: 'report'; pretty: true}>();
expectTypeOf<ApplyDefaultOptions<{mode?: string} & {count?: number}, {mode: 'default'; count: 0}, {mode: 'strict'} & {count: 1}>>()
	.toBe<{mode: 'strict'; count: 1}>();

declare const optionSymbol: unique symbol;
expectTypeOf<ApplyDefaultOptions<
	{[optionSymbol]?: boolean; count?: number},
	{readonly [optionSymbol]: false; count: 0},
	{[optionSymbol]: true}
>>().toBe<{[optionSymbol]: true; count: 0}>();
expectTypeOf<ApplyDefaultOptions<
	{[optionSymbol]?: number | undefined},
	{[optionSymbol]: 0},
	{readonly [optionSymbol]: undefined}
>>().toBe<{readonly [optionSymbol]: undefined}>();

// Extra named properties are retained; generic constraints are not exact-object checks.
expectTypeOf<ApplyDefaultOptions<{mode?: string}, {mode: 'default'; version: 1}, {}>>()
	.toBe<{mode: 'default'; version: 1}>();

// Defaults remain mandatory even if every option is explicitly specified.
// @ts-expect-error - count still needs a default.
type MissingUnusedDefault = ApplyDefaultOptions<{count?: number}, {}, {count: 1}>;
// @ts-expect-error - A default cannot be optional.
type OptionalDefault = ApplyDefaultOptions<{count?: number}, {count?: 0}, {}>;
// @ts-expect-error - An option that does not allow undefined cannot default to it.
type UndefinedDefault = ApplyDefaultOptions<{count?: number}, {count: undefined}, {}>;
// @ts-expect-error - Defaults for required options are also rejected on non-literal types.
type RequiredOptionDefault = ApplyDefaultOptions<{mode: string; count?: number}, {mode: 'default'; count: 0}, {mode: 'strict'}>;
// @ts-expect-error - Required properties cannot become optional in specified options.
type OptionalRequiredOption = ApplyDefaultOptions<{mode: string; count?: number}, {count: 0}, {mode?: 'strict'}>;

// `DefaultsFor` validates default objects, while `as const` preserves their literals.
const formatDefaults = {uppercase: false, prefix: ''} as const satisfies DefaultsFor<{uppercase?: boolean; prefix?: string}>;
expectTypeOf<ApplyDefaultOptions<{uppercase?: boolean; prefix?: string}, typeof formatDefaults, {uppercase: true}>>()
	.toBe<{uppercase: true; readonly prefix: ''}>();

// A configurable utility type can branch on resolved literals, including a default prefix.
type FormatOptions = {uppercase?: boolean; prefix?: string};
type DefaultFormatOptions = {uppercase: false; prefix: ''};
type Format<Value extends string, Options extends FormatOptions = {}> = FormatWithOptions<Value, ApplyDefaultOptions<FormatOptions, DefaultFormatOptions, Options>>;
type FormatWithOptions<Value extends string, Options extends Required<FormatOptions>> = `${Options['prefix']}${Options['uppercase'] extends true ? Uppercase<Value> : Value}`;
expectTypeOf<Format<'hello'>>().toBe<'hello'>();
expectTypeOf<Format<'hello', {uppercase: true; prefix: '# '}>>().toBe<'# HELLO'>();
expectTypeOf<Format<'hello', {uppercase?: true}>>().toBe<'hello'>();
expectTypeOf<Format<'hello', {prefix: '> '}>>().toBe<'> hello'>();

// Generic option values survive forwarding into a utility and back out.
function _readGenericPrefix<Prefix extends string>(value: ApplyDefaultOptions<{prefix?: string}, {prefix: ''}, {prefix: Prefix}>['prefix']): Prefix {
	return value;
}

function _readCallback<Value>(value: ApplyDefaultOptions<{transform?: (value: Value) => Value}, {transform: Identity}, {transform: (value: Value) => Value}>['transform']): (value: Value) => Value {
	return value;
}

// An extra property is kept only when it is required and its type does not include `undefined`.
expectTypeOf<ApplyDefaultOptions<{mode?: boolean}, {mode: false}, {mode: true; metadata?: {id: number}}>>()
	.toBe<{mode: true}>();
expectTypeOf<ApplyDefaultOptions<{mode?: boolean}, {mode: false}, {mode: true; metadata: string | undefined}>>()
	.toBe<{mode: true}>();
expectTypeOf<ApplyDefaultOptions<{}, {}, {extra: 1}>>().toBe<{extra: 1}>();
expectTypeOf<ApplyDefaultOptions<{}, {}, {extra?: 1}>>().toBe<{}>();
// With empty options, `any` and `never` specified options resolve to the defaults.
expectTypeOf<ApplyDefaultOptions<{}, {}, any>>().toBe<{}>();
expectTypeOf<ApplyDefaultOptions<{}, {}, never>>().toBe<{}>();

// An optional specified option uses the default, unless the declared option type admits `undefined`.
expectTypeOf<ApplyDefaultOptions<{mode?: string}, {mode: 'a'}, {mode?: 'b'}>>().toBe<{mode: 'a'}>();
expectTypeOf<ApplyDefaultOptions<{mode?: string}, {mode: 'a'}, {readonly mode?: 'b'}>>().toBe<{mode: 'a'}>();
expectTypeOf<ApplyDefaultOptions<{mode?: string | undefined}, {mode: 'a'}, {mode?: 'b'}>>().toBe<{mode: 'b'}>();
expectTypeOf<ApplyDefaultOptions<{includes?: any}, {includes: 'default'}, {includes: string | undefined}>>()
	.toBe<{includes: string | undefined}>();

// A required option that admits `undefined` must still be given, and an explicit `undefined` is a value.
// @ts-expect-error - A required option that admits `undefined` still must be present.
type MissingUndefinedRequired = ApplyDefaultOptions<{mode: string | undefined; count?: number}, {count: 0}, {}>;
expectTypeOf<ApplyDefaultOptions<{mode: string | undefined; count?: number}, {count: 0}, {mode: undefined}>>()
	.toBe<{count: 0; mode: undefined}>();
expectTypeOf<ApplyDefaultOptions<{mode: string | undefined; count?: number}, {count: 0}, {mode: 'strict'; count?: 2}>>()
	.toBe<{count: 0; mode: 'strict'}>();
// @ts-expect-error - A required option cannot have a default, even when it admits `undefined`.
type UndefinedDefaultForRequired = ApplyDefaultOptions<{mode: string | undefined; count?: number}, {mode: undefined; count: 0}, {}>;
// @ts-expect-error - An optional option that admits `undefined` still needs a default.
type MissingUndefinedOptionalDefault = ApplyDefaultOptions<{mode?: string | undefined}, {}, {}>;
// A default of `undefined` is a value when the option type admits it.
expectTypeOf<ApplyDefaultOptions<{mode?: string | undefined}, {mode: undefined}, {}>>().toBe<{mode: undefined}>();
// Passing the options type itself makes an undefined-admitting option required and defaults its sibling.
expectTypeOf<ApplyDefaultOptions<
	{mode?: string | undefined; count?: number},
	{mode: 'default'; count: 0},
	{mode?: string | undefined; count?: number}
>>().toBe<{mode: string | undefined; count: 0}>();
expectTypeOf<ApplyDefaultOptions<{mode?: string | undefined}, {mode: 'default'}, Required<{mode?: string | undefined}>>>()
	.toBe<{mode: string | undefined}>();

// Numeric options accept both key spellings.
expectTypeOf<ApplyDefaultOptions<{0?: number}, {0: 0}, {}>>().toBe<{0: 0}>();
expectTypeOf<ApplyDefaultOptions<{'0'?: number}, {'0': 0}, {0: 1}>>().toBe<{0: 1}>();
expectTypeOf<ApplyDefaultOptions<{0?: number | undefined}, {0: 0}, {'0'?: number}>>().toBe<{'0': number}>();
expectTypeOf<ApplyDefaultOptions<{0: boolean; count?: number}, {count: 0}, {'0': true}>>().toBe<{count: 0; '0': true}>();
// @ts-expect-error - `'01'` is not a spelling of `0`, and `Options` has no other key.
type NonCanonicalNumericKey = ApplyDefaultOptions<{0?: number}, {0: 0}, {'01': 1}>;

// Index signatures resolve, but a string index signature on `Options` leaves no named key for a default.
expectTypeOf<ApplyDefaultOptions<{[key: string]: number}, {}, {a: 1; b: 2}>>().toBe<{a: 1; b: 2}>();
expectTypeOf<ApplyDefaultOptions<Record<number, string>, {}, Record<number, 'x'>>>().toBe<{[key: number]: 'x'}>();
expectTypeOf<ApplyDefaultOptions<{[n: number]: string}, {}, {[n: number]: 'x'}>>().toBe<{[n: number]: 'x'}>();
expectTypeOf<ApplyDefaultOptions<{[key: symbol]: number}, {}, {[key: symbol]: 1}>>().toBe<{[key: symbol]: 1}>();
expectTypeOf<ApplyDefaultOptions<{[key: number]: string; mode?: number}, {mode: 0}, {}>>().toBe<{mode: 0}>();
expectTypeOf<ApplyDefaultOptions<{[key: symbol]: string; mode?: number}, {mode: 0}, {}>>().toBe<{mode: 0}>();
expectTypeOf<ApplyDefaultOptions<{value?: number}, {value: 0}, {[key: number]: number}>>()
	.toBe<{[key: number]: number; value: 0}>();
expectTypeOf<ApplyDefaultOptions<{[key: number]: string; mode?: boolean}, {mode: false}, {[key: number]: 'x'}>>()
	.toBe<{[key: number]: 'x'; mode: false}>();
expectTypeOf<ApplyDefaultOptions<{value?: number; other?: number}, {value: 0; other: 0}, {[key: string]: number; value: 1}>>()
	.toBe<{[key: string]: number; other: 0; value: 1}>();
expectTypeOf<ApplyDefaultOptions<{value?: number; other?: number}, {value: 0; other: 0}, {[key: string]: number; value?: 1}>>()
	.toBe<{[key: string]: number; other: 0; value: 0}>();
expectTypeOf<ApplyDefaultOptions<{mode?: string}, {mode: 'a'}, {[key: string]: string | undefined}>>().toBe<{mode: 'a'}>();
expectTypeOf<ApplyDefaultOptions<{value?: number}, {readonly value: 0}, {readonly [key: string]: number}>>()
	.toBe<{readonly [key: string]: number; readonly value: 0}>();
// @ts-expect-error - A string index signature on `Options` leaves no named key for a default.
type IndexSignatureDefault = ApplyDefaultOptions<{[key: string]: number; mode?: number}, {mode: 0}, {}>;

// Extra and index-signature keys in `Defaults` are kept with their modifiers.
declare const extraSymbol: unique symbol;
expectTypeOf<ApplyDefaultOptions<{mode?: string}, {mode: 'default'; version?: 1}, {}>>()
	.toBe<{mode: 'default'; version?: 1}>();
expectTypeOf<ApplyDefaultOptions<{mode?: string}, {readonly mode: 'default'; extra?: number}, {}>>()
	.toBe<{readonly mode: 'default'; extra?: number}>();
expectTypeOf<ApplyDefaultOptions<{mode?: string}, {mode: 'default'} & {[key: string]: unknown}, {}>>()
	.toBe<{[key: string]: unknown; mode: 'default'}>();
expectTypeOf<ApplyDefaultOptions<{mode?: string}, {mode: 'default'} & {[key: number]: unknown}, {}>>()
	.toBe<{[key: number]: unknown; mode: 'default'}>();
expectTypeOf<ApplyDefaultOptions<{value?: number}, {readonly [key: string]: number; readonly value: 0}, {}>>()
	.toBe<{readonly [key: string]: number; readonly value: 0}>();
expectTypeOf<ApplyDefaultOptions<{mode?: string}, {mode: 'default'} & {[extraSymbol]: 1}, {}>>()
	.toBe<{mode: 'default'; [extraSymbol]: 1}>();
expectTypeOf<ApplyDefaultOptions<{mode?: string}, never, {}>>().toBe<never>();

// A required extra symbol option is kept, and an optional one is dropped.
expectTypeOf<ApplyDefaultOptions<{mode?: string}, {mode: 'default'}, {mode: 'strict'; [extraSymbol]: 1}>>()
	.toBe<{mode: 'strict'; [extraSymbol]: 1}>();
expectTypeOf<ApplyDefaultOptions<{mode?: string}, {mode: 'default'}, {mode: 'strict'; [extraSymbol]?: 1}>>()
	.toBe<{mode: 'strict'}>();
expectTypeOf<ApplyDefaultOptions<{[optionSymbol]: boolean; count?: number}, {count: 0}, {[optionSymbol]: true}>>()
	.toBe<{[optionSymbol]: true; count: 0}>();

// The `readonly` modifier follows the chosen override, and declared options are always required.
expectTypeOf<ApplyDefaultOptions<{mode?: string; count?: number}, {mode: 'a'; count: 0}, {readonly mode: 'b'; count: 1}>>()
	.toBe<{readonly mode: 'b'; count: 1}>();

// Values are replaced as is, without narrowing, deep merging, or recursing.
expectTypeOf<ApplyDefaultOptions<{mode?: 'a' | 'b'}, {mode: 'a' | 'b'}, {}>>().toBe<{mode: 'a' | 'b'}>();
expectTypeOf<ApplyDefaultOptions<{cols?: [number, string]}, {cols: [0, '']}, {cols: [1, 'a']}>>().toBe<{cols: [1, 'a']}>();
expectTypeOf<ApplyDefaultOptions<{list?: readonly string[]}, {list: readonly []}, {list: []}>>().toBe<{list: []}>();
expectTypeOf<ApplyDefaultOptions<{transform?: (v: number) => number}, {transform: (v: number) => number}, {transform: (v: unknown) => number}>>()
	.toBe<{transform: (v: unknown) => number}>();
expectTypeOf<ApplyDefaultOptions<{output?: {indent?: number; suffix?: string}}, {output: {indent: 2; suffix: '\n'}}, {output: {indent?: 4}}>>()
	.toBe<{output: {indent?: 4}}>();
type NodeOptions = {child?: NodeOptions; mode?: string};
expectTypeOf<ApplyDefaultOptions<NodeOptions, {child: NodeOptions; mode: 'default'}, {child: {mode: 'x'}}>>()
	.toBe<{mode: 'default'; child: {mode: 'x'}}>();

// A union of option types resolves once, using the common keys and their defaults.
expectTypeOf<ApplyDefaultOptions<{mode?: 'a'} | {mode?: 'b'}, {mode: 'a'}, {}>>().toBe<{mode: 'a'}>();
expectTypeOf<ApplyDefaultOptions<{a?: string} | {b?: number}, {a: 'x'; b: 0}, {a: 'y'}>>().toBe<{a: 'y'; b: 0}>();
expectTypeOf<ApplyDefaultOptions<{a?: string} | {b?: number}, {a: 'x'; b: 0}, {a?: 'y'}>>().toBe<{a: 'x'; b: 0}>();

// A configurable utility forwards its options through a default type argument.
type ResolvePathsOptions<Options extends PathsOptions = {}> = ApplyDefaultOptions<PathsOptions, DefaultPathsOptions, Options>;
expectTypeOf<ResolvePathsOptions>().toBe<DefaultPathsOptions>();
expectTypeOf<ResolvePathsOptions<{leavesOnly: true}>>()
	.toBe<{maxRecursionDepth: 10; bracketNotation: false; depth: number; leavesOnly: true}>();
expectTypeOf<ResolvePathsOptions<PathsOptions>>().toBe<DefaultPathsOptions>();

// `DefaultsFor` gives the exact defaults shape; `as const` is needed to keep its literals.
type RequestOptions = {url: string; retries?: number; timeout?: number};
expectTypeOf<ApplyDefaultOptions<RequestOptions, DefaultsFor<RequestOptions>, {url: 'https://example.com'}>>()
	.toBe<{retries: number; timeout: number; url: 'https://example.com'}>();
type ModeDefaults = DefaultsFor<{mode?: string | undefined}>;
const modeDefaults = {mode: 'x'} as const satisfies ModeDefaults;
expectTypeOf<ApplyDefaultOptions<{mode?: string | undefined}, typeof modeDefaults, {}>>()
	.toBe<{readonly mode: 'x'}>();

// The doc example resolves as documented.
expectTypeOf<ApplyDefaultOptions<FormatOptions, DefaultFormatOptions, {uppercase?: true}>>()
	.toBe<{uppercase: false; prefix: ''}>();

// Narrow literal overrides reject the original defaults and unrelated values.
expectTypeOf<{uppercase: false; prefix: ''}>().not.toBeAssignableTo<ApplyDefaultOptions<FormatOptions, DefaultFormatOptions, {uppercase: true}>>();
expectTypeOf<{uppercase: true; prefix: 1}>().not.toBeAssignableTo<ApplyDefaultOptions<FormatOptions, DefaultFormatOptions, {uppercase: true}>>();

import {expectTypeOf} from 'nz';
import type {ApplyDefaultOptions} from '../../source/internal/index.d.ts';

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

// @ts-expect-error
declare const undefinedsGetOverwritten: ApplyDefaultOptions<PathsOptions, DefaultPathsOptions, {maxRecursionDepth: undefined}>; // Possible when `exactOptionalPropertyTypes` is disabled
expectTypeOf(undefinedsGetOverwritten).toBe<DefaultPathsOptions>();

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

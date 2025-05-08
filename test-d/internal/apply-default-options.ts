import {expectType} from 'tsd';
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
expectType<DefaultPathsOptions>(noOptionsSpecified);

declare const someOptionsSpecified: ApplyDefaultOptions<PathsOptions, DefaultPathsOptions, {leavesOnly: true; depth: 2}>;
expectType<{maxRecursionDepth: 10; bracketNotation: false; leavesOnly: true; depth: 2}>(someOptionsSpecified);

declare const someOptionsSpecified2: ApplyDefaultOptions<PathsOptions, DefaultPathsOptions, {maxRecursionDepth: 5}>;
expectType<{maxRecursionDepth: 5; bracketNotation: false; leavesOnly: false; depth: number}>(someOptionsSpecified2);

declare const allOptionsSpecified: ApplyDefaultOptions<
PathsOptions, DefaultPathsOptions, {maxRecursionDepth: 5; bracketNotation: false; leavesOnly: false; depth: 1}
>;
expectType<{maxRecursionDepth: 5; bracketNotation: false; leavesOnly: false; depth: 1}>(allOptionsSpecified);

declare const requiredOptions: ApplyDefaultOptions<{fixedLengthOnly?: boolean; strict: boolean}, {fixedLengthOnly: false}, {strict: true}>;
expectType<{fixedLengthOnly: false; strict: true}>(requiredOptions);

// @ts-ignore
declare const undefinedsGetOverwritten: ApplyDefaultOptions<PathsOptions, DefaultPathsOptions, {maxRecursionDepth: undefined}>; // Possible when `exactOptionalPropertyTypes` is disabled
expectType<DefaultPathsOptions>(undefinedsGetOverwritten);

// Caveat: User specified `undefined` for optional properties with explicit undefined also gets overwritten
declare const undefinedsGetOverwritten2: ApplyDefaultOptions<{recurseIntoArrays?: boolean | undefined}, {recurseIntoArrays: true}, {recurseIntoArrays: undefined}>;
expectType<{recurseIntoArrays: true}>(undefinedsGetOverwritten2);

declare const undefinedAsValidValue: ApplyDefaultOptions<{recurseIntoArrays: boolean | undefined}, {}, {recurseIntoArrays: undefined}>;
expectType<{recurseIntoArrays: undefined}>(undefinedAsValidValue);

declare const optionalOptionsGetOverwritten: ApplyDefaultOptions<PathsOptions, DefaultPathsOptions, {maxRecursionDepth?: 5; bracketNotation?: true}>;
expectType<DefaultPathsOptions>(optionalOptionsGetOverwritten);

declare const neverAsOptionsGetOverwritten: ApplyDefaultOptions<PathsOptions, DefaultPathsOptions, never>;
expectType<DefaultPathsOptions>(neverAsOptionsGetOverwritten);

declare const anyAsOptionsGetOverwritten: ApplyDefaultOptions<PathsOptions, DefaultPathsOptions, any>;
expectType<DefaultPathsOptions>(anyAsOptionsGetOverwritten);

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

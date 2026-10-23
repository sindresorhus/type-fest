/* eslint-disable no-var -- Globals must be declared with `var` to be found on `globalThis`. */
import {expectTypeOf} from 'nz';
import type {FindGlobalInstanceType, FindGlobalType} from '../index.d.ts';

declare class NonGlobalES6Class {}
declare var nonGlobalVar: number;
declare let nonGlobalLet: number;
declare const nonGlobalConst: number;

declare global {
	class GlobalES6Class {}
	var globalVar: string;
	let globalLet: number;
	const globalConst: number;

	type GlobalClass = {foo: string};
	var GlobalConstructorVarStyle: new () => GlobalClass;
	let GlobalConstructorLetStyle: new () => GlobalClass;
	const GlobalConstructorConstStyle: new () => GlobalClass;

	type GlobalTypeAlias = {value: string};

	var nonConstructorFunction: () => Date;
	var findGlobalOptionalValue: string | undefined;
	var findGlobalUnknownValue: unknown;
	var findGlobalAnyValue: any;
	var findGlobalNeverValue: never;
}

// === FindGlobalType ===

// Success
declare const foundGlobalVar: FindGlobalType<'globalVar'>;
expectTypeOf(foundGlobalVar).toBe<string>();

// Failures
declare const foundNonGlobalES6Class: FindGlobalType<'NonGlobalES6Class'>;
expectTypeOf(foundNonGlobalES6Class).toBe<never>();
declare const foundNonGlobalVar: FindGlobalType<'nonGlobalVar'>;
expectTypeOf(foundNonGlobalVar).toBe<never>();
declare const foundNonGlobalLet: FindGlobalType<'nonGlobalLet'>;
expectTypeOf(foundNonGlobalLet).toBe<never>();
declare const foundNonGlobalConst: FindGlobalType<'nonGlobalConst'>;
expectTypeOf(foundNonGlobalConst).toBe<never>();

declare const foundGlobalLet: FindGlobalType<'globalLet'>;
expectTypeOf(foundGlobalLet).toBe<never>();
declare const foundGlobalConst: FindGlobalType<'globalConst'>;
expectTypeOf(foundGlobalConst).toBe<never>();

// === FindGlobalInstanceType ===

// Success
declare const foundInstanceDate: FindGlobalInstanceType<'Date'>;
expectTypeOf(foundInstanceDate).toBe<Date>();
declare const foundInstanceMultiple: FindGlobalInstanceType<'Date' | 'Error'>;
expectTypeOf(foundInstanceMultiple).toBe<Date | Error>();
declare const foundInstanceMultiplePartial: FindGlobalInstanceType<'Date' | 'Error' | 'NonExistentType'>;
expectTypeOf(foundInstanceMultiplePartial).toBe<Date | Error>();
declare const foundInstanceGlobalConstructorVarStyle: FindGlobalInstanceType<'GlobalConstructorVarStyle'>;
expectTypeOf(foundInstanceGlobalConstructorVarStyle).toBe<GlobalClass>();

// Failures
declare const foundInstanceNonExistentType: FindGlobalInstanceType<'NonExistentType'>;
expectTypeOf(foundInstanceNonExistentType).toBe<never>();
declare const foundInstanceNonGlobalES6Class: FindGlobalInstanceType<'NonGlobalES6Class'>;
expectTypeOf(foundInstanceNonGlobalES6Class).toBe<never>();

declare const foundInstanceGlobalTypeAlias: FindGlobalInstanceType<'GlobalTypeAlias'>;
expectTypeOf(foundInstanceGlobalTypeAlias).toBe<never>();
declare const foundInstanceGlobalES6Class: FindGlobalInstanceType<'GlobalES6Class'>;
expectTypeOf(foundInstanceGlobalES6Class).toBe<never>();
declare const foundInstanceGlobalConstructorLetStyle: FindGlobalInstanceType<'GlobalConstructorLetStyle'>;
expectTypeOf(foundInstanceGlobalConstructorLetStyle).toBe<never>();
declare const foundInstanceGlobalConstructorConstStyle: FindGlobalInstanceType<'GlobalConstructorConstStyle'>;
expectTypeOf(foundInstanceGlobalConstructorConstStyle).toBe<never>();
declare const foundInstanceGlobalNonConstructorFunction: FindGlobalInstanceType<'nonConstructorFunction'>;
expectTypeOf(foundInstanceGlobalNonConstructorFunction).toBe<never>();

// A missing name must not discard another global found in the same union.
expectTypeOf<FindGlobalType<'Date' | 'DefinitelyMissingTypeFestGlobal'>>().toBe<DateConstructor>();
expectTypeOf<FindGlobalType<'globalVar' | 'globalLet'>>().toBe<string>();

// An empty set of names finds no global.
expectTypeOf<FindGlobalType<never>>().toBe<never>();

// Found names contribute their whole value, including values that are not constructors.
expectTypeOf<FindGlobalType<'Date' | 'Error'>>().toBe<DateConstructor | ErrorConstructor>();
expectTypeOf<FindGlobalType<'globalVar' | 'GlobalConstructorVarStyle' | 'DefinitelyMissingTypeFestGlobal'>>()
	.toBe<string | (new () => GlobalClass)>();
expectTypeOf<FindGlobalType<'nonConstructorFunction' | 'Date' | 'globalConst'>>().toBe<(() => Date) | DateConstructor>();
expectTypeOf<FindGlobalType<'findGlobalOptionalValue' | 'DefinitelyMissingTypeFestGlobal'>>().toBe<string | undefined>();
expectTypeOf<FindGlobalType<'globalLet' | 'globalConst' | 'GlobalES6Class' | 'GlobalTypeAlias'>>().toBe<never>();
expectTypeOf<FindGlobalType<'nonGlobalVar' | 'nonGlobalLet' | 'nonGlobalConst' | 'NonGlobalES6Class'>>().toBe<never>();
expectTypeOf<FindGlobalType<'DefinitelyMissingTypeFestGlobal' | 'AnotherMissingTypeFestGlobal'>>().toBe<never>();

// Sentinel global values are preserved; a missing name contributes nothing.
expectTypeOf<FindGlobalType<'findGlobalUnknownValue'>>().toBe<unknown>();
expectTypeOf<FindGlobalType<'findGlobalUnknownValue' | 'Date'>>().toBe<unknown>();
expectTypeOf<FindGlobalType<'findGlobalAnyValue' | 'Date'>>().toBe<any>();
expectTypeOf<FindGlobalType<'findGlobalNeverValue'>>().toBe<never>();
expectTypeOf<FindGlobalType<'findGlobalNeverValue' | 'globalVar'>>().toBe<string>();
// Open-ended queries find values but cannot identify one particular global.
expectTypeOf<FindGlobalType<any>>().not.toBe<never>();
expectTypeOf<FindGlobalType<any>>().not.toBe<DateConstructor>();
expectTypeOf<FindGlobalType<string>>().not.toBe<never>();
expectTypeOf<FindGlobalType<string>>().not.toBe<DateConstructor>();
// @ts-expect-error Names must be strings.
type UnknownGlobalName = FindGlobalType<unknown>;
// @ts-expect-error Numeric names are not part of this string-name API.
type NumericGlobalName = FindGlobalType<123>;

// Constructor values stay distinct from the instance lookup in the same module.
expectTypeOf<FindGlobalType<'GlobalConstructorVarStyle' | 'nonConstructorFunction'>>()
	.toBe<(new () => GlobalClass) | (() => Date)>();
expectTypeOf<FindGlobalInstanceType<'GlobalConstructorVarStyle' | 'nonConstructorFunction'>>().toBe<GlobalClass>();

// Literal inference and result constraints work through generic wrappers.
declare function findGlobal<Name extends string>(name: Name): FindGlobalType<Name>;
expectTypeOf(findGlobal('Date')).toBe<DateConstructor>();
expectTypeOf(findGlobal('globalVar')).toBe<string>();
declare const foundOrMissingName: 'Date' | 'DefinitelyMissingTypeFestGlobal';
expectTypeOf(findGlobal(foundOrMissingName)).toBe<DateConstructor>();
function _globalConstructor<Name extends 'Date' | 'Error'>(value: FindGlobalType<Name>): DateConstructor | ErrorConstructor {
	return value;
}

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
}

// === FindGlobalType ===

// Success
declare const foundGlobalVar: FindGlobalType<'globalVar'>;
expectTypeOf(foundGlobalVar).toBe<string>();

// Failures
declare const foundNonGlobalES6Class: FindGlobalType<'nonGlobalVar'>;
expectTypeOf(foundNonGlobalVar).toBe<never>();
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

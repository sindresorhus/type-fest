/* eslint-disable no-var, unicorn/prevent-abbreviations */
import {expectType} from 'tsd';
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
expectType<string>(foundGlobalVar);

// Failures
declare const foundNonGlobalES6Class: FindGlobalType<'nonGlobalVar'>;
expectType<never>(foundNonGlobalVar);
declare const foundNonGlobalVar: FindGlobalType<'nonGlobalVar'>;
expectType<never>(foundNonGlobalVar);
declare const foundNonGlobalLet: FindGlobalType<'nonGlobalLet'>;
expectType<never>(foundNonGlobalLet);
declare const foundNonGlobalConst: FindGlobalType<'nonGlobalConst'>;
expectType<never>(foundNonGlobalConst);

declare const foundGlobalLet: FindGlobalType<'globalLet'>;
expectType<never>(foundGlobalLet);
declare const foundGlobalConst: FindGlobalType<'globalConst'>;
expectType<never>(foundGlobalConst);

// === FindGlobalInstanceType ===

// Success
declare const foundInstanceDate: FindGlobalInstanceType<'Date'>;
expectType<Date>(foundInstanceDate);
declare const foundInstanceMultiple: FindGlobalInstanceType<'Date' | 'Error'>;
expectType<Date | Error>(foundInstanceMultiple);
declare const foundInstanceMultiplePartial: FindGlobalInstanceType<'Date' | 'Error' | 'NonExistentType'>;
expectType<Date | Error>(foundInstanceMultiplePartial);
declare const foundInstanceGlobalConstructorVarStyle: FindGlobalInstanceType<'GlobalConstructorVarStyle'>;
expectType<GlobalClass>(foundInstanceGlobalConstructorVarStyle);

// Failures
declare const foundInstanceNonExistentType: FindGlobalInstanceType<'NonExistentType'>;
expectType<never>(foundInstanceNonExistentType);
declare const foundInstanceNonGlobalES6Class: FindGlobalInstanceType<'NonGlobalES6Class'>;
expectType<never>(foundInstanceNonGlobalES6Class);

declare const foundInstanceGlobalTypeAlias: FindGlobalInstanceType<'GlobalTypeAlias'>;
expectType<never>(foundInstanceGlobalTypeAlias);
declare const foundInstanceGlobalES6Class: FindGlobalInstanceType<'GlobalES6Class'>;
expectType<never>(foundInstanceGlobalES6Class);
declare const foundInstanceGlobalConstructorLetStyle: FindGlobalInstanceType<'GlobalConstructorLetStyle'>;
expectType<never>(foundInstanceGlobalConstructorLetStyle);
declare const foundInstanceGlobalConstructorConstStyle: FindGlobalInstanceType<'GlobalConstructorConstStyle'>;
expectType<never>(foundInstanceGlobalConstructorConstStyle);
declare const foundInstanceGlobalNonConstructorFunction: FindGlobalInstanceType<'nonConstructorFunction'>;
expectType<never>(foundInstanceGlobalNonConstructorFunction);

/* eslint-disable no-var, unicorn/prevent-abbreviations */
import {expectAssignable, expectNotAssignable, expectType} from 'tsd';
import type {FindGlobalType} from '..';

class NonGlobalClass {}
declare global {
	class GlobalES6Style {
		foo: string;
	}

	type GlobalClass = {foo: string};
	var GlobalVarStyle: new () => GlobalClass;
	let GlobalLetStyle: new () => GlobalClass;
	const GlobalConstStyle: new () => GlobalClass;

	type GlobalNonClass = {value: string};

	var nonConstructorFunction: () => Date;
}

// Preconditions
type GlobalThisKey = keyof typeof globalThis;
expectAssignable<GlobalThisKey>('GlobalVarStyle');
expectAssignable<GlobalThisKey>('nonConstructorFunction');
expectNotAssignable<GlobalThisKey>('NotGlobalClass');
expectNotAssignable<GlobalThisKey>('GlobalES6Style');
expectNotAssignable<GlobalThisKey>('GlobalLetStyle');
expectNotAssignable<GlobalThisKey>('GlobalConstStyle');

// Success
declare const foundDate: FindGlobalType<'Date'>;
expectType<Date>(foundDate);
declare const foundMultiple: FindGlobalType<'Date' | 'Error'>;
expectType<Date | Error>(foundMultiple);
declare const foundMultiplePartial: FindGlobalType<'Date' | 'Error' | 'NonExistentType'>;
expectType<Date | Error>(foundMultiplePartial);
declare const foundGlobalVarStyle: FindGlobalType<'GlobalVarStyle'>;
expectType<GlobalClass>(foundGlobalVarStyle);

// Failures
declare const foundNonExistentType: FindGlobalType<'NonExistentType'>;
expectType<never>(foundNonExistentType);
declare const foundNonGlobalClass: FindGlobalType<'NonGlobalClass'>;
expectType<never>(foundNonGlobalClass);

declare const foundGlobalNonClass: FindGlobalType<'GlobalNonClass'>;
expectType<never>(foundGlobalNonClass);
declare const foundGlobalLetStyle: FindGlobalType<'GlobalLetStyle'>;
expectType<never>(foundGlobalLetStyle);
declare const foundGlobalConstStyle: FindGlobalType<'GlobalConstStyle'>;
expectType<never>(foundGlobalConstStyle);
declare const foundGlobalNonConstructorFunction: FindGlobalType<'nonConstructorFunction'>;
expectType<never>(foundGlobalNonConstructorFunction);


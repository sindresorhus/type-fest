import {expectType} from 'tsd';
import type {IfNotAnyOrNever} from '../../source/internal/index.d.ts';

expectType<any>({} as IfNotAnyOrNever<any, {ifNot: string}>);
expectType<never>({} as IfNotAnyOrNever<never, {ifNot: string}>);
expectType<number>({} as IfNotAnyOrNever<any, {ifNot: string; ifAny: number}>);
expectType<any>({} as IfNotAnyOrNever<any, {ifNot: string; ifNever: number}>);
expectType<number>({} as IfNotAnyOrNever<any, {ifNot: string; ifAny: number; ifNever: boolean}>);
expectType<never>({} as IfNotAnyOrNever<never, {ifNot: string; ifAny: number}>);
expectType<number>({} as IfNotAnyOrNever<never, {ifNot: string; ifNever: number}>);
expectType<boolean>({} as IfNotAnyOrNever<never, {ifNot: string; ifAny: number; ifNever: boolean}>);
expectType<number>({} as IfNotAnyOrNever<string, {ifNot: number}>);
expectType<number>({} as IfNotAnyOrNever<string | number, {ifNot: number; ifAny: boolean}>);
expectType<number>({} as IfNotAnyOrNever<string | number, {ifNot: number; ifNever: boolean}>);
expectType<number>({} as IfNotAnyOrNever<object, {ifNot: number; ifAny: boolean; ifNever: string}>);

type CrashIfAnyWrapper<T> = IfNotAnyOrNever<T, {ifNot: CrashIfAny<T>}>;

type CrashIfAny<T, Acc extends unknown[] = []> = 0 extends 1 & T // Check if `T` is `any`
	? CrashIfAny<T, [...Acc, unknown]>
	: never;

// `CrashIfAny<any>` errors with a recursion depth error, but `CrashIfAnyWrapper<any>` shouldn't.
// @ts-expect-error
type T1 = CrashIfAny<any>;
type T2 = CrashIfAnyWrapper<any>;

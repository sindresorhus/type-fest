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

type CrashIfNeverWrapper<T> = IfNotAnyOrNever<T, {ifNot: CrashIfNever<T>}>;

type CrashIfNever<T, Acc extends unknown[] = []> = [never] extends [T] // Check if `T` is `never`
	? CrashIfNever<T, [...Acc, unknown]>
	: never;

// `CrashIfNever<never>` errors with a recursion depth error, but `CrashIfNeverWrapper<never>` shouldn't.
// @ts-expect-error
type T3 = CrashIfNever<never>;
type T4 = CrashIfNeverWrapper<never>;

type CrashIfNotAnyWrapper<T> = IfNotAnyOrNever<T, {ifNot: never; ifAny: CrashIfNotAny<T>}>;

type CrashIfNotAny<T, Acc extends unknown[] = []> = 0 extends 1 & T // Check if `T` is `any`
	? never
	: CrashIfNotAny<T, [...Acc, unknown]>;

// `CrashIfNotAny<string>` errors with a recursion depth error, but `CrashIfNotAnyWrapper<string>` shouldn't.
// @ts-expect-error
type T5 = CrashIfNotAny<string>;
type T6 = CrashIfNotAnyWrapper<string>;

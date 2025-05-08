import {expectType} from 'tsd';
import type {IfNotAnyOrNever} from '../../source/internal/index.d.ts';

expectType<any>({} as IfNotAnyOrNever<any, string>);
expectType<never>({} as IfNotAnyOrNever<never, string>);
expectType<number>({} as IfNotAnyOrNever<any, string, number>);
expectType<number>({} as IfNotAnyOrNever<any, string, number, boolean>);
expectType<never>({} as IfNotAnyOrNever<never, string, number>);
expectType<boolean>({} as IfNotAnyOrNever<never, string, number, boolean>);
expectType<number>({} as IfNotAnyOrNever<string, number>);
expectType<number>({} as IfNotAnyOrNever<string | number, number, boolean>);
expectType<number>({} as IfNotAnyOrNever<object, number, boolean, string>);

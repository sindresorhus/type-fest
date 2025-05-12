import {expectType} from 'tsd';
import type {If} from '../../source/internal/type.js';

expectType<string>({} as If<true, string, number>);
expectType<number>({} as If<false, string, number>);
expectType<string | number>({} as If<boolean, string, number>);
expectType<string | number>({} as If<any, string, number>);
expectType<number>({} as If<never, string, number>);

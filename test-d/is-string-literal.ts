import {expectType} from 'tsd';
import type {IsStringLiteral} from '../index';

declare const test1: IsStringLiteral<'hello'>;
declare const test2: IsStringLiteral<string>;
declare const test3: IsStringLiteral<number>;

expectType<true>(test1);
expectType<false>(test2);
expectType<false>(test3);

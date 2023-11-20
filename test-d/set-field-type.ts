import {expectNotAssignable, expectType} from 'tsd';
import type {SetFieldType} from '../index';

declare const variation1: SetFieldType<{a: number}, 'a', string>;
expectType<{a: string}>(variation1);

declare const variation2: SetFieldType<{a: number; b: boolean; c: Date}, 'a' | 'b', string>;
expectType<{a: string; b: string; c: Date}>(variation2);

declare const variation3: SetFieldType<{a: string; b: boolean; c: Date}, 'b' | 'c', number>;
expectType<{a: string; b: number; c: number}>(variation3);

declare const variation4: SetFieldType<{a: string; b: string; c: string}, 'b', number>;
expectNotAssignable<{a: string; b: string; c: string}>(variation4);

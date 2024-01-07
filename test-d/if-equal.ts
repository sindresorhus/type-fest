import {expectType, expectError} from 'tsd';
import type {IfEqual} from '../index';

// `IfEqual` should return `true`/`false` if only `A` and `B` are specified
expectType<IfEqual<string, string>>(true);
expectType<IfEqual<string, number>>(false);

// `IfEqual` with custom types for equal or not equal cases
expectType<IfEqual<string, string, 'Equal', 'NotEqual'>>('Equal');
expectType<IfEqual<string, number, 'Equal', 'NotEqual'>>('NotEqual');

// `IfEqual` should correctly handle complex types
expectType<IfEqual<{a: number}, {a: number}>>(true);
expectType<IfEqual<{a: number}, {b: number}>>(false);

// Missing generic parameters
expectError<IfEqual<string>>(undefined);
expectError<IfEqual>(undefined);

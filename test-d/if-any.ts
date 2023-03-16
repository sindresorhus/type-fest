import {expectError, expectType} from 'tsd';
import type {IfAny} from '../index';

declare const _any: any;

// `IfAny` should return `true`/`false` if only `T` is specified
expectType<IfAny<any>>(true);
expectType<IfAny<string>>(false);
expectType<IfAny<any, 'T', 'F'>>('T');
expectType<IfAny<string, 'T', 'F'>>('F');

// Missing generic parameter
expectError<IfAny>(_any);

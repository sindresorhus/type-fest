import {expectType} from 'tsd';
import type {IfFloat} from '../index';

// `IfFloat` should return `true`/`false` if only `T` is specified
expectType<IfFloat<3.41>>(true);
expectType<IfFloat<string>>(false);
expectType<IfFloat<9.000_01, 'T', 'F'>>('T');
expectType<IfFloat<string, 'T', 'F'>>('F');

// Missing generic parameter
// @ts-expect-error
type A = IfFloat;

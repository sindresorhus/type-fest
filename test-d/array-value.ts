import {expectNotAssignable, expectType} from 'tsd';
import type {ArrayValue} from '../source/array-value';

type Value = ArrayValue<Array<'string'>>;

expectType<Value>('string');
expectNotAssignable<Value>(123);


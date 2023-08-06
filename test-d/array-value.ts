import {expectNotAssignable, expectType, expectAssignable} from 'tsd';
import type {ArrayValue} from '../source/array-value';

type Value = ArrayValue<Array<'string'>>;

expectType<Value>('string');
expectNotAssignable<Value>(123);

type TupleValue = ArrayValue<['el', 123, [{exA: 42}]]>;

expectAssignable<TupleValue>('el');
expectAssignable<TupleValue>(123);
expectAssignable<TupleValue>([{exA: 42}]);
expectNotAssignable<TupleValue>([{exA: '42'}]);

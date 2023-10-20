import {expectNotAssignable, expectType, expectAssignable} from 'tsd';
import type {ArrayIndex} from '../index';

const values = ['a', 'b', 'c'] as const;
type ValueKeys = ArrayIndex<typeof values>;

declare const test: 0 | 1 | 2;
expectType<ValueKeys>(test);

expectAssignable<ValueKeys>(0);
expectAssignable<ValueKeys>(1);
expectAssignable<ValueKeys>(2);

expectNotAssignable<ValueKeys>(-1);
expectNotAssignable<ValueKeys>(3);

type TupleKeys = ArrayIndex<['a', 2]>;

declare const testTuple: 0 | 1;
expectType<TupleKeys>(testTuple);

expectAssignable<TupleKeys>(0);
expectAssignable<TupleKeys>(1);

expectNotAssignable<TupleKeys>(-1);
expectNotAssignable<TupleKeys>(2);

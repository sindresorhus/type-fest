import {expectNotAssignable, expectType, expectAssignable} from 'tsd';
import type {ArrayValues} from '../index.d.ts';

const values = ['a', 'b', 'c'] as const;
type Values = ArrayValues<typeof values>;

declare const test: 'a' | 'b' | 'c';
expectType<Values>(test);

expectAssignable<Values>('a');
expectAssignable<Values>('b');
expectAssignable<Values>('c');

expectNotAssignable<Values>('');
expectNotAssignable<Values>(0);

type TupleValues = ArrayValues<['1', 2, {c: true}]>;

declare const testTuple: '1' | 2 | {c: true};
expectType<TupleValues>(testTuple);

expectAssignable<TupleValues>('1');
expectAssignable<TupleValues>(2);
expectAssignable<TupleValues>({c: true});

expectNotAssignable<TupleValues>({});
expectNotAssignable<TupleValues>(1);
expectNotAssignable<TupleValues>('2');

type AnyStringValues = ArrayValues<string[]>;
expectAssignable<AnyStringValues>('');
expectAssignable<AnyStringValues>('123');
expectNotAssignable<AnyStringValues>(123);
expectNotAssignable<AnyStringValues>(undefined);
expectNotAssignable<AnyStringValues>(null);

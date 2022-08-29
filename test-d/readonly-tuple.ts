import {expectAssignable, expectError, expectNotAssignable} from 'tsd';
import type {ReadonlyTuple} from '../index';

type TupleOfThreeStrings = ReadonlyTuple<string, 3>;

expectAssignable<TupleOfThreeStrings>(['a', 'b', 'c']);

expectNotAssignable<TupleOfThreeStrings>(['a', 'b', 123]);
expectNotAssignable<TupleOfThreeStrings>(['a']);
expectNotAssignable<TupleOfThreeStrings>(['a', 'b']);
expectNotAssignable<TupleOfThreeStrings>(['a', 'b', 'c', 'd']);

declare const test: TupleOfThreeStrings;

expectError(test.push);
expectError(test[2] = 'a');

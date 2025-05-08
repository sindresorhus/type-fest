import {expectAssignable, expectNotAssignable} from 'tsd';
import type {ReadonlyTuple} from '../index.d.ts';

type TupleOfThreeStrings = ReadonlyTuple<string, 3>;

expectAssignable<TupleOfThreeStrings>(['a', 'b', 'c']);

expectNotAssignable<TupleOfThreeStrings>(['a', 'b', 123]);
expectNotAssignable<TupleOfThreeStrings>(['a']);
expectNotAssignable<TupleOfThreeStrings>(['a', 'b']);
expectNotAssignable<TupleOfThreeStrings>(['a', 'b', 'c', 'd']);

declare const test: TupleOfThreeStrings;

// @ts-expect-error
const _a: unknown = test.push;
// @ts-expect-error
test[2] = 'a';

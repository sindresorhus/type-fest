import {expectAssignable, expectNotAssignable, expectType} from 'tsd';
import {FixedLengthArray} from '../index';

type FixedToThreeStrings = FixedLengthArray<string, 3>;

expectAssignable<FixedToThreeStrings>(['a', 'b', 'c']);

expectNotAssignable<FixedToThreeStrings>(['a', 'b', 123]);
expectNotAssignable<FixedToThreeStrings>(['a']);
expectNotAssignable<FixedToThreeStrings>(['a', 'b']);
expectNotAssignable<FixedToThreeStrings>(['a', 'b', 'c', 'd']);

declare const a: FixedLengthArray<number, 2>;

expectAssignable<typeof a.length>(2);
expectNotAssignable<typeof a.length>(3);

expectType<2>(a.length);
expectType<IterableIterator<number>>(a[Symbol.iterator]());
expectType<number>(a[1]);

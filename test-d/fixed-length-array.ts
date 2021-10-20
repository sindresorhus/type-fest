import {expectAssignable, expectNotAssignable, expectType} from 'tsd';
import {FixedLengthArray} from '../index';

type FixedToThreeStrings = FixedLengthArray<string, 3>;

expectAssignable<FixedToThreeStrings>(['a', 'b', 'c']);

expectNotAssignable<FixedToThreeStrings>(['a', 'b', 123]);
expectNotAssignable<FixedToThreeStrings>(['a']);
expectNotAssignable<FixedToThreeStrings>(['a', 'b']);
expectNotAssignable<FixedToThreeStrings>(['a', 'b', 'c', 'd']);

declare const a: FixedToThreeStrings;

expectType<IterableIterator<string>>(a[Symbol.iterator]());
expectType<string>(a[1]);

// FixedLengthArray<string, 3> is a readonly array and cannot be assigned to array.
// * it does not have .push() etc..
expectNotAssignable<string[]>(a);

// FixedLengthArray<string, number> is not a readonly array because Length is not finite number
// * So it is assiable to string[]
declare const b: FixedLengthArray<string, number>;
expectAssignable<string[]>(b);

import {expectAssignable, expectNotAssignable} from 'tsd';
import {FixedLengthArray} from '..';

type FixedToThreeStrings = FixedLengthArray<string, 3>;

expectAssignable<FixedToThreeStrings>(['a', 'b', 'c']);

expectNotAssignable<FixedToThreeStrings>(['a', 'b', 123]);
expectNotAssignable<FixedToThreeStrings>(['a']);
expectNotAssignable<FixedToThreeStrings>(['a', 'b']);
expectNotAssignable<FixedToThreeStrings>(['a', 'b', 'c', 'd']);

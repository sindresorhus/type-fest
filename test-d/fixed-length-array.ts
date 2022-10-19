import {expectTypeOf} from 'expect-type';
import type {FixedLengthArray} from '../index';

type FixedToThreeStrings = FixedLengthArray<string, 3>;

expectTypeOf<['a', 'b', 'c']>().toMatchTypeOf<FixedToThreeStrings>();

expectTypeOf<['a', 'b', 123]>().not.toMatchTypeOf<FixedToThreeStrings>();
expectTypeOf<['a']>().not.toMatchTypeOf<FixedToThreeStrings>();
expectTypeOf<['a', 'b']>().not.toMatchTypeOf<FixedToThreeStrings>();
expectTypeOf<['a', 'b', 'c', 'd']>().not.toMatchTypeOf<FixedToThreeStrings>();

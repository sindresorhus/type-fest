import {expectTypeOf} from 'expect-type';
import type {ReadonlyTuple} from '../index';

type TupleOfThreeStrings = ReadonlyTuple<string, 3>;

expectTypeOf<['a', 'b', 'c']>().toMatchTypeOf<TupleOfThreeStrings>();

expectTypeOf<['a', 'b', 123]>().not.toMatchTypeOf<TupleOfThreeStrings>();
expectTypeOf<['a']>().not.toMatchTypeOf<TupleOfThreeStrings>();
expectTypeOf<['a', 'b']>().not.toMatchTypeOf<TupleOfThreeStrings>();
expectTypeOf<['a', 'b', 'c', 'd']>().not.toMatchTypeOf<TupleOfThreeStrings>();

declare const test: TupleOfThreeStrings;

// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
test.push;
// @ts-expect-error
test[2] = 'a';

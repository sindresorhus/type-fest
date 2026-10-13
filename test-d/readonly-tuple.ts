import {expectTypeOf} from 'nz';
import type {ReadonlyTuple} from '../index.d.ts';

type TupleOfThreeStrings = ReadonlyTuple<string, 3>;

['a', 'b', 'c'] satisfies TupleOfThreeStrings;

expectTypeOf<['a', 'b', 123]>().not.toBeAssignableTo<TupleOfThreeStrings>();
expectTypeOf<['a']>().not.toBeAssignableTo<TupleOfThreeStrings>();
expectTypeOf<['a', 'b']>().not.toBeAssignableTo<TupleOfThreeStrings>();
expectTypeOf<['a', 'b', 'c', 'd']>().not.toBeAssignableTo<TupleOfThreeStrings>();

declare const test: TupleOfThreeStrings;

expectTypeOf<'push' extends keyof TupleOfThreeStrings ? true : false>().toBe<false>();
// @ts-expect-error
test[2] = 'a';

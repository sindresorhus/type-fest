import {expectTypeOf} from 'nz';
import type {ReadonlyTuple} from '../index.d.ts';

type TupleOfThreeStrings = ReadonlyTuple<string, 3>;

['a', 'b', 'c'] satisfies TupleOfThreeStrings;

expectTypeOf<['a', 'b', 123]>().not.toBeAssignableTo<TupleOfThreeStrings>();
expectTypeOf<['a']>().not.toBeAssignableTo<TupleOfThreeStrings>();
expectTypeOf<['a', 'b']>().not.toBeAssignableTo<TupleOfThreeStrings>();
expectTypeOf<['a', 'b', 'c', 'd']>().not.toBeAssignableTo<TupleOfThreeStrings>();

declare const test: TupleOfThreeStrings;

// @ts-expect-error
const _a: unknown = test.push;
// @ts-expect-error
test[2] = 'a';

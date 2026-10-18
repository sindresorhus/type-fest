import {expectTypeOf} from 'nz';
import type {ArrayValues} from '../index.d.ts';

const values = ['a', 'b', 'c'] as const;
type Values = ArrayValues<typeof values>;

declare const test: 'a' | 'b' | 'c';
expectTypeOf(test).toBe<Values>();

expectTypeOf<'a'>().toBeAssignableTo<Values>();
expectTypeOf<'b'>().toBeAssignableTo<Values>();
expectTypeOf<'c'>().toBeAssignableTo<Values>();

expectTypeOf<''>().not.toBeAssignableTo<Values>();
expectTypeOf<0>().not.toBeAssignableTo<Values>();

type TupleValues = ArrayValues<['1', 2, {c: true}]>;

declare const testTuple: '1' | 2 | {c: true};
expectTypeOf(testTuple).toBe<TupleValues>();

expectTypeOf<'1'>().toBeAssignableTo<TupleValues>();
expectTypeOf<2>().toBeAssignableTo<TupleValues>();
({c: true}) satisfies TupleValues;

expectTypeOf<{}>().not.toBeAssignableTo<TupleValues>();
expectTypeOf<1>().not.toBeAssignableTo<TupleValues>();
expectTypeOf<'2'>().not.toBeAssignableTo<TupleValues>();

type AnyStringValues = ArrayValues<string[]>;
expectTypeOf<''>().toBeAssignableTo<AnyStringValues>();
expectTypeOf<'123'>().toBeAssignableTo<AnyStringValues>();
expectTypeOf<123>().not.toBeAssignableTo<AnyStringValues>();
expectTypeOf<undefined>().not.toBeAssignableTo<AnyStringValues>();
expectTypeOf<null>().not.toBeAssignableTo<AnyStringValues>();

// Readonly arrays of unknown length and readonly tuples with a rest element
expectTypeOf<ArrayValues<readonly string[]>>().toBe<string>();
expectTypeOf<ArrayValues<readonly [1, ...string[]]>>().toBe<1 | string>();
expectTypeOf<ArrayValues<readonly [1, ...string[], 2]>>().toBe<1 | string | 2>();
expectTypeOf<ArrayValues<readonly [1, 2?]>>().toBe<1 | 2 | undefined>();
expectTypeOf<ArrayValues<readonly []>>().toBe<never>();

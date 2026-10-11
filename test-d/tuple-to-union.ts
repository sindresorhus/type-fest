import {expectTypeOf} from 'nz';
import type {TupleToUnion} from '../index.d.ts';

const options = ['a', 'b', 'c'] as const;
type Options = TupleToUnion<typeof options>;

const a: Options = 'a';
expectTypeOf(a).toBeAssignableTo<Options>();
expectTypeOf(a).toBe<'a'>();
expectTypeOf(a).not.toBe<'b'>();
expectTypeOf(a).not.toBe<'c'>();

const b: Options = 'b';
expectTypeOf(b).toBeAssignableTo<Options>();
expectTypeOf(b).not.toBe<'a'>();
expectTypeOf(b).toBe<'b'>();
expectTypeOf(b).not.toBe<'c'>();

const c: Options = 'c';
expectTypeOf(c).toBeAssignableTo<Options>();
expectTypeOf(c).not.toBe<'a'>();
expectTypeOf(c).not.toBe<'b'>();
expectTypeOf(c).toBe<'c'>();

declare const notAnArray: TupleToUnion<[]>;
expectTypeOf(notAnArray).toBe<never>();

declare const worksWithArrays: TupleToUnion<Array<string | number>>;
expectTypeOf(worksWithArrays).toBe<string | number>();

declare const resolvesToNeverForNonArrays: TupleToUnion<string | number>;
expectTypeOf(resolvesToNeverForNonArrays).toBe<never>();

declare const infiniteRestArguments: TupleToUnion<[string, ...number[]]>;
expectTypeOf(infiniteRestArguments).toBe<string | number>();

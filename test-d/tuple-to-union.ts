import {expectTypeOf} from 'expect-type';
import type {TupleToUnion} from '../index';

const options = ['a', 'b', 'c'] as const;
type Options = TupleToUnion<typeof options>;

const a: Options = 'a';
expectTypeOf(a).toMatchTypeOf<Options>();
expectTypeOf(a).toEqualTypeOf<'a'>();
expectTypeOf(a).not.toEqualTypeOf<'b'>();
expectTypeOf(a).not.toEqualTypeOf<'c'>();

const b: Options = 'b';
expectTypeOf(b).toMatchTypeOf<Options>();
expectTypeOf(b).not.toEqualTypeOf<'a'>();
expectTypeOf(b).toEqualTypeOf<'b'>();
expectTypeOf(b).not.toEqualTypeOf<'c'>();

const c: Options = 'c';
expectTypeOf(c).toMatchTypeOf<Options>();
expectTypeOf(c).not.toEqualTypeOf<'a'>();
expectTypeOf(c).not.toEqualTypeOf<'b'>();
expectTypeOf(c).toEqualTypeOf<'c'>();

declare const notAnArray: TupleToUnion<[]>;
expectTypeOf(notAnArray).toEqualTypeOf<never>();

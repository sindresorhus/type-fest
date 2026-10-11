import {expectTypeOf} from 'nz';
import type {IsUnion} from '../index.d.ts';

expectTypeOf<IsUnion<1>>().toBe<false>();
expectTypeOf<IsUnion<true>>().toBe<false>();
expectTypeOf<IsUnion<'foo'>>().toBe<false>();
expectTypeOf<IsUnion<[]>>().toBe<false>();
expectTypeOf<IsUnion<{}>>().toBe<false>();
expectTypeOf<IsUnion<1 & {}>>().toBe<false>();
expectTypeOf<IsUnion<never>>().toBe<false>();
expectTypeOf<IsUnion<unknown>>().toBe<false>();
expectTypeOf<IsUnion<any>>().toBe<false>();

expectTypeOf<IsUnion<1 | 2>>().toBe<true>();
expectTypeOf<IsUnion<'foo' | 'bar'>>().toBe<true>();
expectTypeOf<IsUnion<'foo' | 'bar' | 1>>().toBe<true>();
expectTypeOf<IsUnion<'foo' | 1>>().toBe<true>();
expectTypeOf<IsUnion<[] | {}>>().toBe<true>();

type TestUnion =
	// Here, the entire union extends both the individual members:
	// So, `TestUnion` extends `{opt?: number; a: number; b: string}`, and
	// `TestUnion` extends `{a: number; b: string}`.
	| {opt?: number; a: number; b: string}
	| {a: number; b: string};

expectTypeOf<IsUnion<TestUnion>>().toBe<true>();

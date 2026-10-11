import {expectTypeOf} from 'nz';
import type {RequireOneOrNone, Simplify} from '../index.d.ts';

type OneAtMost = RequireOneOrNone<Record<'foo' | 'bar' | 'baz', true>>;

({}) satisfies OneAtMost;
({foo: true}) satisfies OneAtMost;
({bar: true}) satisfies OneAtMost;
({baz: true}) satisfies OneAtMost;

expectTypeOf<{foo: true; bar: true}>().not.toBeAssignableTo<OneAtMost>();
expectTypeOf<{foo: true; baz: true}>().not.toBeAssignableTo<OneAtMost>();
expectTypeOf<{bar: true; baz: true}>().not.toBeAssignableTo<OneAtMost>();
expectTypeOf<{foo: true; bar: true; baz: true}>().not.toBeAssignableTo<OneAtMost>();

// 'foo' always required
type OneOrTwo = RequireOneOrNone<Record<'foo' | 'bar' | 'baz', true>, 'bar' | 'baz'>;

({foo: true}) satisfies OneOrTwo;
({foo: true, bar: true}) satisfies OneOrTwo;
({foo: true, baz: true}) satisfies OneOrTwo;

expectTypeOf<{}>().not.toBeAssignableTo<OneOrTwo>();
expectTypeOf<{bar: true}>().not.toBeAssignableTo<OneOrTwo>();
expectTypeOf<{baz: true}>().not.toBeAssignableTo<OneOrTwo>();
expectTypeOf<{foo: true; bar: true; baz: true}>().not.toBeAssignableTo<OneOrTwo>();

function narrowingTest(foo: Simplify<RequireOneOrNone<{a: string; b: string}>>): string { // `Simplify` just makes it easier to visualize the narrowing
	if (typeof foo.a === 'string') {
		expectTypeOf(foo.a).toBeAssignableTo<string>();
		expectTypeOf(foo.b).not.toBeAssignableTo<string>();

		return foo.a;
	}

	if (typeof foo.b === 'string') {
		expectTypeOf(foo.b).toBeAssignableTo<string>();
		expectTypeOf(foo.a).not.toBeAssignableTo<string>();

		return foo.b;
	}

	expectTypeOf(foo.a).not.toBeAssignableTo<string>();
	expectTypeOf(foo.b).not.toBeAssignableTo<string>();

	return '';
}

function narrowingTest2(foo: Simplify<RequireOneOrNone<{a: string; b: string; c: string}>>): string { // `Simplify` just makes it easier to visualize the narrowing
	if (typeof foo.a === 'string') {
		expectTypeOf(foo.a).toBeAssignableTo<string>();
		expectTypeOf(foo.b).not.toBeAssignableTo<string>();
		expectTypeOf(foo.c).not.toBeAssignableTo<string>();

		return foo.a;
	}

	if (typeof foo.b === 'string') {
		expectTypeOf(foo.b).toBeAssignableTo<string>();
		expectTypeOf(foo.a).not.toBeAssignableTo<string>();
		expectTypeOf(foo.c).not.toBeAssignableTo<string>();

		return foo.b;
	}

	if (typeof foo.c === 'string') {
		expectTypeOf(foo.c).toBeAssignableTo<string>();
		expectTypeOf(foo.a).not.toBeAssignableTo<string>();
		expectTypeOf(foo.b).not.toBeAssignableTo<string>();

		return foo.c;
	}

	expectTypeOf(foo.a).not.toBeAssignableTo<string>();
	expectTypeOf(foo.b).not.toBeAssignableTo<string>();
	expectTypeOf(foo.c).not.toBeAssignableTo<string>();

	return '';
}

function narrowingTest3(foo: Simplify<RequireOneOrNone<{a: string; b: string; c: string}, 'a' | 'b'>>): string { // `Simplify` just makes it easier to visualize the narrowing
	if (typeof foo.a === 'string') {
		expectTypeOf(foo.c).toBeAssignableTo<string>();

		expectTypeOf(foo.a).toBeAssignableTo<string>();
		expectTypeOf(foo.b).not.toBeAssignableTo<string>();

		return foo.a;
	}

	if (typeof foo.b === 'string') {
		expectTypeOf(foo.c).toBeAssignableTo<string>();

		expectTypeOf(foo.b).toBeAssignableTo<string>();
		expectTypeOf(foo.a).not.toBeAssignableTo<string>();

		return foo.b;
	}

	expectTypeOf(foo.c).toBeAssignableTo<string>();

	expectTypeOf(foo.a).not.toBeAssignableTo<string>();
	expectTypeOf(foo.b).not.toBeAssignableTo<string>();

	return '';
}

// `Simplify` is required for the assertion to pass
expectTypeOf<Simplify<RequireOneOrNone<{a: number; b: string}>>>().toBe<{a: number; b?: never} | {a?: never; b: string} | {a?: never; b?: never}>();
// `Simplify` is required for the assertion to pass
expectTypeOf<Simplify<RequireOneOrNone<{a: number; b: string}, any>>>().toBe<{a: number; b?: never} | {a?: never; b: string} | {a?: never; b?: never}>();
// `Simplify` is required for the assertion to pass
expectTypeOf<Simplify<RequireOneOrNone<{a: number; b: string; c: boolean}>>>().toBe<{a: number; b?: never; c?: never} | {a?: never; b: string; c?: never} | {a?: never; b?: never; c: boolean} | {a?: never; b?: never; c?: never}>();
// `Simplify` is required for the assertion to pass
expectTypeOf<Simplify<RequireOneOrNone<{a: number; b: string; c: boolean}, any>>>().toBe<{a: number; b?: never; c?: never} | {a?: never; b: string; c?: never} | {a?: never; b?: never; c: boolean} | {a?: never; b?: never; c?: never}>();

expectTypeOf<RequireOneOrNone<{}>>().toBe<{}>();
expectTypeOf<RequireOneOrNone<{a: string; b: number}, never>>().toBe<{a: string; b: number}>();

expectTypeOf<RequireOneOrNone<any>>().toBe<any>();
expectTypeOf<RequireOneOrNone<any, 'foo'>>().toBe<any>();
expectTypeOf<RequireOneOrNone<any, any>>().toBe<any>();
expectTypeOf<RequireOneOrNone<any, never>>().toBe<any>();

expectTypeOf<RequireOneOrNone<never>>().toBe<never>();
expectTypeOf<RequireOneOrNone<never, 'foo'>>().toBe<never>();
expectTypeOf<RequireOneOrNone<never, any>>().toBe<never>();
expectTypeOf<RequireOneOrNone<never, never>>().toBe<never>();

// A key that only one member of a union has is accepted, and a member without it is left as it is.
({c: 2}) satisfies RequireOneOrNone<{a?: 1; b?: 1} | {c: 2}, 'a' | 'b'>;
({a: 1}) satisfies RequireOneOrNone<{a?: 1; b?: 1} | {c: 2}, 'a' | 'b'>;
expectTypeOf({a: 1, b: 1} as const).not.toBeAssignableTo<RequireOneOrNone<{a?: 1; b?: 1} | {c: 2}, 'a' | 'b'>>();

// At most one of the keys is allowed across the union members, so a key from another member is not allowed next to it.
type SplitKeys = {a?: 1; z?: 0} | {b?: 2; z?: 0};
({a: 1}) satisfies RequireOneOrNone<SplitKeys, 'a' | 'b'>;
({b: 2, z: 0}) satisfies RequireOneOrNone<SplitKeys, 'a' | 'b'>;
({z: 0}) satisfies RequireOneOrNone<SplitKeys, 'a' | 'b'>;
expectTypeOf({a: 1, b: 2} as const).not.toBeAssignableTo<RequireOneOrNone<SplitKeys, 'a' | 'b'>>();

import {expectAssignable, expectNotAssignable, expectType} from 'tsd';
import type {RequireOneOrNone, Simplify} from '../index.d.ts';

type OneAtMost = RequireOneOrNone<Record<'foo' | 'bar' | 'baz', true>>;

expectAssignable<OneAtMost>({});
expectAssignable<OneAtMost>({foo: true});
expectAssignable<OneAtMost>({bar: true});
expectAssignable<OneAtMost>({baz: true});

expectNotAssignable<OneAtMost>({foo: true, bar: true});
expectNotAssignable<OneAtMost>({foo: true, baz: true});
expectNotAssignable<OneAtMost>({bar: true, baz: true});
expectNotAssignable<OneAtMost>({foo: true, bar: true, baz: true});

// 'foo' always required
type OneOrTwo = RequireOneOrNone<Record<'foo' | 'bar' | 'baz', true>, 'bar' | 'baz'>;

expectAssignable<OneOrTwo>({foo: true});
expectAssignable<OneOrTwo>({foo: true, bar: true});
expectAssignable<OneOrTwo>({foo: true, baz: true});

expectNotAssignable<OneOrTwo>({});
expectNotAssignable<OneOrTwo>({bar: true});
expectNotAssignable<OneOrTwo>({baz: true});
expectNotAssignable<OneOrTwo>({foo: true, bar: true, baz: true});

function narrowingTest(foo: Simplify<RequireOneOrNone<{a: string; b: string}>>): string { // `Simplify` just makes it easier to visualize the narrowing
	if (typeof foo.a === 'string') {
		expectAssignable<string>(foo.a);
		expectNotAssignable<string>(foo.b);

		return foo.a;
	}

	if (typeof foo.b === 'string') {
		expectAssignable<string>(foo.b);
		expectNotAssignable<string>(foo.a);

		return foo.b;
	}

	expectNotAssignable<string>(foo.a);
	expectNotAssignable<string>(foo.b);

	return '';
}

function narrowingTest2(foo: Simplify<RequireOneOrNone<{a: string; b: string; c: string}>>): string { // `Simplify` just makes it easier to visualize the narrowing
	if (typeof foo.a === 'string') {
		expectAssignable<string>(foo.a);
		expectNotAssignable<string>(foo.b);
		expectNotAssignable<string>(foo.c);

		return foo.a;
	}

	if (typeof foo.b === 'string') {
		expectAssignable<string>(foo.b);
		expectNotAssignable<string>(foo.a);
		expectNotAssignable<string>(foo.c);

		return foo.b;
	}

	if (typeof foo.c === 'string') {
		expectAssignable<string>(foo.c);
		expectNotAssignable<string>(foo.a);
		expectNotAssignable<string>(foo.b);

		return foo.c;
	}

	expectNotAssignable<string>(foo.a);
	expectNotAssignable<string>(foo.b);
	expectNotAssignable<string>(foo.c);

	return '';
}

function narrowingTest3(foo: Simplify<RequireOneOrNone<{a: string; b: string; c: string}, 'a' | 'b'>>): string { // `Simplify` just makes it easier to visualize the narrowing
	if (typeof foo.a === 'string') {
		expectAssignable<string>(foo.c);

		expectAssignable<string>(foo.a);
		expectNotAssignable<string>(foo.b);

		return foo.a;
	}

	if (typeof foo.b === 'string') {
		expectAssignable<string>(foo.c);

		expectAssignable<string>(foo.b);
		expectNotAssignable<string>(foo.a);

		return foo.b;
	}

	expectAssignable<string>(foo.c);

	expectNotAssignable<string>(foo.a);
	expectNotAssignable<string>(foo.b);

	return '';
}

expectType<{a: number; b?: never} | {a?: never; b: string} | {a?: never; b?: never}>(
	{} as Simplify<RequireOneOrNone<{a: number; b: string}>>, // `Simplify` is required for the assertion to pass
);
expectType<{a: number; b?: never} | {a?: never; b: string} | {a?: never; b?: never}>(
	{} as Simplify<RequireOneOrNone<{a: number; b: string}, any>>, // `Simplify` is required for the assertion to pass
);
expectType<{a: number; b?: never; c?: never} | {a?: never; b: string; c?: never} | {a?: never; b?: never; c: boolean} | {a?: never; b?: never; c?: never}>(
	{} as Simplify<RequireOneOrNone<{a: number; b: string; c: boolean}>>, // `Simplify` is required for the assertion to pass
);
expectType<{a: number; b?: never; c?: never} | {a?: never; b: string; c?: never} | {a?: never; b?: never; c: boolean} | {a?: never; b?: never; c?: never}>(
	{} as Simplify<RequireOneOrNone<{a: number; b: string; c: boolean}, any>>, // `Simplify` is required for the assertion to pass
);

expectType<{}>({} as RequireOneOrNone<{}>);
expectType<{a: string; b: number}>({} as RequireOneOrNone<{a: string; b: number}, never>);

expectType<any>({} as RequireOneOrNone<any>);
expectType<any>({} as RequireOneOrNone<any, 'foo'>);
expectType<any>({} as RequireOneOrNone<any, any>);
expectType<any>({} as RequireOneOrNone<any, never>);

expectType<never>({} as RequireOneOrNone<never>);
expectType<never>({} as RequireOneOrNone<never, 'foo'>);
expectType<never>({} as RequireOneOrNone<never, any>);
expectType<never>({} as RequireOneOrNone<never, never>);

// A key that only one member of a union has is accepted, and a member without it is left as it is.
expectAssignable<RequireOneOrNone<{a?: 1; b?: 1} | {c: 2}, 'a' | 'b'>>({c: 2});
expectAssignable<RequireOneOrNone<{a?: 1; b?: 1} | {c: 2}, 'a' | 'b'>>({a: 1});
expectNotAssignable<RequireOneOrNone<{a?: 1; b?: 1} | {c: 2}, 'a' | 'b'>>({a: 1, b: 1} as const);

// At most one of the keys is allowed across the union members, so a key from another member is not allowed next to it.
type SplitKeys = {a?: 1; z?: 0} | {b?: 2; z?: 0};
expectAssignable<RequireOneOrNone<SplitKeys, 'a' | 'b'>>({a: 1});
expectAssignable<RequireOneOrNone<SplitKeys, 'a' | 'b'>>({b: 2, z: 0});
expectAssignable<RequireOneOrNone<SplitKeys, 'a' | 'b'>>({z: 0});
expectNotAssignable<RequireOneOrNone<SplitKeys, 'a' | 'b'>>({a: 1, b: 2} as const);

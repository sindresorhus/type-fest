import {expectAssignable, expectNotAssignable, expectType} from 'tsd';
import type {RequireExactlyOne, Simplify} from '../index.d.ts';

type SystemMessages = {
	default: string;

	macos: string;
	linux: string;

	optional?: string;
};

type ValidMessages = RequireExactlyOne<SystemMessages, 'macos' | 'linux'>;
declare const test: (_: ValidMessages) => void;

test({macos: 'hey', default: 'hello'});
test({linux: 'sup', optional: 'howdy', default: 'hello'});

// @ts-expect-error
test({});
// @ts-expect-error
test({macos: 'hey', linux: 'sup', default: 'hello'});

declare const testWithoutKeys: (_: RequireExactlyOne<{a: number; b: number}>) => void;

testWithoutKeys({a: 1});
testWithoutKeys({b: 2});

// @ts-expect-error
testWithoutKeys({});
// @ts-expect-error
testWithoutKeys({a: 1, b: 2});

function narrowingTest(foo: Simplify<RequireExactlyOne<{a: string; b: string}>>): string { // `Simplify` just makes it easier to visualize the narrowing
	if (typeof foo.a === 'string') {
		expectAssignable<string>(foo.a);
		expectNotAssignable<string>(foo.b);

		return foo.a;
	}

	expectAssignable<string>(foo.b);
	expectNotAssignable<string>(foo.a);

	return foo.b;
}

function narrowingTest2(foo: Simplify<RequireExactlyOne<{a: string; b: string; c: string}>>): string { // `Simplify` just makes it easier to visualize the narrowing
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

	expectAssignable<string>(foo.c);
	expectNotAssignable<string>(foo.a);
	expectNotAssignable<string>(foo.b);

	return foo.c;
}

function narrowingTest3(foo: Simplify<RequireExactlyOne<{a: string; b: string; c: string}, 'a' | 'b'>>): string { // `Simplify` just makes it easier to visualize the narrowing
	if (typeof foo.a === 'string') {
		expectAssignable<string>(foo.c);

		expectAssignable<string>(foo.a);
		expectNotAssignable<string>(foo.b);

		return foo.a;
	}

	expectAssignable<string>(foo.c);

	expectAssignable<string>(foo.b);
	expectNotAssignable<string>(foo.a);

	return foo.b;
}

expectType<{a: number; b?: never} | {a?: never; b: string}>({} as Simplify<RequireExactlyOne<{a: number; b: string}>>); // `Simplify` is required for the assertion to pass
expectType<{a: number; b?: never} | {a?: never; b: string}>({} as Simplify<RequireExactlyOne<{a: number; b: string}, any>>); // `Simplify` is required for the assertion to pass
expectType<{a: number; b?: never; c?: never} | {a?: never; b: string; c?: never} | {a?: never; b?: never; c: boolean}>(
	{} as Simplify<RequireExactlyOne<{a: number; b: string; c: boolean}>>, // `Simplify` is required for the assertion to pass
);
expectType<{a: number; b?: never; c?: never} | {a?: never; b: string; c?: never} | {a?: never; b?: never; c: boolean}>(
	{} as Simplify<RequireExactlyOne<{a: number; b: string; c: boolean}, any>>, // `Simplify` is required for the assertion to pass
);

expectType<never>({} as RequireExactlyOne<{}>);
expectType<never>({} as RequireExactlyOne<{a: string; b: number}, never>);

expectType<any>({} as RequireExactlyOne<any>);
expectType<any>({} as RequireExactlyOne<any, 'foo'>);
expectType<any>({} as RequireExactlyOne<any, any>);
expectType<any>({} as RequireExactlyOne<any, never>);

expectType<never>({} as RequireExactlyOne<never>);
expectType<never>({} as RequireExactlyOne<never, 'foo'>);
expectType<never>({} as RequireExactlyOne<never, any>);
expectType<never>({} as RequireExactlyOne<never, never>);

// A key that only one member of a union has is accepted, and a member without it is left as it is.
expectAssignable<RequireExactlyOne<{a?: 1} | {b: 2}, 'a'>>({a: 1});
expectAssignable<RequireExactlyOne<{a?: 1} | {b: 2}, 'a'>>({b: 2});

// A union member that has none of the keys is left as it is.
type Shape = {kind: 'circle'; radius?: number; diameter?: number} | {kind: 'square'; side: number};
expectAssignable<RequireExactlyOne<Shape, 'radius' | 'diameter'>>({kind: 'square', side: 1});
expectAssignable<RequireExactlyOne<Shape, 'radius' | 'diameter'>>({kind: 'circle', radius: 1});
expectNotAssignable<RequireExactlyOne<Shape, 'radius' | 'diameter'>>({kind: 'circle', radius: 1, diameter: 2} as const);

// Exactly one of the keys is required across the union members, so a key from another member is not allowed next to it.
type SplitKeys = {a?: 1; z?: 0} | {b?: 2; z?: 0};
expectAssignable<RequireExactlyOne<SplitKeys, 'a' | 'b'>>({a: 1});
expectAssignable<RequireExactlyOne<SplitKeys, 'a' | 'b'>>({b: 2, z: 0});
expectNotAssignable<RequireExactlyOne<SplitKeys, 'a' | 'b'>>({a: 1, b: 2} as const);
expectNotAssignable<RequireExactlyOne<SplitKeys, 'a' | 'b'>>({z: 0} as const);

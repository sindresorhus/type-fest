import {expectAssignable, expectNotAssignable, expectType} from 'tsd';
import type {RequireAllOrNone, Simplify} from '../index.d.ts';

type SystemMessages = {
	default: string;

	macos: string;
	linux: string;

	optional?: string;
};

type ValidMessages = RequireAllOrNone<SystemMessages, 'macos' | 'linux'>;
declare const test: (_: ValidMessages) => void;

test({default: 'hello'});
test({macos: 'yo', linux: 'sup', optional: 'howdy', default: 'hello'});

// @ts-expect-error
test({});
// @ts-expect-error
test({macos: 'hey', default: 'hello'});
// @ts-expect-error
test({linux: 'hey', default: 'hello'});

declare const testWithoutKeys: (_: RequireAllOrNone<{a: number; b: number}>) => void;

testWithoutKeys({});
testWithoutKeys({a: 1, b: 2});

// @ts-expect-error
testWithoutKeys({a: 1});
// @ts-expect-error
testWithoutKeys({b: 2});

function narrowingTest(foo: Simplify<RequireAllOrNone<{a: string; b: string}>>): string { // `Simplify` just makes it easier to visualize the narrowing
	if (typeof foo.a === 'string') {
		expectAssignable<string>(foo.a);
		expectAssignable<string>(foo.b);

		return foo.a;
	}

	expectNotAssignable<string>(foo.a);
	expectNotAssignable<string>(foo.b);

	return '';
}

function narrowingTest2(foo: Simplify<RequireAllOrNone<{a: string; b: string; c: string}>>): string { // `Simplify` just makes it easier to visualize the narrowing
	if (typeof foo.a === 'string') {
		expectAssignable<string>(foo.a);
		expectAssignable<string>(foo.b);
		expectAssignable<string>(foo.c);

		return foo.a;
	}

	expectNotAssignable<string>(foo.a);
	expectNotAssignable<string>(foo.b);
	expectNotAssignable<string>(foo.c);

	return '';
}

function narrowingTest3(foo: Simplify<RequireAllOrNone<{a: string; b: string; c: string}, 'a' | 'b'>>): string { // `Simplify` just makes it easier to visualize the narrowing
	if (typeof foo.a === 'string') {
		expectAssignable<string>(foo.c);

		expectAssignable<string>(foo.a);
		expectAssignable<string>(foo.b);

		return foo.a;
	}

	expectAssignable<string>(foo.c);

	expectNotAssignable<string>(foo.a);
	expectNotAssignable<string>(foo.b);

	return '';
}

expectType<{a: number; b: string} | {a?: never; b?: never}>({} as Simplify<RequireAllOrNone<{a: number; b: string}>>); // `Simplify` is required for the assertion to pass
expectType<{a: number; b: string} | {a?: never; b?: never}>({} as Simplify<RequireAllOrNone<{a: number; b: string}, any>>); // `Simplify` is required for the assertion to pass
expectType<{a: number; b: string; c: boolean} | {a?: never; b?: never; c?: never}>(
	{} as Simplify<RequireAllOrNone<{a: number; b: string; c: boolean}>>, // `Simplify` is required for the assertion to pass
);
expectType<{a: number; b: string; c: boolean} | {a?: never; b?: never; c?: never}>(
	{} as Simplify<RequireAllOrNone<{a: number; b: string; c: boolean}, any>>, // `Simplify` is required for the assertion to pass
);

expectType<{}>({} as RequireAllOrNone<{}>);
expectType<{a: string; b: number}>({} as RequireAllOrNone<{a: string; b: number}, never>);

expectType<any>({} as RequireAllOrNone<any>);
expectType<any>({} as RequireAllOrNone<any, 'foo'>);
expectType<any>({} as RequireAllOrNone<any, any>);
expectType<any>({} as RequireAllOrNone<any, never>);

expectType<never>({} as RequireAllOrNone<never>);
expectType<never>({} as RequireAllOrNone<never, 'foo'>);
expectType<never>({} as RequireAllOrNone<never, any>);
expectType<never>({} as RequireAllOrNone<never, never>);

import {expectAssignable, expectNotAssignable} from 'tsd';
import type {RequireExactlyOne, Simplify} from '../index';

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

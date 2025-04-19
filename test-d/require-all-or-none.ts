import {expectAssignable, expectNotAssignable} from 'tsd';
import type {RequireAllOrNone, Simplify} from '../index';

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

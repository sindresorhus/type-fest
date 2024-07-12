import type {RequireAllOrNone} from '../index';

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

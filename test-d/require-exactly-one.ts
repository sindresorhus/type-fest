import type {RequireExactlyOne} from '../index';

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

import {expectAssignable} from 'tsd';
import type {RequireAtLeastOne} from '../index';

type SystemMessages = {
	default: string;

	macos?: string;
	linux?: string;
	windows?: string;

	optional?: string;
};

type ValidMessages = RequireAtLeastOne<SystemMessages, 'macos' | 'linux' | 'windows'>;
declare const test: (_: ValidMessages) => void;

test({macos: 'hey', default: 'hello'});
test({linux: 'sup', default: 'hello', optional: 'howdy'});
test({macos: 'hey', linux: 'sup', windows: 'hi', default: 'hello'});

// @ts-expect-error
test({});
// @ts-expect-error
test({macos: 'hey'});
// @ts-expect-error
test({default: 'hello'});

declare const testWithoutKeys: (_: RequireAtLeastOne<{a: number; b: number}>) => void;

testWithoutKeys({a: 1});
testWithoutKeys({b: 2});
testWithoutKeys({a: 1, b: 2});

// @ts-expect-error
testWithoutKeys({});

type MessageBoard<M> = (messages: M) => string;

expectAssignable<MessageBoard<ValidMessages>>(
	({macos = '', linux = '🐧', windows = '⊞'}) =>
		`${linux} + ${windows} = ${macos}`,
);

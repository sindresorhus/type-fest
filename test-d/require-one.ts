import {expectType, expectError} from 'tsd';
import {RequireOne} from '..';

type SystemMessages = {
	default: string;

	macos: string;
	linux: string;

	optional?: string;
};

type ValidMessages = RequireOne<SystemMessages, 'macos' | 'linux'>;
const test = (_: ValidMessages): void => {};

test({macos: 'hey', default: 'hello'});
test({linux: 'sup', optional: 'howdy', default: 'hello'});

expectError(test({}));
expectError(test({macos: 'hey', linux: 'sup', default: 'hello'}));

declare const oneWithoutKeys: RequireOne<{a: number; b: number}>;
expectType<{a: number} | {b: number}>(oneWithoutKeys);
expectError(expectType<{a: number; b: number}>(oneWithoutKeys));

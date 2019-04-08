import {expectType, expectError} from 'tsd';
import {RequireOnlyOne} from '..';

type SystemMessages = {
	default: string;

	macos?: string;
	linux: string;
	windows: string;

	optional?: string;
};

type ValidMessages = RequireOnlyOne<SystemMessages, 'macos' | 'linux' | 'windows'>;
const test = (_: ValidMessages): void => {};

test({macos: 'hey', default: 'hello'});
test({linux: 'sup', default: 'hello'});
test({windows: 'hi', default: 'hello'});
test({windows: 'hi', default: 'hello', optional: 'howdy'});

expectError(test({}));
expectError(test({macos: 'hey'}));
expectError(test({default: 'hello'}));
expectError(test({macos: 'hey', linux: 'sup', default: 'hello'}));

declare const onlyOneWithoutKeys: RequireOnlyOne<{a: number; b: number}>;
expectType<{a: number} | {b: number}>(onlyOneWithoutKeys);

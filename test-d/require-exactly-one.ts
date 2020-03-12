import {expectError, expectAssignable} from 'tsd';
import {RequireExactlyOne} from '..';

type SystemMessages = {
	default: string;

	macos: string;
	linux: string;

	optional?: string;
};

type ValidMessages = RequireExactlyOne<SystemMessages, 'macos' | 'linux'>;
const test = (_: ValidMessages): void => {}; // eslint-disable-line @typescript-eslint/no-empty-function

test({macos: 'hey', default: 'hello'});
test({linux: 'sup', optional: 'howdy', default: 'hello'});

expectError(test({}));
expectError(test({macos: 'hey', linux: 'sup', default: 'hello'}));

declare const oneWithoutKeys: RequireExactlyOne<{a: number; b: number}>;
expectAssignable<{a: number} | {b: number}>(oneWithoutKeys);
expectError(expectAssignable<{a: number; b: number}>(oneWithoutKeys));

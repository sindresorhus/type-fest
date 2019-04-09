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

const system = Math.random() > 0.5 ? {macos: 'hey'} : {linux: 'sup'};
test({default: 'hello', ...system});

expectError(test({}));
expectError(test({macos: 'hey'}));
expectError(test({default: 'hello'}));
expectError(test({macos: 'hey', linux: 'sup', default: 'hello'}));
expectError(test({macos: 'hey', default: 'hello', unknown: 'hmmm'}));

// TODO: Should it eventually be possible to make this negative test pass?
/*
const invalidSystem = Math.random() > 0.5 ? {default: 'hello', macos: 'hey', a: 1, b: 3} : {default: 'hello', linux: 'sup', b: 2};
expectError(test(invalidSystem));
*/

declare const onlyOneWithoutKeys: RequireOnlyOne<{a: number; b: number}>;
expectType<{a: number} | {b: number}>(onlyOneWithoutKeys);

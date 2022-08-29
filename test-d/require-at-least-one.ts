import {expectError, expectAssignable} from 'tsd';
import type {RequireAtLeastOne} from '../index';

type SystemMessages = {
	default: string;

	macos?: string;
	linux?: string;
	windows?: string;

	optional?: string;
};

type MessageBoard<M> = (messages: M) => string;

type ValidMessages = RequireAtLeastOne<
SystemMessages,
'macos' | 'linux' | 'windows'
>;
const test = (_: ValidMessages): void => {}; // eslint-disable-line @typescript-eslint/no-empty-function

test({macos: 'hey', default: 'hello'});
test({linux: 'sup', default: 'hello', optional: 'howdy'});
test({macos: 'hey', linux: 'sup', windows: 'hi', default: 'hello'});

expectError(test({}));
expectError(test({macos: 'hey'}));
expectError(test({default: 'hello'}));

declare const atLeastOneWithoutKeys: RequireAtLeastOne<{
	a: number;
	b: number;
}>;
expectAssignable<{a: number; b?: number} | {a?: number; b: number}>(
	atLeastOneWithoutKeys,
);

expectAssignable<MessageBoard<ValidMessages>>(
	({macos = '', linux = '🐧', windows = '⊞'}) =>
		`${linux} + ${windows} = ${macos}`,
);

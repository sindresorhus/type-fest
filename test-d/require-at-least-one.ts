import {expectTypeOf} from 'expect-type';
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

// @ts-expect-error
test({});
// @ts-expect-error
test({macos: 'hey'});
// @ts-expect-error
test({default: 'hello'});

declare const atLeastOneWithoutKeys: RequireAtLeastOne<{
	a: number;
	b: number;
}>;
expectTypeOf(
	atLeastOneWithoutKeys,
).toMatchTypeOf<{a: number; b?: number} | {a?: number; b: number}>();

expectTypeOf(
	({macos = '', linux = '🐧', windows = '⊞'}) =>
		`${linux} + ${windows} = ${macos}`,
).toMatchTypeOf<MessageBoard<ValidMessages>>();

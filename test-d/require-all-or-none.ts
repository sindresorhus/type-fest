import {expectTypeOf} from 'expect-type';
import type {RequireAllOrNone} from '../index';

type SystemMessages = {
	default: string;

	macos: string;
	linux: string;

	optional?: string;
};

type ValidMessages = RequireAllOrNone<SystemMessages, 'macos' | 'linux'>;
const test = (_: ValidMessages): void => {}; // eslint-disable-line @typescript-eslint/no-empty-function

test({default: 'hello'});
test({macos: 'yo', linux: 'sup', optional: 'howdy', default: 'hello'});

// @ts-expect-error
test({});
// @ts-expect-error
test({macos: 'hey', default: 'hello'});
// @ts-expect-error
test({linux: 'hey', default: 'hello'});

declare const oneWithoutKeys: RequireAllOrNone<{a: number; b: number}>;
expectTypeOf(oneWithoutKeys).toMatchTypeOf<{a: number; b: number}>();

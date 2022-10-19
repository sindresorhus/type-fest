import {expectTypeOf} from 'expect-type';
import type {RequireExactlyOne} from '../index';

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

// @ts-expect-error
test({});
// @ts-expect-error
test({macos: 'hey', linux: 'sup', default: 'hello'});

declare const oneWithoutKeys: RequireExactlyOne<{a: number; b: number}>;
expectTypeOf(oneWithoutKeys).toMatchTypeOf<{a: number} | {b: number}>();
expectTypeOf(oneWithoutKeys).not.toMatchTypeOf<{a: number; b: number}>();

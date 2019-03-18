import {expectType} from 'tsd-check';
import {RequireAtLeastOne} from '..';

type SystemMessages = {
	default: string;

	macos?: string;
	linux?: string;
	windows?: string;

	optional?: string;
};

type ValidMessages = RequireAtLeastOne<SystemMessages, 'macos' | 'linux' | 'windows'>;
const test = (_: ValidMessages[]): void => {};

test([
	{macos: 'hey', default: 'hello'},
	{linux: 'sup', default: 'hello', optional: 'howdy'},
	{macos: 'hey', linux: 'sup', windows: 'hi', default: 'hello'}

	// TODO:
	// Negative examples:
	// {},
	// {macos: 'hey'},
	// {default: 'hello'},
]);

declare const atLeastOneWithoutKeys: RequireAtLeastOne<{a: number; b: number}>;
expectType<{a: number; b?: number} | {a?: number; b: number}>(atLeastOneWithoutKeys);

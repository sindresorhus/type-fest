import {expectType} from 'tsd-check';
import {RequireAtLeastOne} from '..';

type SystemMessages = {
	macos?: string;
	linux?: string;
	windows?: string;
	default?: string;
};

type ValidMessages = RequireAtLeastOne<SystemMessages, 'macos' | 'linux' | 'windows'>;
const test = (_: ValidMessages[]): void => {};

test([
	{macos: 'hey'},
	{macos: 'hey', default: 'hello'},
	{linux: 'sup', windows: 'hi'},
	{macos: 'hey', linux: 'sup', windows: 'hi', default: 'hello'}

	// Negative examples:
	// {},
	// {default: 'hello'},
]);

declare const atLeastOneWithoutKeys: RequireAtLeastOne<{a: number; b: number}>;
expectType<{a: number; b?: number} | {a?: number; b: number}>(atLeastOneWithoutKeys);

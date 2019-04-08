import {expectType} from 'tsd';
import {RequireOnlyOne} from '..';

type SystemMessages = {
	default: string;

	macos: string;
	linux: string;
	windows: string;
};

type ValidMessages = RequireOnlyOne<SystemMessages, 'macos' | 'linux' | 'windows'>;
const test = (_: ValidMessages[]): void => {};

test([
	{macos: 'hey', default: 'hello'},
	{linux: 'sup', default: 'hello'},
	{windows: 'hi', default: 'hello'}
]);

declare const onlyOneWithoutKeys: RequireOnlyOne<{a: number; b: number}>;
expectType<{a: number} | {b: number}>(onlyOneWithoutKeys);

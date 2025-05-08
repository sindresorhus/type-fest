import {expectAssignable, expectType} from 'tsd';
import type {RequireAtLeastOne, Simplify} from '../index.d.ts';

type SystemMessages = {
	default: string;

	macos?: string;
	linux?: string;
	windows?: string;

	optional?: string;
};

type ValidMessages = RequireAtLeastOne<SystemMessages, 'macos' | 'linux' | 'windows'>;
declare const test: (_: ValidMessages) => void;

test({macos: 'hey', default: 'hello'});
test({linux: 'sup', default: 'hello', optional: 'howdy'});
test({macos: 'hey', linux: 'sup', windows: 'hi', default: 'hello'});

// @ts-expect-error
test({});
// @ts-expect-error
test({macos: 'hey'});
// @ts-expect-error
test({default: 'hello'});

declare const testWithoutKeys: (_: RequireAtLeastOne<{a: number; b: number}>) => void;

testWithoutKeys({a: 1});
testWithoutKeys({b: 2});
testWithoutKeys({a: 1, b: 2});

// @ts-expect-error
testWithoutKeys({});

type MessageBoard<M> = (messages: M) => string;

expectAssignable<MessageBoard<ValidMessages>>(
	({macos = '', linux = '🐧', windows = '⊞'}) =>
		`${linux} + ${windows} = ${macos}`,
);

expectType<{a: number; b?: string} | {a?: number; b: string}>(
	{} as Simplify<RequireAtLeastOne<{a: number; b: string}>>, // `Simplify` is required for the assertion to pass
);
expectType<{a: number; b?: string} | {a?: number; b: string}>(
	{} as Simplify<RequireAtLeastOne<{a: number; b: string}, any>>, // `Simplify` is required for the assertion to pass
);
expectType<{a: number; b?: string; c?: boolean} | {a?: number; b: string; c?: boolean} | {a?: number; b?: string; c: boolean}>(
	{} as Simplify<RequireAtLeastOne<{a: number; b: string; c: boolean}>>, // `Simplify` is required for the assertion to pass
);
expectType<{a: number; b?: string; c?: boolean} | {a?: number; b: string; c?: boolean} | {a?: number; b?: string; c: boolean}>(
	{} as Simplify<RequireAtLeastOne<{a: number; b: string; c: boolean}, any>>, // `Simplify` is required for the assertion to pass
);

expectType<never>({} as RequireAtLeastOne<{}>);
expectType<never>({} as RequireAtLeastOne<{a: string; b: number}, never>);

expectType<any>({} as RequireAtLeastOne<any>);
expectType<any>({} as RequireAtLeastOne<any, 'foo'>);
expectType<any>({} as RequireAtLeastOne<any, any>);
expectType<any>({} as RequireAtLeastOne<any, never>);

expectType<never>({} as RequireAtLeastOne<never>);
expectType<never>({} as RequireAtLeastOne<never, 'foo'>);
expectType<never>({} as RequireAtLeastOne<never, any>);
expectType<never>({} as RequireAtLeastOne<never, never>);

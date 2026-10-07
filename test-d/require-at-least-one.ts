import {expectAssignable, expectNotAssignable, expectType} from 'tsd';
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

// A key that only one member of a union has is accepted, and a member without it is left as it is.
expectAssignable<RequireAtLeastOne<{a?: 1} | {b: 2}, 'a'>>({a: 1});
expectAssignable<RequireAtLeastOne<{a?: 1} | {b: 2}, 'a'>>({b: 2});

// Each key of the set is the required one in its own branch of the union, and the others stay optional. The `readonly` of a key travels with it, because the branch is built from `Pick` over the input.
declare const oneOfTwo: Simplify<RequireAtLeastOne<{a?: 1; b?: 2}, 'a' | 'b'>>;
expectType<{a: 1; b?: 2} | {a?: 1; b: 2}>(oneOfTwo);

declare const oneOfTwoReadonly: Simplify<RequireAtLeastOne<{readonly a?: 1; b?: 2}, 'a' | 'b'>>;
expectType<{readonly a: 1; b?: 2} | {readonly a?: 1; b: 2}>(oneOfTwoReadonly);

// A key of the object that the set does not name is carried through in every branch, modifiers included.
declare const untouchedKey: Simplify<RequireAtLeastOne<{a?: 1; b?: 2; readonly c?: string}, 'a' | 'b'>>;
expectType<{a: 1; b?: 2; readonly c?: string} | {a?: 1; b: 2; readonly c?: string}>(untouchedKey);

// A union member that has none of the keys is left as it is.
type Shape = {kind: 'circle'; radius?: number; diameter?: number} | {kind: 'square'; side: number};
expectAssignable<RequireAtLeastOne<Shape, 'radius' | 'diameter'>>({kind: 'square', side: 1});
expectAssignable<RequireAtLeastOne<Shape, 'radius' | 'diameter'>>({kind: 'circle', radius: 1});
expectNotAssignable<RequireAtLeastOne<Shape, 'radius' | 'diameter'>>({kind: 'circle'} as const);

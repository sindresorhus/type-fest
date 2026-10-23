import {expectTypeOf} from 'nz';
import type {RequireAllOrNone, Simplify} from '../index.d.ts';

type SystemMessages = {
	default: string;

	macos: string;
	linux: string;

	optional?: string;
};

type ValidMessages = RequireAllOrNone<SystemMessages, 'macos' | 'linux'>;
declare const test: (_: ValidMessages) => void;

test({default: 'hello'});
test({macos: 'yo', linux: 'sup', optional: 'howdy', default: 'hello'});

// @ts-expect-error
test({});
// @ts-expect-error
test({macos: 'hey', default: 'hello'});
// @ts-expect-error
test({linux: 'hey', default: 'hello'});

declare const testWithoutKeys: (_: RequireAllOrNone<{a: number; b: number}>) => void;

testWithoutKeys({});
testWithoutKeys({a: 1, b: 2});

// @ts-expect-error
testWithoutKeys({a: 1});
// @ts-expect-error
testWithoutKeys({b: 2});

function narrowingTest(foo: Simplify<RequireAllOrNone<{a: string; b: string}>>): string { // `Simplify` just makes it easier to visualize the narrowing
	if (typeof foo.a === 'string') {
		expectTypeOf(foo.a).toBeAssignableTo<string>();
		expectTypeOf(foo.b).toBeAssignableTo<string>();

		return foo.a;
	}

	expectTypeOf(foo.a).not.toBeAssignableTo<string>();
	expectTypeOf(foo.b).not.toBeAssignableTo<string>();

	return '';
}

function narrowingTest2(foo: Simplify<RequireAllOrNone<{a: string; b: string; c: string}>>): string { // `Simplify` just makes it easier to visualize the narrowing
	if (typeof foo.a === 'string') {
		expectTypeOf(foo.a).toBeAssignableTo<string>();
		expectTypeOf(foo.b).toBeAssignableTo<string>();
		expectTypeOf(foo.c).toBeAssignableTo<string>();

		return foo.a;
	}

	expectTypeOf(foo.a).not.toBeAssignableTo<string>();
	expectTypeOf(foo.b).not.toBeAssignableTo<string>();
	expectTypeOf(foo.c).not.toBeAssignableTo<string>();

	return '';
}

function narrowingTest3(foo: Simplify<RequireAllOrNone<{a: string; b: string; c: string}, 'a' | 'b'>>): string { // `Simplify` just makes it easier to visualize the narrowing
	if (typeof foo.a === 'string') {
		expectTypeOf(foo.c).toBeAssignableTo<string>();

		expectTypeOf(foo.a).toBeAssignableTo<string>();
		expectTypeOf(foo.b).toBeAssignableTo<string>();

		return foo.a;
	}

	expectTypeOf(foo.c).toBeAssignableTo<string>();

	expectTypeOf(foo.a).not.toBeAssignableTo<string>();
	expectTypeOf(foo.b).not.toBeAssignableTo<string>();

	return '';
}

expectTypeOf<Simplify<RequireAllOrNone<{a: number; b: string}>>>().toBe<{a: number; b: string} | {a?: never; b?: never}>(); // `Simplify` is required for the assertion to pass
expectTypeOf<Simplify<RequireAllOrNone<{a: number; b: string}, any>>>().toBe<{a: number; b: string} | {a?: never; b?: never}>(); // `Simplify` is required for the assertion to pass
// `Simplify` is required for the assertion to pass
expectTypeOf<Simplify<RequireAllOrNone<{a: number; b: string; c: boolean}>>>().toBe<{a: number; b: string; c: boolean} | {a?: never; b?: never; c?: never}>();
// `Simplify` is required for the assertion to pass
expectTypeOf<Simplify<RequireAllOrNone<{a: number; b: string; c: boolean}, any>>>().toBe<{a: number; b: string; c: boolean} | {a?: never; b?: never; c?: never}>();

expectTypeOf<RequireAllOrNone<{}>>().toBe<{}>();
expectTypeOf<RequireAllOrNone<{a: string; b: number}, never>>().toBe<{a: string; b: number}>();

expectTypeOf<RequireAllOrNone<any>>().toBe<any>();
expectTypeOf<RequireAllOrNone<any, 'foo'>>().toBe<any>();
expectTypeOf<RequireAllOrNone<any, any>>().toBe<any>();
expectTypeOf<RequireAllOrNone<any, never>>().toBe<any>();

expectTypeOf<RequireAllOrNone<never>>().toBe<never>();
expectTypeOf<RequireAllOrNone<never, 'foo'>>().toBe<never>();
expectTypeOf<RequireAllOrNone<never, any>>().toBe<never>();
expectTypeOf<RequireAllOrNone<never, never>>().toBe<never>();

// A key that only one member of a union has is accepted, and a member without it is left as it is.
({c: 2}) satisfies RequireAllOrNone<{a?: 1; b?: 1} | {c: 2}, 'a' | 'b'>;
({a: 1, b: 1}) satisfies RequireAllOrNone<{a?: 1; b?: 1} | {c: 2}, 'a' | 'b'>;
expectTypeOf({a: 1} as const).not.toBeAssignableTo<RequireAllOrNone<{a?: 1; b?: 1} | {c: 2}, 'a' | 'b'>>();

// A dynamic index signature must not erase unrelated required fields or their value types.
type IndexedChoiceOptions = {[key: string]: unknown; readonly requestId: string; readonly enabled?: boolean; cursor?: string; offset?: number};
type IndexedAllOrNone = RequireAllOrNone<IndexedChoiceOptions, 'cursor' | 'offset'>;
({requestId: 'request'}) satisfies IndexedAllOrNone;
({requestId: 'request', cursor: 'next', offset: 1}) satisfies IndexedAllOrNone;
expectTypeOf<{}>().not.toBeAssignableTo<IndexedAllOrNone>();
expectTypeOf<{requestId: number}>().not.toBeAssignableTo<IndexedAllOrNone>();

// Named fields remain readable and retain modifiers beside the dynamic entries.
declare const indexedChoice: IndexedAllOrNone;
expectTypeOf(indexedChoice.requestId).toBe<string>();
expectTypeOf(indexedChoice.enabled).toBe<boolean | undefined>();
expectTypeOf(indexedChoice['custom']).toBe<unknown>();
// @ts-expect-error A valid value cannot replace an unselected readonly field.
indexedChoice.requestId = 'changed';
expectTypeOf<{requestId: string; cursor: string}>().not.toBeAssignableTo<IndexedAllOrNone>();

// Numeric, pattern and symbol signatures also keep the declared fields they cover.
declare const numericChoice: RequireAllOrNone<{[key: number]: unknown; readonly 0: string; 1?: string; 2?: number}, 1 | 2>;
expectTypeOf(numericChoice[0]).toBe<string>();
declare const patternChoice: RequireAllOrNone<{[key: `data-${string}`]: unknown; readonly 'data-id': string; cursor?: string; offset?: number}, 'cursor' | 'offset'>;
expectTypeOf(patternChoice['data-id']).toBe<string>();
declare const retainedSymbol: unique symbol;
declare const symbolChoice: RequireAllOrNone<{[key: symbol]: unknown; readonly [retainedSymbol]: string; cursor?: string; offset?: number}, 'cursor' | 'offset'>;
expectTypeOf(symbolChoice[retainedSymbol]).toBe<string>();

function _readChoiceId<Id>(value: RequireAllOrNone<{requestId: Id; cursor?: string; offset?: number}, 'cursor' | 'offset'>): Id {
	return value.requestId;
}

function makeChoice<const Extra>(value: Extra): RequireAllOrNone<{requestId: string; cursor?: Extra; offset?: number}, 'cursor' | 'offset'> {
	return {requestId: 'request', cursor: value, offset: 1};
}

const inferredChoice = makeChoice('picked');
expectTypeOf(inferredChoice.requestId).toBe<string>();
expectTypeOf(inferredChoice.cursor).toBe<'picked' | undefined>();
expectTypeOf<RequireAllOrNone<unknown>>().toBe<unknown>();

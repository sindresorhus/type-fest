import {expectTypeOf} from 'nz';
import type {RequireOneOrNone, Simplify} from '../index.d.ts';

type OneAtMost = RequireOneOrNone<Record<'foo' | 'bar' | 'baz', true>>;

({}) satisfies OneAtMost;
({foo: true}) satisfies OneAtMost;
({bar: true}) satisfies OneAtMost;
({baz: true}) satisfies OneAtMost;

expectTypeOf<{foo: true; bar: true}>().not.toBeAssignableTo<OneAtMost>();
expectTypeOf<{foo: true; baz: true}>().not.toBeAssignableTo<OneAtMost>();
expectTypeOf<{bar: true; baz: true}>().not.toBeAssignableTo<OneAtMost>();
expectTypeOf<{foo: true; bar: true; baz: true}>().not.toBeAssignableTo<OneAtMost>();

// 'foo' always required
type OneOrTwo = RequireOneOrNone<Record<'foo' | 'bar' | 'baz', true>, 'bar' | 'baz'>;

({foo: true}) satisfies OneOrTwo;
({foo: true, bar: true}) satisfies OneOrTwo;
({foo: true, baz: true}) satisfies OneOrTwo;

expectTypeOf<{}>().not.toBeAssignableTo<OneOrTwo>();
expectTypeOf<{bar: true}>().not.toBeAssignableTo<OneOrTwo>();
expectTypeOf<{baz: true}>().not.toBeAssignableTo<OneOrTwo>();
expectTypeOf<{foo: true; bar: true; baz: true}>().not.toBeAssignableTo<OneOrTwo>();

function narrowingTest(foo: Simplify<RequireOneOrNone<{a: string; b: string}>>): string { // `Simplify` just makes it easier to visualize the narrowing
	if (typeof foo.a === 'string') {
		expectTypeOf(foo.a).toBeAssignableTo<string>();
		expectTypeOf(foo.b).not.toBeAssignableTo<string>();

		return foo.a;
	}

	if (typeof foo.b === 'string') {
		expectTypeOf(foo.b).toBeAssignableTo<string>();
		expectTypeOf(foo.a).not.toBeAssignableTo<string>();

		return foo.b;
	}

	expectTypeOf(foo.a).not.toBeAssignableTo<string>();
	expectTypeOf(foo.b).not.toBeAssignableTo<string>();

	return '';
}

function narrowingTest2(foo: Simplify<RequireOneOrNone<{a: string; b: string; c: string}>>): string { // `Simplify` just makes it easier to visualize the narrowing
	if (typeof foo.a === 'string') {
		expectTypeOf(foo.a).toBeAssignableTo<string>();
		expectTypeOf(foo.b).not.toBeAssignableTo<string>();
		expectTypeOf(foo.c).not.toBeAssignableTo<string>();

		return foo.a;
	}

	if (typeof foo.b === 'string') {
		expectTypeOf(foo.b).toBeAssignableTo<string>();
		expectTypeOf(foo.a).not.toBeAssignableTo<string>();
		expectTypeOf(foo.c).not.toBeAssignableTo<string>();

		return foo.b;
	}

	if (typeof foo.c === 'string') {
		expectTypeOf(foo.c).toBeAssignableTo<string>();
		expectTypeOf(foo.a).not.toBeAssignableTo<string>();
		expectTypeOf(foo.b).not.toBeAssignableTo<string>();

		return foo.c;
	}

	expectTypeOf(foo.a).not.toBeAssignableTo<string>();
	expectTypeOf(foo.b).not.toBeAssignableTo<string>();
	expectTypeOf(foo.c).not.toBeAssignableTo<string>();

	return '';
}

function narrowingTest3(foo: Simplify<RequireOneOrNone<{a: string; b: string; c: string}, 'a' | 'b'>>): string { // `Simplify` just makes it easier to visualize the narrowing
	if (typeof foo.a === 'string') {
		expectTypeOf(foo.c).toBeAssignableTo<string>();

		expectTypeOf(foo.a).toBeAssignableTo<string>();
		expectTypeOf(foo.b).not.toBeAssignableTo<string>();

		return foo.a;
	}

	if (typeof foo.b === 'string') {
		expectTypeOf(foo.c).toBeAssignableTo<string>();

		expectTypeOf(foo.b).toBeAssignableTo<string>();
		expectTypeOf(foo.a).not.toBeAssignableTo<string>();

		return foo.b;
	}

	expectTypeOf(foo.c).toBeAssignableTo<string>();

	expectTypeOf(foo.a).not.toBeAssignableTo<string>();
	expectTypeOf(foo.b).not.toBeAssignableTo<string>();

	return '';
}

// `Simplify` is required for the assertion to pass
expectTypeOf<Simplify<RequireOneOrNone<{a: number; b: string}>>>().toBe<{a: number; b?: never} | {a?: never; b: string} | {a?: never; b?: never}>();
// `Simplify` is required for the assertion to pass
expectTypeOf<Simplify<RequireOneOrNone<{a: number; b: string}, any>>>().toBe<{a: number; b?: never} | {a?: never; b: string} | {a?: never; b?: never}>();
// `Simplify` is required for the assertion to pass
expectTypeOf<Simplify<RequireOneOrNone<{a: number; b: string; c: boolean}>>>().toBe<{a: number; b?: never; c?: never} | {a?: never; b: string; c?: never} | {a?: never; b?: never; c: boolean} | {a?: never; b?: never; c?: never}>();
// `Simplify` is required for the assertion to pass
expectTypeOf<Simplify<RequireOneOrNone<{a: number; b: string; c: boolean}, any>>>().toBe<{a: number; b?: never; c?: never} | {a?: never; b: string; c?: never} | {a?: never; b?: never; c: boolean} | {a?: never; b?: never; c?: never}>();

expectTypeOf<RequireOneOrNone<{}>>().toBe<{}>();
expectTypeOf<RequireOneOrNone<{a: string; b: number}, never>>().toBe<{a: string; b: number}>();

expectTypeOf<RequireOneOrNone<any>>().toBe<any>();
expectTypeOf<RequireOneOrNone<any, 'foo'>>().toBe<any>();
expectTypeOf<RequireOneOrNone<any, any>>().toBe<any>();
expectTypeOf<RequireOneOrNone<any, never>>().toBe<any>();

expectTypeOf<RequireOneOrNone<never>>().toBe<never>();
expectTypeOf<RequireOneOrNone<never, 'foo'>>().toBe<never>();
expectTypeOf<RequireOneOrNone<never, any>>().toBe<never>();
expectTypeOf<RequireOneOrNone<never, never>>().toBe<never>();

// A key that only one member of a union has is accepted, and a member without it is left as it is.
({c: 2}) satisfies RequireOneOrNone<{a?: 1; b?: 1} | {c: 2}, 'a' | 'b'>;
({a: 1}) satisfies RequireOneOrNone<{a?: 1; b?: 1} | {c: 2}, 'a' | 'b'>;
expectTypeOf({a: 1, b: 1} as const).not.toBeAssignableTo<RequireOneOrNone<{a?: 1; b?: 1} | {c: 2}, 'a' | 'b'>>();

// At most one of the keys is allowed across the union members, so a key from another member is not allowed next to it.
type SplitKeys = {a?: 1; z?: 0} | {b?: 2; z?: 0};
({a: 1}) satisfies RequireOneOrNone<SplitKeys, 'a' | 'b'>;
({b: 2, z: 0}) satisfies RequireOneOrNone<SplitKeys, 'a' | 'b'>;
({z: 0}) satisfies RequireOneOrNone<SplitKeys, 'a' | 'b'>;
expectTypeOf({a: 1, b: 2} as const).not.toBeAssignableTo<RequireOneOrNone<SplitKeys, 'a' | 'b'>>();

// Numeric and string spellings in different alternatives still name one possible property.
type NumericAlternatives = {0?: string; foo?: Date} | {'0'?: number; bar?: boolean};
expectTypeOf<{0: string}>().toBeAssignableTo<RequireOneOrNone<NumericAlternatives>>();
expectTypeOf<{'0': number}>().toBeAssignableTo<RequireOneOrNone<NumericAlternatives>>();
expectTypeOf<{0: boolean}>().not.toBeAssignableTo<RequireOneOrNone<NumericAlternatives>>();
expectTypeOf<{0: string; foo: Date}>().not.toBeAssignableTo<RequireOneOrNone<NumericAlternatives>>();
expectTypeOf<{'0': number; bar: true}>().not.toBeAssignableTo<RequireOneOrNone<NumericAlternatives>>();
expectTypeOf<{foo: Date}>().toBeAssignableTo<RequireOneOrNone<NumericAlternatives>>();
expectTypeOf<{bar: boolean}>().toBeAssignableTo<RequireOneOrNone<NumericAlternatives>>();
expectTypeOf<{0: string}>().toBeAssignableTo<RequireOneOrNone<NumericAlternatives, any>>();

// Unselected required fields and source modifiers retain their original role.
type NumericMessages = {readonly 0?: string; fallback?: Date; kind: 'text'} | {'0'?: number; fallback?: Date; kind: 'count'};
type NumericMessageChoice = RequireOneOrNone<NumericMessages, 0 | '0' | 'fallback'>;
expectTypeOf<{readonly 0: string; kind: 'text'}>().toBeAssignableTo<NumericMessageChoice>();
expectTypeOf<{'0': number; kind: 'count'}>().toBeAssignableTo<NumericMessageChoice>();
expectTypeOf<{0: string; kind: 'count'}>().not.toBeAssignableTo<NumericMessageChoice>();
expectTypeOf<{0: string}>().not.toBeAssignableTo<NumericMessageChoice>();
expectTypeOf<{0: string; fallback: Date; kind: 'text'}>().not.toBeAssignableTo<NumericMessageChoice>();

// Noncanonical names are different properties and remain mutually exclusive.
type PaddedAlternatives = {1?: string} | {'01'?: number};
expectTypeOf<{1: string}>().toBeAssignableTo<RequireOneOrNone<PaddedAlternatives>>();
expectTypeOf<{'01': number}>().toBeAssignableTo<RequireOneOrNone<PaddedAlternatives>>();
expectTypeOf<{1: string; '01': number}>().not.toBeAssignableTo<RequireOneOrNone<PaddedAlternatives>>();
expectTypeOf<{[-2]: string}>().toBeAssignableTo<RequireOneOrNone<{[-2]?: string} | {'-2'?: number}>>();
expectTypeOf<{'1.5': number}>().toBeAssignableTo<RequireOneOrNone<{1.5?: string} | {'1.5'?: number}>>();

declare const aliasSymbol: unique symbol;
type SymbolAlternatives = {[aliasSymbol]?: string} | {other?: number};
expectTypeOf<{[aliasSymbol]: string}>().toBeAssignableTo<RequireOneOrNone<SymbolAlternatives>>();
expectTypeOf<{[aliasSymbol]: string; other: number}>().not.toBeAssignableTo<RequireOneOrNone<SymbolAlternatives>>();
expectTypeOf<{0: unknown}>().toBeAssignableTo<RequireOneOrNone<{0?: unknown} | {'0'?: string}>>();
expectTypeOf<{0: any}>().toBeAssignableTo<RequireOneOrNone<{0?: any} | {'0'?: string}>>();
expectTypeOf<{0: never}>().toBeAssignableTo<RequireOneOrNone<{0?: never} | {'0'?: string}>>();
expectTypeOf<{0: undefined}>().not.toBeAssignableTo<RequireOneOrNone<{0?: never} | {'0'?: string}>>();
expectTypeOf<RequireOneOrNone<unknown>>().toBe<unknown>();
expectTypeOf<{}>().toBeAssignableTo<RequireOneOrNone<NumericAlternatives>>();

// Duplicate aliases belonging to other alternatives still forbid a second real property.
type ForeignNumericAliases = {a?: true} | {0?: string} | {'0'?: number};
expectTypeOf<{a: true; 0: string}>().not.toBeAssignableTo<RequireOneOrNone<ForeignNumericAliases>>();
expectTypeOf<{a: true; '0': number}>().not.toBeAssignableTo<RequireOneOrNone<ForeignNumericAliases>>();
expectTypeOf<{a: true}>().toBeAssignableTo<RequireOneOrNone<ForeignNumericAliases>>();
expectTypeOf<{0: string}>().toBeAssignableTo<RequireOneOrNone<ForeignNumericAliases>>();

// Forbidden keys keep their declared numeric spelling so ordinary keyof and Pick still work.
expectTypeOf<keyof RequireOneOrNone<{0: string; 1: number}>>().toBe<0 | 1>();
type PickNumericChoice = Pick<RequireOneOrNone<{0: string; 1: number}>, 0>;
expectTypeOf<{0: string}>().toBeAssignableTo<PickNumericChoice>();
expectTypeOf<keyof RequireOneOrNone<{0?: string} | {1?: number}>>().toBe<0 | 1>();
type PickForeignNumericChoice = Pick<RequireOneOrNone<{0?: string} | {1?: number}>, 0>;
expectTypeOf<{0: string}>().toBeAssignableTo<PickForeignNumericChoice>();

// A dynamic index signature must not erase unrelated required fields or their value types.
type IndexedChoiceOptions = {[key: string]: unknown; readonly requestId: string; readonly enabled?: boolean; cursor?: string; offset?: number};
type IndexedOneOrNone = RequireOneOrNone<IndexedChoiceOptions, 'cursor' | 'offset'>;
({requestId: 'request'}) satisfies IndexedOneOrNone;
({requestId: 'request', cursor: 'next'}) satisfies IndexedOneOrNone;
({requestId: 'request', offset: 1}) satisfies IndexedOneOrNone;
expectTypeOf<{}>().not.toBeAssignableTo<IndexedOneOrNone>();
expectTypeOf<{requestId: number; cursor: string}>().not.toBeAssignableTo<IndexedOneOrNone>();

// Named fields remain readable and retain modifiers beside the dynamic entries.
declare const indexedChoice: IndexedOneOrNone;
expectTypeOf(indexedChoice.requestId).toBe<string>();
expectTypeOf(indexedChoice.enabled).toBe<boolean | undefined>();
expectTypeOf(indexedChoice['custom']).toBe<unknown>();
// @ts-expect-error A valid value cannot replace an unselected readonly field.
indexedChoice.requestId = 'changed';
expectTypeOf<{requestId: string; cursor: string; offset: number}>().not.toBeAssignableTo<IndexedOneOrNone>();

// Numeric, pattern and symbol signatures also keep the declared fields they cover.
declare const numericChoice: RequireOneOrNone<{[key: number]: unknown; readonly 0: string; 1?: string; 2?: number}, 1 | 2>;
expectTypeOf(numericChoice[0]).toBe<string>();
declare const patternChoice: RequireOneOrNone<{[key: `data-${string}`]: unknown; readonly 'data-id': string; cursor?: string; offset?: number}, 'cursor' | 'offset'>;
expectTypeOf(patternChoice['data-id']).toBe<string>();
declare const retainedSymbol: unique symbol;
declare const symbolChoice: RequireOneOrNone<{[key: symbol]: unknown; readonly [retainedSymbol]: string; cursor?: string; offset?: number}, 'cursor' | 'offset'>;
expectTypeOf(symbolChoice[retainedSymbol]).toBe<string>();

function _readChoiceId<Id>(value: RequireOneOrNone<{requestId: Id; cursor?: string; offset?: number}, 'cursor' | 'offset'>): Id {
	return value.requestId;
}

function makeChoice<const Extra>(value: Extra): RequireOneOrNone<{requestId: string; cursor?: Extra; offset?: number}, 'cursor' | 'offset'> {
	return {requestId: 'request', cursor: value};
}

const inferredChoice = makeChoice('picked');
expectTypeOf(inferredChoice.requestId).toBe<string>();
expectTypeOf(inferredChoice.cursor).toBe<'picked' | undefined>();

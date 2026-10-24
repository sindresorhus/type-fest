import {expectTypeOf} from 'nz';
import type {RequireExactlyOne, Simplify} from '../index.d.ts';

type SystemMessages = {
	default: string;

	macos: string;
	linux: string;

	optional?: string;
};

type ValidMessages = RequireExactlyOne<SystemMessages, 'macos' | 'linux'>;
declare const test: (_: ValidMessages) => void;

test({macos: 'hey', default: 'hello'});
test({linux: 'sup', optional: 'howdy', default: 'hello'});

// @ts-expect-error
test({});
// @ts-expect-error
test({macos: 'hey', linux: 'sup', default: 'hello'});

declare const testWithoutKeys: (_: RequireExactlyOne<{a: number; b: number}>) => void;

testWithoutKeys({a: 1});
testWithoutKeys({b: 2});

// @ts-expect-error
testWithoutKeys({});
// @ts-expect-error
testWithoutKeys({a: 1, b: 2});

function narrowingTest(foo: Simplify<RequireExactlyOne<{a: string; b: string}>>): string { // `Simplify` just makes it easier to visualize the narrowing
	if (typeof foo.a === 'string') {
		expectTypeOf(foo.a).toBeAssignableTo<string>();
		expectTypeOf(foo.b).not.toBeAssignableTo<string>();

		return foo.a;
	}

	expectTypeOf(foo.b).toBeAssignableTo<string>();
	expectTypeOf(foo.a).not.toBeAssignableTo<string>();

	return foo.b;
}

function narrowingTest2(foo: Simplify<RequireExactlyOne<{a: string; b: string; c: string}>>): string { // `Simplify` just makes it easier to visualize the narrowing
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

	expectTypeOf(foo.c).toBeAssignableTo<string>();
	expectTypeOf(foo.a).not.toBeAssignableTo<string>();
	expectTypeOf(foo.b).not.toBeAssignableTo<string>();

	return foo.c;
}

function narrowingTest3(foo: Simplify<RequireExactlyOne<{a: string; b: string; c: string}, 'a' | 'b'>>): string { // `Simplify` just makes it easier to visualize the narrowing
	if (typeof foo.a === 'string') {
		expectTypeOf(foo.c).toBeAssignableTo<string>();

		expectTypeOf(foo.a).toBeAssignableTo<string>();
		expectTypeOf(foo.b).not.toBeAssignableTo<string>();

		return foo.a;
	}

	expectTypeOf(foo.c).toBeAssignableTo<string>();

	expectTypeOf(foo.b).toBeAssignableTo<string>();
	expectTypeOf(foo.a).not.toBeAssignableTo<string>();

	return foo.b;
}

expectTypeOf<Simplify<RequireExactlyOne<{a: number; b: string}>>>().toBe<{a: number; b?: never} | {a?: never; b: string}>(); // `Simplify` is required for the assertion to pass
expectTypeOf<Simplify<RequireExactlyOne<{a: number; b: string}, any>>>().toBe<{a: number; b?: never} | {a?: never; b: string}>(); // `Simplify` is required for the assertion to pass
// `Simplify` is required for the assertion to pass
expectTypeOf<Simplify<RequireExactlyOne<{a: number; b: string; c: boolean}>>>().toBe<{a: number; b?: never; c?: never} | {a?: never; b: string; c?: never} | {a?: never; b?: never; c: boolean}>();
// `Simplify` is required for the assertion to pass
expectTypeOf<Simplify<RequireExactlyOne<{a: number; b: string; c: boolean}, any>>>().toBe<{a: number; b?: never; c?: never} | {a?: never; b: string; c?: never} | {a?: never; b?: never; c: boolean}>();

expectTypeOf<RequireExactlyOne<{}>>().toBe<never>();
expectTypeOf<RequireExactlyOne<{a: string; b: number}, never>>().toBe<never>();

expectTypeOf<RequireExactlyOne<any>>().toBe<any>();
expectTypeOf<RequireExactlyOne<any, 'foo'>>().toBe<any>();
expectTypeOf<RequireExactlyOne<any, any>>().toBe<any>();
expectTypeOf<RequireExactlyOne<any, never>>().toBe<any>();

expectTypeOf<RequireExactlyOne<never>>().toBe<never>();
expectTypeOf<RequireExactlyOne<never, 'foo'>>().toBe<never>();
expectTypeOf<RequireExactlyOne<never, any>>().toBe<never>();
expectTypeOf<RequireExactlyOne<never, never>>().toBe<never>();

// A key that only one member of a union has is accepted, and a member without it is left as it is.
({a: 1}) satisfies RequireExactlyOne<{a?: 1} | {b: 2}, 'a'>;
({b: 2}) satisfies RequireExactlyOne<{a?: 1} | {b: 2}, 'a'>;

// A union member that has none of the keys is left as it is.
type Shape = {kind: 'circle'; radius?: number; diameter?: number} | {kind: 'square'; side: number};
({kind: 'square', side: 1}) satisfies RequireExactlyOne<Shape, 'radius' | 'diameter'>;
({kind: 'circle', radius: 1}) satisfies RequireExactlyOne<Shape, 'radius' | 'diameter'>;
expectTypeOf({kind: 'circle', radius: 1, diameter: 2} as const).not.toBeAssignableTo<RequireExactlyOne<Shape, 'radius' | 'diameter'>>();

// Exactly one of the keys is required across the union members, so a key from another member is not allowed next to it.
type SplitKeys = {a?: 1; z?: 0} | {b?: 2; z?: 0};
({a: 1}) satisfies RequireExactlyOne<SplitKeys, 'a' | 'b'>;
({b: 2, z: 0}) satisfies RequireExactlyOne<SplitKeys, 'a' | 'b'>;
expectTypeOf({a: 1, b: 2} as const).not.toBeAssignableTo<RequireExactlyOne<SplitKeys, 'a' | 'b'>>();
expectTypeOf({z: 0} as const).not.toBeAssignableTo<RequireExactlyOne<SplitKeys, 'a' | 'b'>>();

// Numeric and string spellings in different alternatives still name one possible property.
type NumericAlternatives = {0?: string; foo?: Date} | {'0'?: number; bar?: boolean};
expectTypeOf<{0: string}>().toBeAssignableTo<RequireExactlyOne<NumericAlternatives>>();
expectTypeOf<{'0': number}>().toBeAssignableTo<RequireExactlyOne<NumericAlternatives>>();
expectTypeOf<{0: boolean}>().not.toBeAssignableTo<RequireExactlyOne<NumericAlternatives>>();
expectTypeOf<{0: string; foo: Date}>().not.toBeAssignableTo<RequireExactlyOne<NumericAlternatives>>();
expectTypeOf<{'0': number; bar: true}>().not.toBeAssignableTo<RequireExactlyOne<NumericAlternatives>>();
expectTypeOf<{foo: Date}>().toBeAssignableTo<RequireExactlyOne<NumericAlternatives>>();
expectTypeOf<{bar: boolean}>().toBeAssignableTo<RequireExactlyOne<NumericAlternatives>>();
expectTypeOf<{0: string}>().toBeAssignableTo<RequireExactlyOne<NumericAlternatives, any>>();

// Unselected required fields and source modifiers retain their original role.
type NumericMessages = {readonly 0?: string; fallback?: Date; kind: 'text'} | {'0'?: number; fallback?: Date; kind: 'count'};
type NumericMessageChoice = RequireExactlyOne<NumericMessages, 0 | '0' | 'fallback'>;
expectTypeOf<{readonly 0: string; kind: 'text'}>().toBeAssignableTo<NumericMessageChoice>();
expectTypeOf<{'0': number; kind: 'count'}>().toBeAssignableTo<NumericMessageChoice>();
expectTypeOf<{0: string; kind: 'count'}>().not.toBeAssignableTo<NumericMessageChoice>();
expectTypeOf<{0: string}>().not.toBeAssignableTo<NumericMessageChoice>();
expectTypeOf<{0: string; fallback: Date; kind: 'text'}>().not.toBeAssignableTo<NumericMessageChoice>();

// Noncanonical names are different properties and remain mutually exclusive.
type PaddedAlternatives = {1?: string} | {'01'?: number};
expectTypeOf<{1: string}>().toBeAssignableTo<RequireExactlyOne<PaddedAlternatives>>();
expectTypeOf<{'01': number}>().toBeAssignableTo<RequireExactlyOne<PaddedAlternatives>>();
expectTypeOf<{1: string; '01': number}>().not.toBeAssignableTo<RequireExactlyOne<PaddedAlternatives>>();
expectTypeOf<{[-2]: string}>().toBeAssignableTo<RequireExactlyOne<{[-2]?: string} | {'-2'?: number}>>();
expectTypeOf<{'1.5': number}>().toBeAssignableTo<RequireExactlyOne<{1.5?: string} | {'1.5'?: number}>>();

declare const aliasSymbol: unique symbol;
type SymbolAlternatives = {[aliasSymbol]?: string} | {other?: number};
expectTypeOf<{[aliasSymbol]: string}>().toBeAssignableTo<RequireExactlyOne<SymbolAlternatives>>();
expectTypeOf<{[aliasSymbol]: string; other: number}>().not.toBeAssignableTo<RequireExactlyOne<SymbolAlternatives>>();
expectTypeOf<{0: unknown}>().toBeAssignableTo<RequireExactlyOne<{0?: unknown} | {'0'?: string}>>();
expectTypeOf<{0: any}>().toBeAssignableTo<RequireExactlyOne<{0?: any} | {'0'?: string}>>();
expectTypeOf<{0: never}>().toBeAssignableTo<RequireExactlyOne<{0?: never} | {'0'?: string}>>();
expectTypeOf<{0: undefined}>().not.toBeAssignableTo<RequireExactlyOne<{0?: never} | {'0'?: string}>>();
expectTypeOf<RequireExactlyOne<unknown>>().toBe<never>();
expectTypeOf<{}>().not.toBeAssignableTo<RequireExactlyOne<NumericAlternatives>>();

// Duplicate aliases belonging to other alternatives still forbid a second real property.
type ForeignNumericAliases = {a?: true} | {0?: string} | {'0'?: number};
expectTypeOf<{a: true; 0: string}>().not.toBeAssignableTo<RequireExactlyOne<ForeignNumericAliases>>();
expectTypeOf<{a: true; '0': number}>().not.toBeAssignableTo<RequireExactlyOne<ForeignNumericAliases>>();
expectTypeOf<{a: true}>().toBeAssignableTo<RequireExactlyOne<ForeignNumericAliases>>();
expectTypeOf<{0: string}>().toBeAssignableTo<RequireExactlyOne<ForeignNumericAliases>>();

// A string enum key and its plain string spelling are the same property, so the enum member is not forbidden by its own alias.
enum AliasedField {
	Name = 'name',
}

type EnumAliasAlternatives = RequireExactlyOne<{[AliasedField.Name]: 1} | {name: 2; other: 1}>;
expectTypeOf<{[AliasedField.Name]: 1}>().toBeAssignableTo<EnumAliasAlternatives>();
expectTypeOf<{name: 2}>().toBeAssignableTo<EnumAliasAlternatives>();
expectTypeOf<{other: 1}>().toBeAssignableTo<EnumAliasAlternatives>();
expectTypeOf<{[AliasedField.Name]: 1; other: 1}>().not.toBeAssignableTo<EnumAliasAlternatives>();
expectTypeOf<{name: 2; other: 1}>().not.toBeAssignableTo<EnumAliasAlternatives>();

// Forbidden keys keep their declared numeric spelling so ordinary keyof and Pick still work.
expectTypeOf<keyof RequireExactlyOne<{0: string; 1: number}>>().toBe<0 | 1>();
type PickNumericChoice = Pick<RequireExactlyOne<{0: string; 1: number}>, 0>;
expectTypeOf<{0: string}>().toBeAssignableTo<PickNumericChoice>();
expectTypeOf<keyof RequireExactlyOne<{0?: string} | {1?: number}>>().toBe<0 | 1>();
type PickForeignNumericChoice = Pick<RequireExactlyOne<{0?: string} | {1?: number}>, 0>;
expectTypeOf<{0: string}>().toBeAssignableTo<PickForeignNumericChoice>();

// A dynamic index signature must not erase unrelated required fields or their value types.
type IndexedChoiceOptions = {[key: string]: unknown; readonly requestId: string; readonly enabled?: boolean; cursor?: string; offset?: number};
type IndexedExactlyOne = RequireExactlyOne<IndexedChoiceOptions, 'cursor' | 'offset'>;
({requestId: 'request', cursor: 'next'}) satisfies IndexedExactlyOne;
({requestId: 'request', offset: 1}) satisfies IndexedExactlyOne;
expectTypeOf<{cursor: string}>().not.toBeAssignableTo<IndexedExactlyOne>();
expectTypeOf<{requestId: number; cursor: string}>().not.toBeAssignableTo<IndexedExactlyOne>();

// Named fields remain readable and retain modifiers beside the dynamic entries.
declare const indexedChoice: IndexedExactlyOne;
expectTypeOf(indexedChoice.requestId).toBe<string>();
expectTypeOf(indexedChoice.enabled).toBe<boolean | undefined>();
expectTypeOf(indexedChoice['custom']).toBe<unknown>();
// @ts-expect-error A valid value cannot replace an unselected readonly field.
indexedChoice.requestId = 'changed';
expectTypeOf<{requestId: string; cursor: string; offset: number}>().not.toBeAssignableTo<IndexedExactlyOne>();

// Numeric, pattern and symbol signatures also keep the declared fields they cover.
declare const numericChoice: RequireExactlyOne<{[key: number]: unknown; readonly 0: string; 1?: string; 2?: number}, 1 | 2>;
expectTypeOf(numericChoice[0]).toBe<string>();
declare const patternChoice: RequireExactlyOne<{[key: `data-${string}`]: unknown; readonly 'data-id': string; cursor?: string; offset?: number}, 'cursor' | 'offset'>;
expectTypeOf(patternChoice['data-id']).toBe<string>();
declare const retainedSymbol: unique symbol;
declare const symbolChoice: RequireExactlyOne<{[key: symbol]: unknown; readonly [retainedSymbol]: string; cursor?: string; offset?: number}, 'cursor' | 'offset'>;
expectTypeOf(symbolChoice[retainedSymbol]).toBe<string>();

function _readChoiceId<Id>(value: RequireExactlyOne<{requestId: Id; cursor?: string; offset?: number}, 'cursor' | 'offset'>): Id {
	return value.requestId;
}

function makeChoice<const Extra>(value: Extra): RequireExactlyOne<{requestId: string; cursor?: Extra; offset?: number}, 'cursor' | 'offset'> {
	return {requestId: 'request', cursor: value};
}

const inferredChoice = makeChoice('picked');
expectTypeOf(inferredChoice.requestId).toBe<string>();
expectTypeOf(inferredChoice.cursor).toBe<'picked' | undefined>();

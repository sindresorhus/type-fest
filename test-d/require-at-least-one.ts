import {expectTypeOf} from 'nz';
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

expectTypeOf(
	({macos = '', linux = '🐧', windows = '⊞'}) =>
		`${linux} + ${windows} = ${macos}`,
).toBeAssignableTo<MessageBoard<ValidMessages>>();

// `Simplify` is required for the assertion to pass
expectTypeOf<Simplify<RequireAtLeastOne<{a: number; b: string}>>>().toBe<{a: number; b?: string} | {a?: number; b: string}>();
// `Simplify` is required for the assertion to pass
expectTypeOf<Simplify<RequireAtLeastOne<{a: number; b: string}, any>>>().toBe<{a: number; b?: string} | {a?: number; b: string}>();
// `Simplify` is required for the assertion to pass
expectTypeOf<Simplify<RequireAtLeastOne<{a: number; b: string; c: boolean}>>>().toBe<{a: number; b?: string; c?: boolean} | {a?: number; b: string; c?: boolean} | {a?: number; b?: string; c: boolean}>();
// `Simplify` is required for the assertion to pass
expectTypeOf<Simplify<RequireAtLeastOne<{a: number; b: string; c: boolean}, any>>>().toBe<{a: number; b?: string; c?: boolean} | {a?: number; b: string; c?: boolean} | {a?: number; b?: string; c: boolean}>();

expectTypeOf<RequireAtLeastOne<{}>>().toBe<never>();
expectTypeOf<RequireAtLeastOne<{a: string; b: number}, never>>().toBe<never>();

expectTypeOf<RequireAtLeastOne<any>>().toBe<any>();
expectTypeOf<RequireAtLeastOne<any, 'foo'>>().toBe<any>();
expectTypeOf<RequireAtLeastOne<any, any>>().toBe<any>();
expectTypeOf<RequireAtLeastOne<any, never>>().toBe<any>();

expectTypeOf<RequireAtLeastOne<never>>().toBe<never>();
expectTypeOf<RequireAtLeastOne<never, 'foo'>>().toBe<never>();
expectTypeOf<RequireAtLeastOne<never, any>>().toBe<never>();
expectTypeOf<RequireAtLeastOne<never, never>>().toBe<never>();

// A key that only one member of a union has is accepted, and a member without it is left as it is.
({a: 1}) satisfies RequireAtLeastOne<{a?: 1} | {b: 2}, 'a'>;
({b: 2}) satisfies RequireAtLeastOne<{a?: 1} | {b: 2}, 'a'>;

// Each key of the set is the required one in its own branch of the union, and the others stay optional. The `readonly` of a key travels with it, because the branch is built from `Pick` over the input.
declare const oneOfTwo: Simplify<RequireAtLeastOne<{a?: 1; b?: 2}, 'a' | 'b'>>;
expectTypeOf(oneOfTwo).toBe<{a: 1; b?: 2} | {a?: 1; b: 2}>();

declare const oneOfTwoReadonly: Simplify<RequireAtLeastOne<{readonly a?: 1; b?: 2}, 'a' | 'b'>>;
expectTypeOf(oneOfTwoReadonly).toBe<{readonly a: 1; b?: 2} | {readonly a?: 1; b: 2}>();

// A key of the object that the set does not name is carried through in every branch, modifiers included.
declare const untouchedKey: Simplify<RequireAtLeastOne<{a?: 1; b?: 2; readonly c?: string}, 'a' | 'b'>>;
expectTypeOf(untouchedKey).toBe<{a: 1; b?: 2; readonly c?: string} | {a?: 1; b: 2; readonly c?: string}>();

// A union member that has none of the keys is left as it is.
type Shape = {kind: 'circle'; radius?: number; diameter?: number} | {kind: 'square'; side: number};
({kind: 'square', side: 1}) satisfies RequireAtLeastOne<Shape, 'radius' | 'diameter'>;
({kind: 'circle', radius: 1}) satisfies RequireAtLeastOne<Shape, 'radius' | 'diameter'>;
expectTypeOf({kind: 'circle'} as const).not.toBeAssignableTo<RequireAtLeastOne<Shape, 'radius' | 'diameter'>>();

// Known limitation: an index signature cannot be required, so if the keys include one, an empty object is accepted. Every non-empty value is still accepted, so a dictionary stays usable.
type WithIndexSignature = {[key: string]: unknown; foo?: string};
({}) satisfies RequireAtLeastOne<Record<string, number>>;
({a: 1}) satisfies RequireAtLeastOne<Record<string, number>>;
({}) satisfies RequireAtLeastOne<WithIndexSignature>;
({bar: 1}) satisfies RequireAtLeastOne<WithIndexSignature>;
({}) satisfies RequireAtLeastOne<{[key: `data-${string}`]: string}>;

// When only named keys are given, one of them is required, a dynamic key does not count, and the index signature is kept.
({foo: 'x', bar: 1}) satisfies RequireAtLeastOne<WithIndexSignature, 'foo'>;
expectTypeOf({}).not.toBeAssignableTo<RequireAtLeastOne<WithIndexSignature, 'foo'>>();
expectTypeOf({bar: 1}).not.toBeAssignableTo<RequireAtLeastOne<WithIndexSignature, 'foo'>>();

// Known limitation: a check of a key for `undefined` does not narrow the type, because the keys are not discriminants. The `in` operator narrows it.
declare const atLeastOne: RequireAtLeastOne<{a: string; b: number}>;
expectTypeOf(atLeastOne.a ?? atLeastOne.b).toBe<string | number | undefined>();
expectTypeOf('a' in atLeastOne ? atLeastOne.a : atLeastOne.b).toBe<string | number>();
expectTypeOf('b' in atLeastOne ? atLeastOne.b : atLeastOne.a).toBe<number | string>();

declare const atLeastOneOfSome: RequireAtLeastOne<{a?: string; b?: number; c: boolean}, 'a' | 'b'>;
expectTypeOf('a' in atLeastOneOfSome ? atLeastOneOfSome.a : atLeastOneOfSome.b).toBe<string | number>();
expectTypeOf(atLeastOneOfSome.c).toBe<boolean>();

// Requiring one choice preserves named modifiers and explicitly allowed undefined values.
declare const selectionSymbol: unique symbol;
type SelectedFields = {readonly [selectionSymbol]?: string; readonly 0?: number; id: string};
expectTypeOf<Simplify<RequireAtLeastOne<SelectedFields, typeof selectionSymbol | 0>>>().toBe<
	| {readonly [selectionSymbol]: string; readonly 0?: number; id: string}
	| {readonly [selectionSymbol]?: string; readonly 0: number; id: string}
>();
declare const selectedFields: RequireAtLeastOne<SelectedFields, typeof selectionSymbol | 0>;
// @ts-expect-error A selected property stays readonly even when the assigned value is valid.
selectedFields[selectionSymbol] = 'changed';
({a: undefined}) satisfies RequireAtLeastOne<{a?: undefined; b?: never}>;
expectTypeOf<{}>().not.toBeAssignableTo<RequireAtLeastOne<{a?: undefined; b?: never}>>();
expectTypeOf<{b: undefined}>().not.toBeAssignableTo<RequireAtLeastOne<{a?: undefined; b?: never}>>();
expectTypeOf<RequireAtLeastOne<unknown>>().toBe<never>();

function readSelectedValue<Value>(value: RequireAtLeastOne<{a?: Value; b?: number; id: string}, 'a' | 'b'>): Value | number | undefined {
	expectTypeOf(value.id).toBe<string>();
	return 'a' in value ? value.a : value.b;
}

function createSelectedValue<Value>(value: Value): RequireAtLeastOne<{a?: Value; b?: string}> {
	return {a: value};
}

declare function inferSelectedValue<const Value>(value: RequireAtLeastOne<{a?: Value; b?: number}>): Value;
expectTypeOf(inferSelectedValue({a: 'chosen'})).toBe<'chosen'>();
expectTypeOf(inferSelectedValue({b: 1})).toBe<unknown>();
// @ts-expect-error A call still needs at least one selected field.
inferSelectedValue({});

// Conditional consumers can still select and reject individual required alternatives.
type MessageSelection = RequireAtLeastOne<{text?: string; count?: number; id: string}, 'text' | 'count'>;
expectTypeOf<Simplify<Extract<MessageSelection, {text: string}>>>().toBe<{text: string; count?: number; id: string}>();
expectTypeOf<Simplify<Exclude<MessageSelection, {text: string}>>>().toBe<{text?: string; count: number; id: string}>();
({[selectionSymbol]: 'selected', 0: 2, id: 'request'}) satisfies RequireAtLeastOne<SelectedFields, typeof selectionSymbol | 0>;
expectTypeOf<{[selectionSymbol]: string}>().not.toBeAssignableTo<RequireAtLeastOne<SelectedFields, typeof selectionSymbol | 0>>();
({a: 1, requiredUndefined: undefined}) satisfies RequireAtLeastOne<{a?: number; b?: string; requiredUndefined: undefined}, 'a' | 'b'>;
expectTypeOf<{a: number}>().not.toBeAssignableTo<RequireAtLeastOne<{a?: number; b?: string; requiredUndefined: undefined}, 'a' | 'b'>>();

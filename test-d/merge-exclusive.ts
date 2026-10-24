import {expectTypeOf} from 'nz';
import type {MergeExclusive} from '../index.d.ts';

type BaseOptions = {
	option?: string;
};

type ExclusiveVariation1 = {
	exclusive1: boolean;
} & BaseOptions;

type ExclusiveVariation2 = {
	exclusive2: number;
} & BaseOptions;

type Options = MergeExclusive<ExclusiveVariation1, ExclusiveVariation2>;

const exclusiveVariation1: Options = {exclusive1: true};
const exclusiveVariation2: Options = {exclusive2: 1};

expectTypeOf(
	exclusiveVariation1,
).toBeAssignableTo<{option?: string; exclusive1: boolean; exclusive2?: string}>();
expectTypeOf(
	exclusiveVariation2,
).toBeAssignableTo<{option?: string; exclusive1?: string; exclusive2: number}>();

expectTypeOf<{exclusive1: true; exclusive2: 1}>().not.toBeAssignableTo<Options>();

// Keys specific to a union member must still be excluded from the opposite side.
type UnionOptions = MergeExclusive<{text: string} | {json: boolean}, {file: string}>;
expectTypeOf<{text: string; file: string}>().not.toBeAssignableTo<UnionOptions>();
expectTypeOf<{json: boolean; file: string}>().not.toBeAssignableTo<UnionOptions>();
expectTypeOf<{text: string}>().toBeAssignableTo<UnionOptions>();
expectTypeOf<{json: boolean}>().toBeAssignableTo<UnionOptions>();
expectTypeOf<{file: string}>().toBeAssignableTo<UnionOptions>();

// Either side can be a union, including when both have member-specific keys.
type BothUnionOptions = MergeExclusive<{text: string} | {json: boolean}, {file: string} | {url: URL}>;
expectTypeOf<{text: string; file: string}>().not.toBeAssignableTo<BothUnionOptions>();
expectTypeOf<{text: string; url: URL}>().not.toBeAssignableTo<BothUnionOptions>();
expectTypeOf<{json: boolean; file: string}>().not.toBeAssignableTo<BothUnionOptions>();
expectTypeOf<{json: boolean; url: URL}>().not.toBeAssignableTo<BothUnionOptions>();
expectTypeOf<{text: string}>().toBeAssignableTo<BothUnionOptions>();
expectTypeOf<{json: boolean}>().toBeAssignableTo<BothUnionOptions>();
expectTypeOf<{file: string}>().toBeAssignableTo<BothUnionOptions>();
expectTypeOf<{url: URL}>().toBeAssignableTo<BothUnionOptions>();

// Shared keys retain their original value types and modifiers.
type SharedUnionOptions = MergeExclusive<{readonly shared?: number; text: string} | {readonly shared?: number; json: boolean}, {readonly shared?: number; file: string}>;
expectTypeOf<{shared: number; text: string}>().toBeAssignableTo<SharedUnionOptions>();
expectTypeOf<{shared: number; file: string}>().toBeAssignableTo<SharedUnionOptions>();
expectTypeOf<{shared: string; file: string}>().not.toBeAssignableTo<SharedUnionOptions>();
expectTypeOf<{shared: number; json: boolean; file: string}>().not.toBeAssignableTo<SharedUnionOptions>();

// Numeric and symbol keys follow the same exclusion rule.
declare const exclusiveSymbol: unique symbol;
type PropertyKeyUnionOptions = MergeExclusive<{0: string} | {[exclusiveSymbol]: boolean}, {file: string}>;
expectTypeOf<{0: string; file: string}>().not.toBeAssignableTo<PropertyKeyUnionOptions>();
expectTypeOf<{[exclusiveSymbol]: boolean; file: string}>().not.toBeAssignableTo<PropertyKeyUnionOptions>();
expectTypeOf<{0: string}>().toBeAssignableTo<PropertyKeyUnionOptions>();
expectTypeOf<{[exclusiveSymbol]: boolean}>().toBeAssignableTo<PropertyKeyUnionOptions>();

// Non-object alternatives are preserved.
expectTypeOf<MergeExclusive<string, number>>().toBe<string | number>();
expectTypeOf<MergeExclusive<{text: string}, undefined>>().toBe<{text: string} | undefined>();

// Different spellings of the same numeric key are shared, not mutually exclusive.
expectTypeOf<{0: 'first'}>().toBeAssignableTo<MergeExclusive<{0: 'first'}, {'0': 'second'}>>();
expectTypeOf<{'0': 'second'}>().toBeAssignableTo<MergeExclusive<{0: 'first'}, {'0': 'second'}>>();

// The shared property keeps each alternative's own modifiers and value type.
type NumericSharedOptions = MergeExclusive<{readonly 0?: 'first'; text: string}, {readonly '0'?: 'second'; file: string}>;
expectTypeOf<{text: string}>().toBeAssignableTo<NumericSharedOptions>();
expectTypeOf<{file: string}>().toBeAssignableTo<NumericSharedOptions>();
expectTypeOf<{0: 'first'; text: string}>().toBeAssignableTo<NumericSharedOptions>();
expectTypeOf<{'0': 'second'; file: string}>().toBeAssignableTo<NumericSharedOptions>();
expectTypeOf<{0: 'second'; text: string}>().not.toBeAssignableTo<NumericSharedOptions>();
expectTypeOf<{0: 'first'; text: string; file: string}>().not.toBeAssignableTo<NumericSharedOptions>();

type NumericSharedUnion = MergeExclusive<{0: string; text: true} | {'0': string; json: true}, {'0': number; file: true}>;
expectTypeOf<{0: string; text: true}>().toBeAssignableTo<NumericSharedUnion>();
expectTypeOf<{'0': string; json: true}>().toBeAssignableTo<NumericSharedUnion>();
expectTypeOf<{'0': number; file: true}>().toBeAssignableTo<NumericSharedUnion>();
expectTypeOf<{0: string; text: true; file: true}>().not.toBeAssignableTo<NumericSharedUnion>();

// Fractional and negative keys have aliases, while padded spellings are distinct keys.
expectTypeOf<{1.5: 'first'}>().toBeAssignableTo<MergeExclusive<{1.5: 'first'}, {'1.5': 'second'}>>();
expectTypeOf<{'-1': 'second'}>().toBeAssignableTo<MergeExclusive<{[-1]: 'first'}, {'-1': 'second'}>>();
expectTypeOf<{'01': string; 1: number}>().not.toBeAssignableTo<MergeExclusive<{'01': string}, {1: number}>>();
expectTypeOf<{'01': string}>().toBeAssignableTo<MergeExclusive<{'01': string}, {1: number}>>();
expectTypeOf<{1: number}>().toBeAssignableTo<MergeExclusive<{'01': string}, {1: number}>>();

// A string enum key also shares the ordinary spelling of its name.
enum SharedField {
	Name = 'name',
}
expectTypeOf<{name: 'first'}>().toBeAssignableTo<MergeExclusive<{name: 'first'}, {[SharedField.Name]: 'second'}>>();
expectTypeOf<{[SharedField.Name]: 'second'}>().toBeAssignableTo<MergeExclusive<{name: 'first'}, {[SharedField.Name]: 'second'}>>();

expectTypeOf<{0: string}>().toBeAssignableTo<MergeExclusive<{0: unknown}, {'0': number}>>();
expectTypeOf<{'0': number}>().toBeAssignableTo<MergeExclusive<{0: never}, {'0': number}>>();
expectTypeOf<{0: unknown}>().toBeAssignableTo<MergeExclusive<{0: any}, {'0': number}>>();
expectTypeOf<{[exclusiveSymbol]: 'first'}>().toBeAssignableTo<MergeExclusive<{[exclusiveSymbol]: 'first'}, {[exclusiveSymbol]: 'second'}>>();

// An impossible alternative contributes no mutually exclusive keys.
expectTypeOf<{a: string}>().toBeAssignableTo<MergeExclusive<never, {a: string}>>();
expectTypeOf<{a: string}>().toBeAssignableTo<MergeExclusive<{a: string}, never>>();

expectTypeOf<MergeExclusive<never, never>>().toBe<never>();
expectTypeOf<MergeExclusive<string, never>>().toBe<string>();
expectTypeOf<MergeExclusive<never, undefined>>().toBe<undefined>();
expectTypeOf<{readonly a?: string}>().toBeAssignableTo<MergeExclusive<never, {readonly a?: string}>>();
expectTypeOf<{a: string}>().toBeAssignableTo<MergeExclusive<never, {a: string} | {b: number}>>();
expectTypeOf<{b: number}>().toBeAssignableTo<MergeExclusive<never, {a: string} | {b: number}>>();
expectTypeOf<{a: number}>().not.toBeAssignableTo<MergeExclusive<never, {a: string}>>();
expectTypeOf<{a: string}>().toBeAssignableTo<MergeExclusive<never, {a: unknown}>>();
expectTypeOf<{a: unknown}>().toBeAssignableTo<MergeExclusive<never, {a: any}>>();
expectTypeOf<MergeExclusive<never, {a: never}>>().toBeAssignableTo<{a: never}>();
expectTypeOf<MergeExclusive<never, unknown>>().toBe<unknown>();
expectTypeOf<MergeExclusive<unknown, never>>().toBe<unknown>();
expectTypeOf<MergeExclusive<never, any>>().toBe<any>();
expectTypeOf<MergeExclusive<any, never>>().toBe<any>();

// Conditional alternatives can disappear without making the surviving choice impossible.
type MaybeFile<Enabled extends boolean> = MergeExclusive<Enabled extends true ? {file: string} : never, {text: string}>;
expectTypeOf<{text: string}>().toBeAssignableTo<MaybeFile<false>>();
expectTypeOf<{file: string}>().not.toBeAssignableTo<MaybeFile<false>>();
expectTypeOf<{file: string; text: string}>().not.toBeAssignableTo<MaybeFile<true>>();
expectTypeOf<{[exclusiveSymbol]: string}>().toBeAssignableTo<MergeExclusive<never, {[exclusiveSymbol]: string}>>();
expectTypeOf<Record<string, number>>().toBeAssignableTo<MergeExclusive<never, Record<string, number>>>();
expectTypeOf<Record<number, string>>().toBeAssignableTo<MergeExclusive<Record<number, string>, never>>();

// A covering index signature must not make the opposite named alternative impossible.
const indexedFileChoice: MergeExclusive<Record<string, number>, {file: string}> = {file: 'config.json'};
const reversedIndexedFileChoice: MergeExclusive<{file: string}, Record<string, number>> = {file: 'config.json'};
const indexedNumberChoice: MergeExclusive<Record<number, string>, {0: boolean}> = {0: true};
const indexedPatternChoice: MergeExclusive<{[key: `row-${string}`]: number}, {'row-name': string}> = {'row-name': 'first'};
const indexedSymbolChoice: MergeExclusive<{[key: symbol]: number}, {[exclusiveSymbol]: string}> = {[exclusiveSymbol]: 'first'};

// Known properties still exclude the opposite choice beside an open signature.
type DeclaredIndexedChoice = MergeExclusive<{[key: string]: unknown; readonly id: number}, {file: string}>;
expectTypeOf<{file: string}>().toBeAssignableTo<DeclaredIndexedChoice>();
expectTypeOf<{id: number; dynamic: boolean}>().toBeAssignableTo<DeclaredIndexedChoice>();
expectTypeOf<{id: string; file: string}>().not.toBeAssignableTo<DeclaredIndexedChoice>();

// Prototype-like names are finite declared keys too.
expectTypeOf<{toString: number; file: string}>().not.toBeAssignableTo<MergeExclusive<{toString: number}, {file: string}>>();
expectTypeOf<{valueOf: string; file: string}>().not.toBeAssignableTo<MergeExclusive<{valueOf: string}, {file: string}>>();

function fileOrIndexed<Value extends string>(file: Value): MergeExclusive<Record<string, number>, {readonly file: Value}> {
	return {file};
}

const inferredIndexedFile = fileOrIndexed('config.json');
expectTypeOf(inferredIndexedFile.file).toBe<'config.json' | number>();
// @ts-expect-error The named alternative preserves its own readonly modifier.
inferredIndexedFile.file = 'config.json';

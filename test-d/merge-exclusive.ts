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

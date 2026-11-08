import {expectTypeOf} from 'nz';
import type {IsEqual} from '../../index.d.ts';
import type {
	FirstArrayElement,
	HasNoStaticElements,
	IsArrayOfUnknownLength,
	IsEqualOrExtend,
	MaxLength,
	SetArrayAccess,
	StaticPartOfArray,
	VariablePartOfArray,
} from '../../source/internal/index.d.ts';

expectTypeOf<IsEqual<FirstArrayElement<[1, 2, 3]>, 1>>().toBe<true>();
expectTypeOf<IsEqual<FirstArrayElement<[]>, never>>().toBe<true>();
expectTypeOf<IsEqual<FirstArrayElement<string[]>, never>>().toBe<true>();
expectTypeOf<IsEqual<FirstArrayElement<readonly string[]>, never>>().toBe<true>();
expectTypeOf<IsEqual<FirstArrayElement<[1, ...string[]]>, 1>>().toBe<true>();

// An optional first position still declares an element type.
expectTypeOf<FirstArrayElement<[number?]>>().toBe<number>();
expectTypeOf<FirstArrayElement<readonly [(number | undefined)?]>>().toBe<number | undefined>();

expectTypeOf<IsEqual<StaticPartOfArray<[string, number, boolean, ...string[]]>, [string, number, boolean]>>().toBe<true>();
expectTypeOf<IsEqual<StaticPartOfArray<string[]>, []>>().toBe<true>();
expectTypeOf<IsEqual<StaticPartOfArray<[1, 2]>, [1, 2]>>().toBe<true>();
expectTypeOf<IsEqual<StaticPartOfArray<[1, ...string[]]>, [1]>>().toBe<true>();
expectTypeOf<IsEqual<VariablePartOfArray<[string, number, boolean, ...string[]]>, string[]>>().toBe<true>();
expectTypeOf<IsEqual<VariablePartOfArray<string[]>, string[]>>().toBe<true>();
expectTypeOf<IsEqual<VariablePartOfArray<[1, 2]>, []>>().toBe<true>();

// A tuple with a leading rest element has its fixed part at the other end, which neither helper reaches. `IsEqual` does not see through a conditional type here, so these are asserted on the result directly.
declare const leadingRestStatic: StaticPartOfArray<[...string[], 1, 2]>;
expectTypeOf(leadingRestStatic).toBe<[]>();
declare const leadingRestVariable: VariablePartOfArray<[...string[], 1, 2]>;
expectTypeOf(leadingRestVariable).toBe<[...string[], 1, 2]>();

expectTypeOf<IsEqual<SetArrayAccess<string[], true>, readonly string[]>>().toBe<true>();
expectTypeOf<IsEqual<SetArrayAccess<readonly string[], false>, string[]>>().toBe<true>();
expectTypeOf<IsEqual<SetArrayAccess<readonly [1, 2], true>, readonly [1, 2]>>().toBe<true>();
expectTypeOf<IsEqual<SetArrayAccess<[1, 2], false>, [1, 2]>>().toBe<true>();

// `T['length']` is a union for a tuple with an optional element, so `MaxLength` picks the widest.
expectTypeOf<IsEqual<MaxLength<[string, number?]>, 2>>().toBe<true>();
expectTypeOf<IsEqual<MaxLength<[string, number]>, 2>>().toBe<true>();
expectTypeOf<IsEqual<MaxLength<[]>, 0>>().toBe<true>();
expectTypeOf<IsEqual<MaxLength<[string?, number?]>, 2>>().toBe<true>();
expectTypeOf<IsEqual<MaxLength<[string, (number | undefined)?, ...boolean[]]>, number>>().toBe<true>();
expectTypeOf<IsEqual<MaxLength<string[]>, number>>().toBe<true>();
expectTypeOf<IsEqual<MaxLength<[...string[], 1, 2]>, number>>().toBe<true>();
expectTypeOf<IsEqual<MaxLength<readonly [string, (number | undefined)?]>, 2>>().toBe<true>();

// `HasNoStaticElements` separates an array that can be shorter than any index from one that cannot.
expectTypeOf<IsEqual<HasNoStaticElements<string[]>, true>>().toBe<true>();
expectTypeOf<IsEqual<HasNoStaticElements<[...string[], 1, 2]>, false>>().toBe<true>();
expectTypeOf<IsEqual<HasNoStaticElements<[1, 2, ...string[]]>, false>>().toBe<true>();
expectTypeOf<IsEqual<HasNoStaticElements<[1, 2]>, false>>().toBe<true>();

// `IsArrayOfUnknownLength` is `false` for every tuple, including one with a rest element or only optional elements.
expectTypeOf<IsEqual<IsArrayOfUnknownLength<string[]>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsArrayOfUnknownLength<readonly string[]>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsArrayOfUnknownLength<[]>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsArrayOfUnknownLength<[1?]>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsArrayOfUnknownLength<[1?, ...string[]]>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsArrayOfUnknownLength<[...string[], 1]>, false>>().toBe<true>();

// `IsEqualOrExtend` compares exactly by default, and by assignability in either direction when `Distribute` is `true`.
expectTypeOf<IsEqualOrExtend<1, 1, false>>().toBe<true>();
expectTypeOf<IsEqualOrExtend<1, 2, false>>().toBe<false>();
expectTypeOf<IsEqualOrExtend<1 | 2, 1, false>>().toBe<false>();
expectTypeOf<IsEqualOrExtend<1, 1, true>>().toBe<true>();
expectTypeOf<IsEqualOrExtend<number, 1, true>>().toBe<boolean>();
expectTypeOf<IsEqualOrExtend<1, number, true>>().toBe<boolean>();
expectTypeOf<IsEqualOrExtend<1 | 2, 1, true>>().toBe<boolean>();
expectTypeOf<IsEqualOrExtend<never, never, false>>().toBe<true>();
expectTypeOf<IsEqualOrExtend<never, never, true>>().toBe<true>();
expectTypeOf<IsEqualOrExtend<never, 1, true>>().toBe<false>();
expectTypeOf<IsEqualOrExtend<any, 1, true>>().toBe<boolean>();
expectTypeOf<IsEqualOrExtend<any, any, true>>().toBe<true>();
expectTypeOf<IsEqualOrExtend<unknown, 1, true>>().toBe<boolean>();
expectTypeOf<IsEqualOrExtend<any, any, false>>().toBe<true>();
expectTypeOf<IsEqualOrExtend<any, 1, false>>().toBe<false>();
expectTypeOf<IsEqualOrExtend<1, any, false>>().toBe<false>();
expectTypeOf<IsEqualOrExtend<unknown, 1, false>>().toBe<false>();
expectTypeOf<IsEqualOrExtend<1, unknown, false>>().toBe<false>();
expectTypeOf<IsEqualOrExtend<string, 'a', true>>().toBe<boolean>();
expectTypeOf<IsEqualOrExtend<'a', string, true>>().toBe<boolean>();
expectTypeOf<IsEqualOrExtend<string, number, true>>().toBe<false>();
expectTypeOf<IsEqualOrExtend<1, any, true>>().toBe<boolean>();
expectTypeOf<IsEqualOrExtend<any, never, true>>().toBe<boolean>();
expectTypeOf<IsEqualOrExtend<unknown, unknown, true>>().toBe<true>();
expectTypeOf<IsEqualOrExtend<never, any, true>>().toBe<false>();
expectTypeOf<IsEqualOrExtend<never, unknown, true>>().toBe<false>();
expectTypeOf<IsEqualOrExtend<{a: 1; b: 2}, {a: 1}, true>>().toBe<boolean>();
expectTypeOf<IsEqualOrExtend<{a: 1}, {a: 1; b: 2}, true>>().toBe<boolean>();
expectTypeOf<IsEqualOrExtend<{a: 1}, {b: 2}, true>>().toBe<false>();
expectTypeOf<IsEqualOrExtend<boolean, true, false>>().toBe<false>();
expectTypeOf<IsEqualOrExtend<boolean, true, true>>().toBe<boolean>();
expectTypeOf<IsEqualOrExtend<1 | 2, 1 | 2, true>>().toBe<boolean>();
expectTypeOf<IsEqualOrExtend<any, unknown, true>>().toBe<boolean>();
expectTypeOf<IsEqualOrExtend<never, 1, false>>().toBe<false>();
expectTypeOf<IsEqualOrExtend<undefined, undefined, false>>().toBe<true>();
expectTypeOf<IsEqualOrExtend<null, undefined, false>>().toBe<false>();
expectTypeOf<IsEqualOrExtend<readonly [1], [1], false>>().toBe<false>();
expectTypeOf<IsEqualOrExtend<readonly [1], [1], true>>().toBe<boolean>();
expectTypeOf<IsEqualOrExtend<1, 1, boolean>>().toBe<true>();
expectTypeOf<IsEqualOrExtend<1 | 2, 1, boolean>>().toBe<false>();
expectTypeOf<IsEqualOrExtend<1, never, true>>().toBe<false>();
expectTypeOf<IsEqualOrExtend<unknown, never, true>>().toBe<boolean>();
expectTypeOf<IsEqualOrExtend<() => void, () => void, false>>().toBe<true>();
expectTypeOf<IsEqualOrExtend<(a: string) => void, (a: number) => void, false>>().toBe<false>();

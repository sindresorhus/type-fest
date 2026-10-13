import {expectTypeOf} from 'nz';
import type {IsEqual} from '../../index.d.ts';
import type {FirstArrayElement, HasNoStaticElements, IsArrayOfUnknownLength, IsArrayReadonly, MaxLength, SetArrayAccess, StaticPartOfArray, VariablePartOfArray} from '../../source/internal/index.d.ts';

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

expectTypeOf<IsEqual<IsArrayReadonly<readonly string[]>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsArrayReadonly<string[]>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsArrayReadonly<readonly [1, 2]>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsArrayReadonly<[1, 2]>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsArrayReadonly<never>, false>>().toBe<true>();

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

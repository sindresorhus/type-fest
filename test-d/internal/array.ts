import {expectType} from 'tsd';
import type {IsEqual} from '../../index.d.ts';
import type {FirstArrayElement, HasNoStaticElements, IsArrayOfUnknownLength, IsArrayReadonly, MaxLength, SetArrayAccess, StaticPartOfArray, VariablePartOfArray} from '../../source/internal/index.d.ts';

expectType<IsEqual<FirstArrayElement<[1, 2, 3]>, 1>>(true);
expectType<IsEqual<FirstArrayElement<[]>, never>>(true);
expectType<IsEqual<FirstArrayElement<string[]>, never>>(true);
expectType<IsEqual<FirstArrayElement<readonly string[]>, never>>(true);
expectType<IsEqual<FirstArrayElement<[1, ...string[]]>, 1>>(true);

expectType<IsEqual<StaticPartOfArray<[string, number, boolean, ...string[]]>, [string, number, boolean]>>(true);
expectType<IsEqual<StaticPartOfArray<string[]>, []>>(true);
expectType<IsEqual<StaticPartOfArray<[1, 2]>, [1, 2]>>(true);
expectType<IsEqual<StaticPartOfArray<[1, ...string[]]>, [1]>>(true);
expectType<IsEqual<VariablePartOfArray<[string, number, boolean, ...string[]]>, string[]>>(true);
expectType<IsEqual<VariablePartOfArray<string[]>, string[]>>(true);
expectType<IsEqual<VariablePartOfArray<[1, 2]>, []>>(true);

// A tuple with a leading rest element has its fixed part at the other end, which neither helper reaches. `IsEqual` does not see through a conditional type here, so these are asserted on the result directly.
declare const leadingRestStatic: StaticPartOfArray<[...string[], 1, 2]>;
expectType<[]>(leadingRestStatic);
declare const leadingRestVariable: VariablePartOfArray<[...string[], 1, 2]>;
expectType<[...string[], 1, 2]>(leadingRestVariable);

expectType<IsEqual<SetArrayAccess<string[], true>, readonly string[]>>(true);
expectType<IsEqual<SetArrayAccess<readonly string[], false>, string[]>>(true);
expectType<IsEqual<SetArrayAccess<readonly [1, 2], true>, readonly [1, 2]>>(true);
expectType<IsEqual<SetArrayAccess<[1, 2], false>, [1, 2]>>(true);

expectType<IsEqual<IsArrayReadonly<readonly string[]>, true>>(true);
expectType<IsEqual<IsArrayReadonly<string[]>, false>>(true);
expectType<IsEqual<IsArrayReadonly<readonly [1, 2]>, true>>(true);
expectType<IsEqual<IsArrayReadonly<[1, 2]>, false>>(true);
expectType<IsEqual<IsArrayReadonly<never>, false>>(true);

// `T['length']` is a union for a tuple with an optional element, so `MaxLength` picks the widest.
expectType<IsEqual<MaxLength<[string, number?]>, 2>>(true);
expectType<IsEqual<MaxLength<[string, number]>, 2>>(true);
expectType<IsEqual<MaxLength<[]>, 0>>(true);
expectType<IsEqual<MaxLength<[string?, number?]>, 2>>(true);
expectType<IsEqual<MaxLength<[string, (number | undefined)?, ...boolean[]]>, number>>(true);
expectType<IsEqual<MaxLength<string[]>, number>>(true);
expectType<IsEqual<MaxLength<[...string[], 1, 2]>, number>>(true);
expectType<IsEqual<MaxLength<readonly [string, (number | undefined)?]>, 2>>(true);

// `HasNoStaticElements` separates an array that can be shorter than any index from one that cannot.
expectType<IsEqual<HasNoStaticElements<string[]>, true>>(true);
expectType<IsEqual<HasNoStaticElements<[...string[], 1, 2]>, false>>(true);
expectType<IsEqual<HasNoStaticElements<[1, 2, ...string[]]>, false>>(true);
expectType<IsEqual<HasNoStaticElements<[1, 2]>, false>>(true);

// `IsArrayOfUnknownLength` is `false` for every tuple, including one with a rest element or only optional elements.
expectType<IsEqual<IsArrayOfUnknownLength<string[]>, true>>(true);
expectType<IsEqual<IsArrayOfUnknownLength<readonly string[]>, true>>(true);
expectType<IsEqual<IsArrayOfUnknownLength<[]>, false>>(true);
expectType<IsEqual<IsArrayOfUnknownLength<[1?]>, false>>(true);
expectType<IsEqual<IsArrayOfUnknownLength<[1?, ...string[]]>, false>>(true);
expectType<IsEqual<IsArrayOfUnknownLength<[...string[], 1]>, false>>(true);

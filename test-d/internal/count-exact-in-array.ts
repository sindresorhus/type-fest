import {expectTypeOf} from 'nz';
import type {CountExactInArray} from '../../source/internal/index.d.ts';

type StaticList = [string, 1, 'Hello', number, 2, string, 1, boolean, 4, 1, 'bye'];
expectTypeOf<CountExactInArray<StaticList, number>>().toBe<1>();
expectTypeOf<CountExactInArray<StaticList, string>>().toBe<2>();
expectTypeOf<CountExactInArray<StaticList, 'Hello'>>().toBe<1>();
expectTypeOf<CountExactInArray<StaticList, 1>>().toBe<3>();
expectTypeOf<CountExactInArray<readonly [string, 1, string], string>>().toBe<2>();

// The variable part and everything after it is ignored
type VariableList = [string, number, 1, string, ...string[], number, 1, string, 2];
expectTypeOf<CountExactInArray<VariableList, number>>().toBe<1>();
expectTypeOf<CountExactInArray<VariableList, string>>().toBe<2>();
expectTypeOf<CountExactInArray<VariableList, 1>>().toBe<1>();
expectTypeOf<CountExactInArray<VariableList, 2>>().toBe<0>();
expectTypeOf<CountExactInArray<string[], string>>().toBe<0>();
expectTypeOf<CountExactInArray<readonly string[], string>>().toBe<0>();

// Empty list
expectTypeOf<CountExactInArray<[], string>>().toBe<0>();

// Edge cases
expectTypeOf<CountExactInArray<[any, unknown, never, 1], any>>().toBe<1>();
expectTypeOf<CountExactInArray<[any, unknown, never, 1], unknown>>().toBe<1>();
expectTypeOf<CountExactInArray<[any, unknown, never, 1], never>>().toBe<1>();

expectTypeOf<CountExactInArray<never, 1>>().toBe<0>();

// Only the fixed required prefix contributes, even when the rest or suffix also contains matches.
expectTypeOf<CountExactInArray<readonly [1, 1, ...Array<1>, 1], 1>>().toBe<2>();
expectTypeOf<CountExactInArray<readonly [...Array<1>, 1, 1], 1>>().toBe<0>();
expectTypeOf<CountExactInArray<readonly [1, 2, 1], 1, [unknown, unknown]>>().toBe<4>();

function _numericCount<Values extends readonly unknown[]>(value: CountExactInArray<Values, string>): number {
	return value;
}

declare function countOnes<const Values extends readonly unknown[]>(values: Values): CountExactInArray<Values, 1>;
expectTypeOf(countOnes([1, 2, 1])).toBe<2>();
expectTypeOf(countOnes([])).toBe<0>();
expectTypeOf(countOnes(['1', 1])).toBe<1>();

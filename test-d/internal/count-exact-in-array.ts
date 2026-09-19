import {expectType} from 'tsd';
import type {CountExactInArray} from '../../source/internal/index.d.ts';

type StaticList = [string, 1, 'Hello', number, 2, string, 1, boolean, 4, 1, 'bye'];
expectType<CountExactInArray<StaticList, number>>(1);
expectType<CountExactInArray<StaticList, string>>(2);
expectType<CountExactInArray<StaticList, 'Hello'>>(1);
expectType<CountExactInArray<StaticList, 1>>(3);
expectType<CountExactInArray<readonly [string, 1, string], string>>(2);

// The variable part and everything after it is ignored
type VariableList = [string, number, 1, string, ...string[], number, 1, string, 2];
expectType<CountExactInArray<VariableList, number>>(1);
expectType<CountExactInArray<VariableList, string>>(2);
expectType<CountExactInArray<VariableList, 1>>(1);
expectType<CountExactInArray<VariableList, 2>>(0);
expectType<CountExactInArray<string[], string>>(0);
expectType<CountExactInArray<readonly string[], string>>(0);

// Empty list
expectType<CountExactInArray<[], string>>(0);

// Edge cases
expectType<CountExactInArray<[any, unknown, never, 1], any>>(1);
expectType<CountExactInArray<[any, unknown, never, 1], unknown>>(1);
expectType<CountExactInArray<[any, unknown, never, 1], never>>(1);

expectType<CountExactInArray<never, 1>>({} as never);

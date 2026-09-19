import {expectType} from 'tsd';
import type {FilterArrayExact} from '../../source/internal/index.d.ts';

type StaticList = [string, 1, 'Hello', number, 2, string, 1, boolean, 4, 1, 'bye'];
expectType<FilterArrayExact<StaticList, number>>({} as [number]);
expectType<FilterArrayExact<StaticList, string>>({} as [string, string]);
expectType<FilterArrayExact<StaticList, 'Hello'>>({} as ['Hello']);
expectType<FilterArrayExact<StaticList, 1>>({} as [1, 1, 1]);
expectType<FilterArrayExact<StaticList, boolean>>({} as [boolean]);

// Matches are exact, not assignability-based
expectType<FilterArrayExact<[string, 'a'], string>>({} as [string]);
expectType<FilterArrayExact<[1 | 2, 1], 1>>({} as [1]);
expectType<FilterArrayExact<readonly [string, 'a'], string>>({} as [string]);

// The variable part and everything after it is ignored
type VariableList = [string, number, 1, string, ...string[], number, 1, string, 2];
expectType<FilterArrayExact<VariableList, number>>({} as [number]);
expectType<FilterArrayExact<VariableList, string>>({} as [string, string]);
expectType<FilterArrayExact<VariableList, 1>>({} as [1]);
expectType<FilterArrayExact<VariableList, 2>>({} as []);
expectType<FilterArrayExact<string[], string>>({} as []);
expectType<FilterArrayExact<readonly string[], string>>({} as []);

// Empty list
expectType<FilterArrayExact<[], string>>({} as []);

// Edge cases
expectType<FilterArrayExact<[any, unknown, never, 1], any>>({} as [any]);
expectType<FilterArrayExact<[any, unknown, never, 1], unknown>>({} as [unknown]);
expectType<FilterArrayExact<[any, unknown, never, 1], never>>({} as [never]);
expectType<FilterArrayExact<never, 1>>({} as never);

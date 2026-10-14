import {expectTypeOf} from 'nz';
import type {FilterArrayExact} from '../../source/internal/index.d.ts';

type StaticList = [string, 1, 'Hello', number, 2, string, 1, boolean, 4, 1, 'bye'];
expectTypeOf<FilterArrayExact<StaticList, number>>().toBe<[number]>();
expectTypeOf<FilterArrayExact<StaticList, string>>().toBe<[string, string]>();
expectTypeOf<FilterArrayExact<StaticList, 'Hello'>>().toBe<['Hello']>();
expectTypeOf<FilterArrayExact<StaticList, 1>>().toBe<[1, 1, 1]>();
expectTypeOf<FilterArrayExact<StaticList, boolean>>().toBe<[boolean]>();

// Matches are exact, not assignability-based
expectTypeOf<FilterArrayExact<[string, 'a'], string>>().toBe<[string]>();
expectTypeOf<FilterArrayExact<[1 | 2, 1], 1>>().toBe<[1]>();
expectTypeOf<FilterArrayExact<readonly [string, 'a'], string>>().toBe<[string]>();

// The variable part and everything after it is ignored
type VariableList = [string, number, 1, string, ...string[], number, 1, string, 2];
expectTypeOf<FilterArrayExact<VariableList, number>>().toBe<[number]>();
expectTypeOf<FilterArrayExact<VariableList, string>>().toBe<[string, string]>();
expectTypeOf<FilterArrayExact<VariableList, 1>>().toBe<[1]>();
expectTypeOf<FilterArrayExact<VariableList, 2>>().toBe<[]>();
expectTypeOf<FilterArrayExact<string[], string>>().toBe<[]>();
expectTypeOf<FilterArrayExact<readonly string[], string>>().toBe<[]>();

// Empty list
expectTypeOf<FilterArrayExact<[], string>>().toBe<[]>();

// Edge cases
expectTypeOf<FilterArrayExact<[any, unknown, never, 1], any>>().toBe<[any]>();
expectTypeOf<FilterArrayExact<[any, unknown, never, 1], unknown>>().toBe<[unknown]>();
expectTypeOf<FilterArrayExact<[any, unknown, never, 1], never>>().toBe<[never]>();
expectTypeOf<FilterArrayExact<never, 1>>().toBe<never>();

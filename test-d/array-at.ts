import {expectTypeOf} from 'nz';
import type {ArrayAt} from '../index.d.ts';

expectTypeOf<ArrayAt<[string], 0>>().toBe<string>();
expectTypeOf<ArrayAt<[string], -1>>().toBe<string>();

expectTypeOf<ArrayAt<[], 0>>().toBe<undefined>();
expectTypeOf<ArrayAt<[], -1>>().toBe<undefined>();

expectTypeOf<ArrayAt<[number, boolean], 0>>().toBe<number>();
expectTypeOf<ArrayAt<[number, boolean], 1>>().toBe<boolean>();
expectTypeOf<ArrayAt<[number, boolean], 2>>().toBe<undefined>();
expectTypeOf<ArrayAt<[number, boolean], 99>>().toBe<undefined>();
expectTypeOf<ArrayAt<[number, boolean], -1>>().toBe<boolean>();
expectTypeOf<ArrayAt<[number, boolean], -2>>().toBe<number>();
expectTypeOf<ArrayAt<[number, boolean], -3>>().toBe<undefined>();
expectTypeOf<ArrayAt<[number, boolean], -99>>().toBe<undefined>();

expectTypeOf<ArrayAt<[number, boolean?], 0>>().toBe<number>();
expectTypeOf<ArrayAt<[number, boolean?], 1>>().toBe<boolean | undefined>();
expectTypeOf<ArrayAt<[number, boolean?], 2>>().toBe<undefined>();
expectTypeOf<ArrayAt<[number, boolean?], 99>>().toBe<undefined>();
expectTypeOf<ArrayAt<[number, boolean?], -1>>().toBe<number | boolean>();
expectTypeOf<ArrayAt<[number, boolean?], -2>>().toBe<number | undefined>();
expectTypeOf<ArrayAt<[number, boolean?], -3>>().toBe<undefined>();
expectTypeOf<ArrayAt<[number, boolean?], -99>>().toBe<undefined>();

type StaticArray = [object, number, boolean?, string?];
expectTypeOf<ArrayAt<StaticArray, 0>>().toBe<object>();
expectTypeOf<ArrayAt<StaticArray, 1>>().toBe<number>();
expectTypeOf<ArrayAt<StaticArray, 2>>().toBe<boolean | undefined>();
expectTypeOf<ArrayAt<StaticArray, 3>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<StaticArray, -1>>().toBe<string | boolean | number>();
expectTypeOf<ArrayAt<StaticArray, -2>>().toBe<boolean | number | object>();
expectTypeOf<ArrayAt<StaticArray, -3>>().toBe<number | object | undefined>();
expectTypeOf<ArrayAt<StaticArray, -4>>().toBe<object | undefined>();
expectTypeOf<ArrayAt<StaticArray, -5>>().toBe<undefined>();
expectTypeOf<ArrayAt<StaticArray, -99>>().toBe<undefined>();

type LeadingSpreadArray = [...string[], number, boolean];
expectTypeOf<ArrayAt<LeadingSpreadArray, 0>>().toBe<string | number>();
expectTypeOf<ArrayAt<LeadingSpreadArray, 1>>().toBe<string | number | boolean>();
expectTypeOf<ArrayAt<LeadingSpreadArray, 2>>().toBe<string | number | boolean | undefined>();
expectTypeOf<ArrayAt<LeadingSpreadArray, 3>>().toBe<string | number | boolean | undefined>();
expectTypeOf<ArrayAt<LeadingSpreadArray, -1>>().toBe<boolean>();
expectTypeOf<ArrayAt<LeadingSpreadArray, -2>>().toBe<number>();
expectTypeOf<ArrayAt<LeadingSpreadArray, -3>>().toBe<string | undefined>();

type TrailingSpreadArray = [number, boolean, ...string[]];
expectTypeOf<ArrayAt<TrailingSpreadArray, 0>>().toBe<number>();
expectTypeOf<ArrayAt<TrailingSpreadArray, 1>>().toBe<boolean>();
expectTypeOf<ArrayAt<TrailingSpreadArray, 2>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<TrailingSpreadArray, 3>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<TrailingSpreadArray, -1>>().toBe<string | boolean>();
expectTypeOf<ArrayAt<TrailingSpreadArray, -2>>().toBe<boolean | string | number>();
expectTypeOf<ArrayAt<TrailingSpreadArray, -3>>().toBe<boolean | string | number | undefined>();

type TrailingSpreadArray2 = [object, number, boolean?, ...string[]];
expectTypeOf<ArrayAt<TrailingSpreadArray2, 0>>().toBe<object>();
expectTypeOf<ArrayAt<TrailingSpreadArray2, 1>>().toBe<number>();
expectTypeOf<ArrayAt<TrailingSpreadArray2, 2>>().toBe<boolean | undefined>();
expectTypeOf<ArrayAt<TrailingSpreadArray2, 3>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<TrailingSpreadArray2, -1>>().toBe<string | number | boolean>();
expectTypeOf<ArrayAt<TrailingSpreadArray2, -2>>().toBe<string | number | boolean | object>();
expectTypeOf<ArrayAt<TrailingSpreadArray2, -3>>().toBe<string | number | boolean | object | undefined>();

type MiddleSpreadArray = [number, ...string[], boolean];
expectTypeOf<ArrayAt<MiddleSpreadArray, 0>>().toBe<number>();
expectTypeOf<ArrayAt<MiddleSpreadArray, 1>>().toBe<string | boolean>();
expectTypeOf<ArrayAt<MiddleSpreadArray, 2>>().toBe<string | boolean | undefined>();
expectTypeOf<ArrayAt<MiddleSpreadArray, 3>>().toBe<string | boolean | undefined>();
expectTypeOf<ArrayAt<MiddleSpreadArray, -1>>().toBe<boolean>();
expectTypeOf<ArrayAt<MiddleSpreadArray, -2>>().toBe<string | number>();
expectTypeOf<ArrayAt<MiddleSpreadArray, -3>>().toBe<string | number | undefined>();

type UnionArray = [string, number] | [boolean, string?];
expectTypeOf<ArrayAt<UnionArray, 0>>().toBe<string | boolean>();
expectTypeOf<ArrayAt<UnionArray, 1>>().toBe<number | string | undefined>();
expectTypeOf<ArrayAt<UnionArray, -1>>().toBe<number | string | boolean>();
expectTypeOf<ArrayAt<UnionArray, -2>>().toBe<undefined | string | boolean>();

expectTypeOf<ArrayAt<string[], 0>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<string[], 1>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<string[], 2>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<string[], -1>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<string[], -2>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<string[], -3>>().toBe<string | undefined>();

expectTypeOf<ArrayAt<readonly string[], 0>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<readonly string[], 1>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<readonly string[], 2>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<readonly string[], -1>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<readonly string[], -2>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<readonly string[], -3>>().toBe<string | undefined>();

expectTypeOf<ArrayAt<readonly [string, number], 0>>().toBe<string>();
expectTypeOf<ArrayAt<readonly [string, number], 1>>().toBe<number>();
expectTypeOf<ArrayAt<readonly [string, number], 2>>().toBe<undefined>();
expectTypeOf<ArrayAt<readonly [string, number], -1>>().toBe<number>();

// Test unknown index
expectTypeOf<ArrayAt<[1, 2, 3], number>>().toBe<1 | 2 | 3 | undefined>();
expectTypeOf<ArrayAt<string[], number>>().toBe<string | undefined>();

// Union of indices, including mixed signs
expectTypeOf<ArrayAt<[string, number], 0 | -1>>().toBe<string | number>();
expectTypeOf<ArrayAt<[1, 2, 3], 0 | 2>>().toBe<1 | 3>();

// An optional element only adds itself at its own position
expectTypeOf<ArrayAt<[boolean, number?, {symbolic: true}?, ...string[]], 1>>().toBe<number | undefined>();

// Leading rest element
expectTypeOf<ArrayAt<[...string[], 1, 2], 0>>().toBe<string | 1>();
expectTypeOf<ArrayAt<[...string[], 1, 2], -3>>().toBe<string | undefined>();

// Only optional elements
expectTypeOf<ArrayAt<[1?, 2?], 0>>().toBe<1 | undefined>();
expectTypeOf<ArrayAt<[1?, 2?], -1>>().toBe<1 | 2 | undefined>();

// Large indices
expectTypeOf<ArrayAt<[1, 2], 999>>().toBe<undefined>();
expectTypeOf<ArrayAt<[1, 2], -999>>().toBe<undefined>();
expectTypeOf<ArrayAt<[1, ...string[], 2], 500>>().toBe<string | 2 | undefined>();
expectTypeOf<ArrayAt<[1, ...string[], 2], -500>>().toBe<string | 1 | undefined>();

// Edge cases
expectTypeOf<ArrayAt<any, 0>>().toBe<any>();
expectTypeOf<ArrayAt<never, 0>>().toBe<never>();
expectTypeOf<ArrayAt<unknown[], 0>>().toBe<unknown>();
expectTypeOf<ArrayAt<[1, 2], never>>().toBe<never>();
expectTypeOf<ArrayAt<[1, 2], any>>().toBe<1 | 2 | undefined>();
expectTypeOf<ArrayAt<any[], 0>>().toBe<any>();
expectTypeOf<ArrayAt<never[], 0>>().toBe<undefined>();

// A large positive index does not build a large union of indices
expectTypeOf<ArrayAt<[1, 2], 5000>>().toBe<undefined>();
expectTypeOf<ArrayAt<string[], 5000>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<[...string[], 1], 5000>>().toBe<string | 1 | undefined>();

// An index past the elements after the rest element can land on any of them
type MiddleRest = ['a', ...number[], 'y', 'z'];
expectTypeOf<ArrayAt<MiddleRest, 1>>().toBe<number | 'y'>();
expectTypeOf<ArrayAt<MiddleRest, 2>>().toBe<number | 'y' | 'z'>();
expectTypeOf<ArrayAt<MiddleRest, 3>>().toBe<number | 'y' | 'z' | undefined>();

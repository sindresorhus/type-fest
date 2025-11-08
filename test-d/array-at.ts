import {expectType} from 'tsd';
import type {ArrayAt} from '../index.d.ts';

expectType<ArrayAt<[string], 0>>({} as string);
expectType<ArrayAt<[string], -1>>({} as string);

expectType<ArrayAt<[], 0>>(undefined);
expectType<ArrayAt<[], -1>>(undefined);

expectType<ArrayAt<[number, boolean], 0>>({} as number);
expectType<ArrayAt<[number, boolean], 1>>({} as boolean);
expectType<ArrayAt<[number, boolean], 2>>(undefined);
expectType<ArrayAt<[number, boolean], 99>>(undefined);
expectType<ArrayAt<[number, boolean], -1>>({} as boolean);
expectType<ArrayAt<[number, boolean], -2>>({} as number);
expectType<ArrayAt<[number, boolean], -3>>(undefined);
expectType<ArrayAt<[number, boolean], -99>>(undefined);

expectType<ArrayAt<[number, boolean?], 0>>({} as number);
expectType<ArrayAt<[number, boolean?], 1>>({} as boolean | undefined);
expectType<ArrayAt<[number, boolean?], 2>>(undefined);
expectType<ArrayAt<[number, boolean?], 99>>(undefined);
expectType<ArrayAt<[number, boolean?], -1>>({} as number | boolean);
expectType<ArrayAt<[number, boolean?], -2>>({} as number | undefined);
expectType<ArrayAt<[number, boolean?], -3>>(undefined);
expectType<ArrayAt<[number, boolean?], -99>>(undefined);

type StaticArray = [object, number, boolean?, string?];
expectType<ArrayAt<StaticArray, 0>>({} as object);
expectType<ArrayAt<StaticArray, 1>>({} as number);
expectType<ArrayAt<StaticArray, 2>>({} as boolean | undefined);
expectType<ArrayAt<StaticArray, 3>>({} as string | undefined);
expectType<ArrayAt<StaticArray, -1>>({} as string | boolean | number);
expectType<ArrayAt<StaticArray, -2>>({} as boolean | number | object);
expectType<ArrayAt<StaticArray, -3>>({} as number | object | undefined);
expectType<ArrayAt<StaticArray, -4>>({} as object | undefined);
expectType<ArrayAt<StaticArray, -5>>(undefined);
expectType<ArrayAt<StaticArray, -99>>(undefined);

type LeadingSpreadArray = [...string[], number, boolean];
expectType<ArrayAt<LeadingSpreadArray, 0>>({} as string | number);
expectType<ArrayAt<LeadingSpreadArray, 1>>({} as string | number | boolean);
expectType<ArrayAt<LeadingSpreadArray, 2>>({} as string | number | boolean | undefined);
expectType<ArrayAt<LeadingSpreadArray, 3>>({} as string | number | boolean | undefined);
expectType<ArrayAt<LeadingSpreadArray, -1>>({} as boolean);
expectType<ArrayAt<LeadingSpreadArray, -2>>({} as number);
expectType<ArrayAt<LeadingSpreadArray, -3>>({} as string | undefined);

type TrailingSpreadArray = [number, boolean, ...string[]];
expectType<ArrayAt<TrailingSpreadArray, 0>>({} as number);
expectType<ArrayAt<TrailingSpreadArray, 1>>({} as boolean);
expectType<ArrayAt<TrailingSpreadArray, 2>>({} as string | undefined);
expectType<ArrayAt<TrailingSpreadArray, 3>>({} as string | undefined);
expectType<ArrayAt<TrailingSpreadArray, -1>>({} as string | boolean);
expectType<ArrayAt<TrailingSpreadArray, -2>>({} as boolean | string | number);
expectType<ArrayAt<TrailingSpreadArray, -3>>({} as boolean | string | number | undefined);

type TrailingSpreadArray2 = [object, number, boolean?, ...string[]];
expectType<ArrayAt<TrailingSpreadArray2, 0>>({} as object);
expectType<ArrayAt<TrailingSpreadArray2, 1>>({} as number);
expectType<ArrayAt<TrailingSpreadArray2, 2>>({} as boolean | undefined);
expectType<ArrayAt<TrailingSpreadArray2, 3>>({} as string | undefined);
expectType<ArrayAt<TrailingSpreadArray2, -1>>({} as string | number | boolean);
expectType<ArrayAt<TrailingSpreadArray2, -2>>({} as string | number | boolean | object);
expectType<ArrayAt<TrailingSpreadArray2, -3>>({} as string | number | boolean | object | undefined);

type MiddleSpreadArray = [number, ...string[], boolean];
expectType<ArrayAt<MiddleSpreadArray, 0>>({} as number);
expectType<ArrayAt<MiddleSpreadArray, 1>>({} as string | boolean);
expectType<ArrayAt<MiddleSpreadArray, 2>>({} as string | boolean | undefined);
expectType<ArrayAt<MiddleSpreadArray, 3>>({} as string | boolean | undefined);
expectType<ArrayAt<MiddleSpreadArray, -1>>({} as boolean);
expectType<ArrayAt<MiddleSpreadArray, -2>>({} as string | number);
expectType<ArrayAt<MiddleSpreadArray, -3>>({} as string | number | undefined);

type UnionArray = [string, number] | [boolean, string?];
expectType<ArrayAt<UnionArray, 0>>({} as string | boolean);
expectType<ArrayAt<UnionArray, 1>>({} as number | string | undefined);
expectType<ArrayAt<UnionArray, -1>>({} as number | string | boolean);
expectType<ArrayAt<UnionArray, -2>>({} as undefined | string | boolean);

expectType<ArrayAt<string[], 0>>({} as string | undefined);
expectType<ArrayAt<string[], 1>>({} as string | undefined);
expectType<ArrayAt<string[], 2>>({} as string | undefined);
expectType<ArrayAt<string[], -1>>({} as string | undefined);
expectType<ArrayAt<string[], -2>>({} as string | undefined);
expectType<ArrayAt<string[], -3>>({} as string | undefined);

expectType<ArrayAt<readonly string[], 0>>({} as string | undefined);
expectType<ArrayAt<readonly string[], 1>>({} as string | undefined);
expectType<ArrayAt<readonly string[], 2>>({} as string | undefined);
expectType<ArrayAt<readonly string[], -1>>({} as string | undefined);
expectType<ArrayAt<readonly string[], -2>>({} as string | undefined);
expectType<ArrayAt<readonly string[], -3>>({} as string | undefined);

expectType<ArrayAt<readonly [string, number], 0>>({} as string);
expectType<ArrayAt<readonly [string, number], 1>>({} as number);
expectType<ArrayAt<readonly [string, number], 2>>(undefined);
expectType<ArrayAt<readonly [string, number], -1>>({} as number);

// Test unknown index
expectType<ArrayAt<[1, 2, 3], number>>({} as 1 | 2 | 3 | undefined);
expectType<ArrayAt<string[], number>>({} as string | undefined);

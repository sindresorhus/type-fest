import {expectType} from 'tsd';
import type {ArrayAt} from '../index.d.ts';

type StaticArray = [number, boolean];
type StaticArray2 = [number, boolean?];
type StaticArray3 = [object, number, boolean?, string?];
type LeadingSpreadArray = [...string[], number, boolean];
type MiddleSpreadArray = [number, ...string[], boolean];
type TrailingSpreadArray = [number, boolean, ...string[]];
type TrailingSpreadArray2 = [object, number, boolean?, ...string[]];
type EmptyArray = [];
type SingleElement = [string];

expectType<ArrayAt<SingleElement, 0>>({} as string);
expectType<ArrayAt<SingleElement, -1>>({} as string);

expectType<ArrayAt<EmptyArray, 0>>(undefined);
expectType<ArrayAt<EmptyArray, -1>>(undefined);

expectType<ArrayAt<StaticArray, 0>>({} as number);
expectType<ArrayAt<StaticArray, 1>>({} as boolean);
expectType<ArrayAt<StaticArray, 2>>(undefined);
expectType<ArrayAt<StaticArray, 99>>(undefined);
expectType<ArrayAt<StaticArray, -1>>({} as boolean);
expectType<ArrayAt<StaticArray, -2>>({} as number);
expectType<ArrayAt<StaticArray, -3>>(undefined);
expectType<ArrayAt<StaticArray, -99>>(undefined);

expectType<ArrayAt<StaticArray2, 0>>({} as number);
expectType<ArrayAt<StaticArray2, 1>>({} as boolean | undefined);
expectType<ArrayAt<StaticArray2, 2>>(undefined);
expectType<ArrayAt<StaticArray2, 99>>(undefined);
expectType<ArrayAt<StaticArray2, -1>>({} as number | boolean);
expectType<ArrayAt<StaticArray2, -2>>({} as number | undefined);
expectType<ArrayAt<StaticArray2, -3>>(undefined);
expectType<ArrayAt<StaticArray2, -99>>(undefined);

expectType<ArrayAt<StaticArray3, 0>>({} as object);
expectType<ArrayAt<StaticArray3, 1>>({} as number);
expectType<ArrayAt<StaticArray3, 2>>({} as boolean | undefined);
expectType<ArrayAt<StaticArray3, 3>>({} as string | undefined);
expectType<ArrayAt<StaticArray3, -1>>({} as string | boolean | number);
expectType<ArrayAt<StaticArray3, -2>>({} as boolean | number | object);
expectType<ArrayAt<StaticArray3, -3>>({} as number | object | undefined);
expectType<ArrayAt<StaticArray3, -4>>({} as object | undefined);
expectType<ArrayAt<StaticArray3, -5>>(undefined);
expectType<ArrayAt<StaticArray3, -99>>(undefined);

expectType<ArrayAt<LeadingSpreadArray, 0>>({} as string | number);
expectType<ArrayAt<LeadingSpreadArray, 1>>({} as string | number | boolean);
expectType<ArrayAt<LeadingSpreadArray, 2>>({} as string | number | boolean | undefined);
expectType<ArrayAt<LeadingSpreadArray, 3>>({} as string | number | boolean | undefined);
expectType<ArrayAt<LeadingSpreadArray, -1>>({} as boolean);
expectType<ArrayAt<LeadingSpreadArray, -2>>({} as number);
expectType<ArrayAt<LeadingSpreadArray, -3>>({} as string | undefined);

expectType<ArrayAt<TrailingSpreadArray, 0>>({} as number);
expectType<ArrayAt<TrailingSpreadArray, 1>>({} as boolean);
expectType<ArrayAt<TrailingSpreadArray, 2>>({} as string | undefined);
expectType<ArrayAt<TrailingSpreadArray, 3>>({} as string | undefined);
expectType<ArrayAt<TrailingSpreadArray, -1>>({} as string | boolean);
expectType<ArrayAt<TrailingSpreadArray, -2>>({} as boolean | string | number);
expectType<ArrayAt<TrailingSpreadArray, -3>>({} as boolean | string | number | undefined);

expectType<ArrayAt<TrailingSpreadArray2, 0>>({} as object);
expectType<ArrayAt<TrailingSpreadArray2, 1>>({} as number);
expectType<ArrayAt<TrailingSpreadArray2, 2>>({} as boolean);
expectType<ArrayAt<TrailingSpreadArray2, 3>>({} as string | undefined);
expectType<ArrayAt<TrailingSpreadArray2, -1>>({} as string | number | boolean);
expectType<ArrayAt<TrailingSpreadArray2, -2>>({} as string | number | boolean | object);
expectType<ArrayAt<TrailingSpreadArray2, -3>>({} as string | number | boolean | object | undefined);

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

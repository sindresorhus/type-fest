import {expectType} from 'tsd';
import type {ArrayAt} from '../index';

type StaticArray = [number, boolean];
type StaticArray2 = [number, boolean?];
type LeadingSpreadArray = [...string[], number, boolean];
type TrailingSpreadArray = [number, boolean, ...string[]];
type TrailingSpreadArray2 = [object, number, boolean?, ...string[]];

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
expectType<ArrayAt<StaticArray2, -1>>({} as number | boolean | undefined);
expectType<ArrayAt<StaticArray2, -2>>({} as number);
expectType<ArrayAt<StaticArray2, -3>>(undefined);
expectType<ArrayAt<StaticArray2, -99>>(undefined);

expectType<ArrayAt<LeadingSpreadArray, 0>>({} as string | number);
expectType<ArrayAt<LeadingSpreadArray, 1>>({} as string | boolean);
expectType<ArrayAt<LeadingSpreadArray, 2>>({} as string | undefined);
expectType<ArrayAt<LeadingSpreadArray, 3>>({} as string | undefined);
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
expectType<ArrayAt<TrailingSpreadArray2, 2>>({} as string | boolean | undefined);
expectType<ArrayAt<TrailingSpreadArray2, 3>>({} as string | boolean | undefined);
expectType<ArrayAt<TrailingSpreadArray2, -1>>({} as string | number | boolean | undefined);
expectType<ArrayAt<TrailingSpreadArray2, -2>>({} as string | number | boolean | object | undefined);
expectType<ArrayAt<TrailingSpreadArray2, -3>>({} as string | number | boolean | object | undefined);

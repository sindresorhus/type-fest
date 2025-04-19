import {expectType} from 'tsd';
import type {ArrayAt} from '../index';

type StaticArray = [number, boolean];
type StaticArray2 = [number, boolean?];
type LeadingSpreadArray = [...string[], number, boolean];
type TrailingSpreadArray = [number, boolean, ...string[]];

expectType<ArrayAt<StaticArray, 0>>({} as number);
expectType<ArrayAt<StaticArray, 1>>({} as boolean);
expectType<ArrayAt<StaticArray, 2>>({} as unknown as undefined);

expectType<ArrayAt<StaticArray2, 0>>({} as number);
expectType<ArrayAt<StaticArray2, 1>>({} as boolean | undefined);
expectType<ArrayAt<StaticArray2, 2>>({} as unknown as undefined);

expectType<ArrayAt<LeadingSpreadArray, 0>>({} as string | number);
expectType<ArrayAt<LeadingSpreadArray, 1>>({} as string | boolean);
expectType<ArrayAt<LeadingSpreadArray, 2>>({} as string | undefined);
expectType<ArrayAt<LeadingSpreadArray, 3>>({} as string | undefined);

expectType<ArrayAt<TrailingSpreadArray, 0>>({} as number);
expectType<ArrayAt<TrailingSpreadArray, 1>>({} as boolean);
expectType<ArrayAt<TrailingSpreadArray, 2>>({} as string | undefined);
expectType<ArrayAt<TrailingSpreadArray, 3>>({} as string | undefined);

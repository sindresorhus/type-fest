import {expectType} from 'tsd';
import type {IsTuple} from '../index';

// Tuples
expectType<IsTuple<[]>>(true);
expectType<IsTuple<[1]>>(true);
expectType<IsTuple<[1, 2]>>(true);
expectType<IsTuple<[1, 2, ...number[]]>>(true);
expectType<IsTuple<[1?]>>(true);
expectType<IsTuple<[1?, 2?]>>(true);
expectType<IsTuple<[1?, 2?, ...number[]]>>(true);
expectType<IsTuple<[never]>>(true);

// Readonly tuples
expectType<IsTuple<readonly []>>(true);
expectType<IsTuple<readonly [1]>>(true);
expectType<IsTuple<readonly [1, 2, ...number[]]>>(true);
expectType<IsTuple<readonly [1?, 2?, ...number[]]>>(true);
expectType<IsTuple<readonly [1?]>>(true);
expectType<IsTuple<readonly [never]>>(true);

// Non-tuples
expectType<IsTuple<number[]>>(false);
expectType<IsTuple<readonly number[]>>(false);
expectType<IsTuple<[...number[]]>>(false);
expectType<IsTuple<[1, 2, ...number[]], {includeFixedLengthTuplesOnly: true}>>(false);
expectType<IsTuple<readonly [1?, 2?, ...number[]], {includeFixedLengthTuplesOnly: true}>>(false);
expectType<IsTuple<never[]>>(false);
expectType<IsTuple<any[]>>(false);

// Boundary types
expectType<IsTuple<any>>({} as boolean);
expectType<IsTuple<any, {includeFixedLengthTuplesOnly: true}>>({} as boolean);
expectType<IsTuple<never>>(false);

// Unions
expectType<IsTuple<[1] | [1, 2, 3]>>(true);
expectType<IsTuple<[1?, 2?] | [] | [1, 2, ...number[]]>>(true);
expectType<IsTuple<[1?, 2?] | [] | [1, 2, ...number[]], {includeFixedLengthTuplesOnly: true}>>({} as boolean);
expectType<IsTuple<number[] | string[]>>(false);
expectType<IsTuple<[1, 2] | string[]>>({} as boolean);

// Setting `includeFixedLengthTuplesOnly` to `boolean` falls back to it's default value of `false`
expectType<IsTuple<[1, 2, ...number[]], {includeFixedLengthTuplesOnly: boolean}>>(true);

// @ts-expect-error only works with arrays
type T = IsTuple<{}>;

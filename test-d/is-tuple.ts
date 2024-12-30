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
expectType<IsTuple<[1, 2, ...number[]], {fixedLengthOnly: true}>>(false);
expectType<IsTuple<readonly [1?, 2?, ...number[]], {fixedLengthOnly: true}>>(false);
expectType<IsTuple<never[]>>(false);
expectType<IsTuple<any[]>>(false);

// Boundary types
expectType<IsTuple<any>>({} as boolean);
expectType<IsTuple<any, {fixedLengthOnly: true}>>({} as boolean);
expectType<IsTuple<never>>(false);

// Unions
expectType<IsTuple<[1] | [1, 2, 3]>>(true);
expectType<IsTuple<[1?, 2?] | [] | [1, 2, ...number[]]>>(true);
expectType<IsTuple<[1?, 2?] | [] | [1, 2, ...number[]], {fixedLengthOnly: true}>>({} as boolean);
expectType<IsTuple<number[] | string[]>>(false);
expectType<IsTuple<[1, 2] | string[]>>({} as boolean);
expectType<IsTuple<[string] | [number] | number[]>>({} as boolean);
expectType<IsTuple<[string, ...number[]] | [number?, string?]>>(true);
expectType<IsTuple<[] | [number] | readonly [string]>>(true);

// Labeled tuples
expectType<IsTuple<[x: string, y: number]>>(true);
expectType<IsTuple<[first: string, ...rest: number[]]>>(true);
expectType<IsTuple<readonly [name: string, age?: number]>>(true);

// Mixed optional/required elements
expectType<IsTuple<[string, number?]>>(true);
expectType<IsTuple<readonly [string, number?, ...boolean[]]>>(true);

// Setting `fixedLengthOnly` to `boolean` falls back to it's default value of `false`
expectType<IsTuple<[1, 2, ...number[]], {fixedLengthOnly: boolean}>>(true);

// @ts-expect-error only works with arrays
type T = IsTuple<{}>;

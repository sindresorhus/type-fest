import {expectType} from 'tsd';
import type {IsTuple} from '../index.d.ts';

// Tuples
expectType<IsTuple<[]>>(true);
expectType<IsTuple<[number]>>(true);
expectType<IsTuple<[number, string]>>(true);
expectType<IsTuple<[number, string, ...number[]], {fixedLengthOnly: false}>>(true);
expectType<IsTuple<[number?]>>(true);
expectType<IsTuple<[number?, string?]>>(true);
expectType<IsTuple<[number?, string?, ...number[]], {fixedLengthOnly: false}>>(true);
expectType<IsTuple<[...number[], string, number], {fixedLengthOnly: false}>>(true);
expectType<IsTuple<[never]>>(true);

// Readonly tuples
expectType<IsTuple<readonly []>>(true);
expectType<IsTuple<readonly [number]>>(true);
expectType<IsTuple<readonly [number, string, ...number[]], {fixedLengthOnly: false}>>(true);
expectType<IsTuple<readonly [number?, string?, ...number[]], {fixedLengthOnly: false}>>(true);
expectType<IsTuple<readonly [...number[], string, number], {fixedLengthOnly: false}>>(true);
expectType<IsTuple<readonly [number?]>>(true);
expectType<IsTuple<readonly [never]>>(true);

// Non-tuples
expectType<IsTuple<number[]>>(false);
expectType<IsTuple<readonly number[]>>(false);
expectType<IsTuple<[...number[]]>>(false);
expectType<IsTuple<[number, string, ...number[]]>>(false);
expectType<IsTuple<readonly [number?, string?, ...number[]]>>(false);
expectType<IsTuple<[...number[], string, number]>>(false);
expectType<IsTuple<readonly [...number[], string, number]>>(false);
expectType<IsTuple<never[]>>(false);
expectType<IsTuple<any[]>>(false);

// Boundary types
expectType<IsTuple<any>>({} as boolean);
expectType<IsTuple<any, {fixedLengthOnly: true}>>({} as boolean);
expectType<IsTuple<never>>(false);

// Unions
expectType<IsTuple<[number] | [number, string, boolean]>>(true);
expectType<IsTuple<[number?, string?] | [] | [number, string, ...number[]], {fixedLengthOnly: false}>>(true);
expectType<IsTuple<[number?, string?] | [] | [number, string, ...number[]]>>({} as boolean);
expectType<IsTuple<number[] | string[]>>(false);
expectType<IsTuple<[number, string] | string[]>>({} as boolean);
expectType<IsTuple<[string] | [number] | number[]>>({} as boolean);
expectType<IsTuple<[string, ...number[]] | [number?, string?, ...number[]]>>(false);
expectType<IsTuple<[string, ...number[]] | [number?, string?, ...number[]], {fixedLengthOnly: false}>>(true);
expectType<IsTuple<[] | [number] | readonly [string]>>(true);

// Labeled tuples
expectType<IsTuple<[x: string, y: number]>>(true);
expectType<IsTuple<[first: string, ...rest: number[]]>>(false);
expectType<IsTuple<[first: string, ...rest: number[]], {fixedLengthOnly: false}>>(true);
expectType<IsTuple<readonly [name: string, age?: number]>>(true);

// Mixed optional/required elements
expectType<IsTuple<[string, number?]>>(true);
expectType<IsTuple<readonly [string, number?, ...boolean[]]>>(false);
expectType<IsTuple<readonly [string, number?, ...boolean[]], {fixedLengthOnly: false}>>(true);

// Setting `fixedLengthOnly` to `boolean` falls back to it's default value of `true`
expectType<IsTuple<[number, string, ...number[]], {fixedLengthOnly: boolean}>>(false);

// @ts-expect-error only works with arrays
type T = IsTuple<{}>;

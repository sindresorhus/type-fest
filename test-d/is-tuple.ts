import {expectTypeOf} from 'nz';
import type {IsTuple} from '../index.d.ts';

// Tuples
expectTypeOf<IsTuple<[]>>().toBe<true>();
expectTypeOf<IsTuple<[number]>>().toBe<true>();
expectTypeOf<IsTuple<[number, string]>>().toBe<true>();
expectTypeOf<IsTuple<[number, string, ...number[]], {fixedLengthOnly: false}>>().toBe<true>();
expectTypeOf<IsTuple<[number?]>>().toBe<true>();
expectTypeOf<IsTuple<[number?, string?]>>().toBe<true>();
expectTypeOf<IsTuple<[number?, string?, ...number[]], {fixedLengthOnly: false}>>().toBe<true>();
expectTypeOf<IsTuple<[...number[], string, number], {fixedLengthOnly: false}>>().toBe<true>();
expectTypeOf<IsTuple<[never]>>().toBe<true>();

// Readonly tuples
expectTypeOf<IsTuple<readonly []>>().toBe<true>();
expectTypeOf<IsTuple<readonly [number]>>().toBe<true>();
expectTypeOf<IsTuple<readonly [number, string, ...number[]], {fixedLengthOnly: false}>>().toBe<true>();
expectTypeOf<IsTuple<readonly [number?, string?, ...number[]], {fixedLengthOnly: false}>>().toBe<true>();
expectTypeOf<IsTuple<readonly [...number[], string, number], {fixedLengthOnly: false}>>().toBe<true>();
expectTypeOf<IsTuple<readonly [number?]>>().toBe<true>();
expectTypeOf<IsTuple<readonly [never]>>().toBe<true>();

// Non-tuples
expectTypeOf<IsTuple<number[]>>().toBe<false>();
expectTypeOf<IsTuple<readonly number[]>>().toBe<false>();
expectTypeOf<IsTuple<[...number[]]>>().toBe<false>();
expectTypeOf<IsTuple<[number, string, ...number[]]>>().toBe<false>();
expectTypeOf<IsTuple<readonly [number?, string?, ...number[]]>>().toBe<false>();
expectTypeOf<IsTuple<[...number[], string, number]>>().toBe<false>();
expectTypeOf<IsTuple<readonly [...number[], string, number]>>().toBe<false>();
expectTypeOf<IsTuple<never[]>>().toBe<false>();
expectTypeOf<IsTuple<any[]>>().toBe<false>();

// Boundary types
expectTypeOf<boolean>().toBe<IsTuple<any>>();
expectTypeOf<boolean>().toBe<IsTuple<any, {fixedLengthOnly: true}>>();
expectTypeOf<IsTuple<never>>().toBe<false>();

// Unions
expectTypeOf<IsTuple<[number] | [number, string, boolean]>>().toBe<true>();
expectTypeOf<IsTuple<[number?, string?] | [] | [number, string, ...number[]], {fixedLengthOnly: false}>>().toBe<true>();
expectTypeOf<boolean>().toBe<IsTuple<[number?, string?] | [] | [number, string, ...number[]]>>();
expectTypeOf<IsTuple<number[] | string[]>>().toBe<false>();
expectTypeOf<boolean>().toBe<IsTuple<[number, string] | string[]>>();
expectTypeOf<boolean>().toBe<IsTuple<[string] | [number] | number[]>>();
expectTypeOf<IsTuple<[string, ...number[]] | [number?, string?, ...number[]]>>().toBe<false>();
expectTypeOf<IsTuple<[string, ...number[]] | [number?, string?, ...number[]], {fixedLengthOnly: false}>>().toBe<true>();
expectTypeOf<IsTuple<[] | [number] | readonly [string]>>().toBe<true>();

// Labeled tuples
expectTypeOf<IsTuple<[x: string, y: number]>>().toBe<true>();
expectTypeOf<IsTuple<[first: string, ...rest: number[]]>>().toBe<false>();
expectTypeOf<IsTuple<[first: string, ...rest: number[]], {fixedLengthOnly: false}>>().toBe<true>();
expectTypeOf<IsTuple<readonly [name: string, age?: number]>>().toBe<true>();

// Mixed optional/required elements
expectTypeOf<IsTuple<[string, number?]>>().toBe<true>();
expectTypeOf<IsTuple<readonly [string, number?, ...boolean[]]>>().toBe<false>();
expectTypeOf<IsTuple<readonly [string, number?, ...boolean[]], {fixedLengthOnly: false}>>().toBe<true>();

// Setting `fixedLengthOnly` to `boolean` falls back to it's default value of `true`
expectTypeOf<IsTuple<[number, string, ...number[]], {fixedLengthOnly: boolean}>>().toBe<false>();

// @ts-expect-error only works with arrays
type T = IsTuple<{}>;

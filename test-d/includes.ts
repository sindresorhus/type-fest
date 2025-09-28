import {expectType} from 'tsd';
import type {Includes} from '../source/includes.d.ts';

declare const boolean: boolean;

// ---------- Basic definite cases ----------
expectType<Includes<[1, 2, 3], 1>>(true);
expectType<Includes<[1, 2, 3], 3>>(true);
expectType<Includes<[1, 2, 3], 4>>(false);

// ---------- Optional elements ----------
expectType<Includes<[a: string, b?: number], string>>(true);
expectType<Includes<[a: string, b?: number], number>>(boolean);
expectType<Includes<[a: string, b?: number], undefined>>(false);

// ---------- Explicit undefined ----------
expectType<Includes<[a: string, b: undefined], undefined>>(true);
expectType<Includes<[a: string, b: undefined], string>>(true);
expectType<Includes<[a: string, b: undefined], number>>(false);

// ---------- Empty tuple ----------
expectType<Includes<[], any>>(false);
expectType<Includes<[], never>>(false);
expectType<Includes<[], undefined>>(false);

// ---------- Homogeneous arrays ----------
expectType<Includes<string[], string>>(true);
expectType<Includes<string[], number>>(false);
expectType<Includes<readonly number[], number>>(true);
expectType<Includes<readonly number[], string>>(false);

// ---------- Nested ----------
expectType<Includes<[[1, 2], [3, 4]], [1, 2]>>(true);
expectType<Includes<[[1, 2], [3, 4]], [2, 3]>>(false);
expectType<Includes<[{a: 1; b: 2}, {a: 3; b: 4}], {a: 1; b: 2}>>(true);
expectType<Includes<[{a: 1; b: 2}, {c: 3; d: 4}], {c: 3; d: 4}>>(true);

// ---------- Optional + required mix ----------
expectType<Includes<[1, 3, 3?], 3>>(true);
expectType<Includes<[1, 2?, 3?], 1>>(true);
expectType<Includes<[1, 2?, 3?], 2>>(boolean);
expectType<Includes<[1, 2?, 3?], 3>>(boolean);

// ---------- Unions ----------
expectType<Includes<[1 | 2, 3], 1>>(false);
expectType<Includes<[1 | 2, 3], 1 | 2>>(true);
expectType<Includes<[1, 3] | [2, 3], 1>>(true);

// ---------- Literal cases ----------
declare const sym: unique symbol;
expectType<Includes<[typeof sym], typeof sym>>(true);
expectType<Includes<[typeof sym], symbol>>(false);

// ---------- Mixed optional ----------
expectType<Includes<[1?, 2?], 1>>(boolean);
expectType<Includes<[1?, 2?], 2>>(boolean);
expectType<Includes<[1?, 2?], 3>>(false);
expectType<Includes<[undefined?], undefined>>(boolean);
expectType<Includes<[undefined], undefined>>(true);
expectType<Includes<[undefined?], number>>(false);

// ---------- Edge cases ----------
expectType<Includes<[never], any>>(false);
expectType<Includes<[never], never>>(true);
expectType<Includes<any, any>>(boolean);
expectType<Includes<never, never>>(false);

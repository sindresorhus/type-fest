import {expectType} from 'tsd';
import type {Includes} from '../source/includes.d.ts';

declare const boolean: boolean;

// ---------- Basic definite cases ----------
expectType<Includes<[1, 2, 3], 1>>(true);
expectType<Includes<[1, 2, 3], 3>>(true);
expectType<Includes<[1, 2, 3], 4>>(false);

// ---------- Explicit undefined ----------
expectType<Includes<[a: string, b: undefined], undefined>>(true);
expectType<Includes<[a: string, b: undefined], string>>(true);
expectType<Includes<[a: string, b: undefined], number>>(false);

// ---------- Empty tuple ----------
expectType<Includes<[], any>>(false);
expectType<Includes<[], never>>(false);
expectType<Includes<[], undefined>>(false);

// ---------- Homogeneous arrays ----------
expectType<Includes<string[], string>>(boolean);
expectType<Includes<string[], number>>(false);
expectType<Includes<string[], 'a', {distributeItem: true}>>(boolean);
expectType<Includes<readonly number[], number>>(boolean);
expectType<Includes<readonly number[], string>>(false);

// ---------- Nested ----------
expectType<Includes<[[1, 2], [3, 4]], [1, 2]>>(true);
expectType<Includes<[[1, 2], [3, 4]], [2, 3]>>(false);
expectType<Includes<[{a: 1; b: 2}, {a: 3; b: 4}], {a: 1; b: 2}>>(true);
expectType<Includes<[{a: 1; b: 2}, {c: 3; d: 4}], {c: 3; d: 4}>>(true);

// ---------- Optional/Rest ----------
expectType<Includes<[1, 3, 3?], 3>>(true);
expectType<Includes<[1, 2?, 3?], 1>>(true);
expectType<Includes<[1, 2?, 3?], 2>>(boolean);
expectType<Includes<[1?, 2?, 3?], 1>>(boolean);
expectType<Includes<[1?, 2?, 3?], 4>>(false);
expectType<Includes<readonly [1, 2?, 3?], 2>>(boolean);
expectType<Includes<[1, ...Array<2>, 3], 3>>(true);
expectType<Includes<[1, 3?, ...Array<2>], 2>>(boolean);
expectType<Includes<[1, 3?, ...Array<2>], 3>>(boolean);
expectType<Includes<[1, 2, ...Array<2>], 2>>(true);
expectType<Includes<[1, ...Array<2>, 2], 2>>(true);
expectType<Includes<[1, 2?, ...Array<2>], 2>>(boolean);

// ---------- Literal cases ----------
declare const sym: unique symbol;
expectType<Includes<[typeof sym], typeof sym>>(true);
expectType<Includes<[typeof sym], symbol>>(false);

// ---------- Undefined/null ----------
expectType<Includes<[1?, 2?], undefined>>(false);
expectType<Includes<[undefined?], undefined>>(boolean);
expectType<Includes<[undefined], undefined>>(true);
expectType<Includes<[undefined?], number>>(false);
expectType<Includes<[null], null>>(true);
expectType<Includes<[null?], null>>(boolean);
expectType<Includes<[null], undefined>>(false);

// ---------- Unions ----------
expectType<Includes<[1 | 2, 3], 1>>(false);
expectType<Includes<[1 | 2, 3], 1, {distributeItem: true}>>(boolean);
expectType<Includes<[1, 3], 1 | 2>>(false);
expectType<Includes<[1, 3], 1 | 2, {distributeItem: true}>>(boolean);
expectType<Includes<[1, 2], 1 | 2>>(false);
expectType<Includes<[1, 2], 1 | 2, {distributeItem: true}>>(true);
expectType<Includes<[1 | 2, 3], 1 | 2>>(true);
expectType<Includes<[1 | 2, 3], 1 | 2, {distributeItem: true}>>(boolean);
expectType<Includes<[1, 3] | [2, 3], 3>>(true);
expectType<Includes<[1, 3] | [2, 3], 5>>(false);
expectType<Includes<[1, 3] | [2, 3], 1>>(boolean);

// --------- Distribution ---------
expectType<Includes<[true, false], true>>(true);
expectType<Includes<[true, false], boolean>>(false);
expectType<Includes<[boolean], boolean>>(true);
expectType<Includes<[string, number], 'a'>>(false);
expectType<Includes<[1, 2, 3], number>>(false);
expectType<Includes<[true, false], true, {distributeItem: true}>>(true);
expectType<Includes<[true, false], boolean, {distributeItem: true}>>(true);
expectType<Includes<[boolean], boolean, {distributeItem: true}>>(boolean);
expectType<Includes<[string, number], 'a', {distributeItem: true}>>(boolean);
expectType<Includes<[1, 2, 3], number, {distributeItem: true}>>(boolean);
expectType<Includes<[any], unknown, {distributeItem: true}>>(true);

// ---------- Edge cases ----------
expectType<Includes<[never], any>>(false);
expectType<Includes<[never], never>>(true);
expectType<Includes<[never], any, {distributeItem: true}>>(false);
expectType<Includes<[never], never, {distributeItem: true}>>(true);
expectType<Includes<[unknown], unknown>>(true);
expectType<Includes<[unknown], string>>(false);
expectType<Includes<[1, unknown], unknown>>(true);
expectType<Includes<any, any>>({} as any);
expectType<Includes<never, never>>({} as never);

import {expectTypeOf} from 'nz';
import type {HomomorphicPick} from '../../source/internal/index.d.ts';

// Picks specified keys
declare const test1: HomomorphicPick<{a: 1; b: 2; c: 3}, 'a' | 'b'>;
expectTypeOf(test1).toBe<{a: 1; b: 2}>();

// Works with unions
declare const test2: HomomorphicPick<{a: 1; b: 2} | {a: 3; c: 4}, 'a'>;
expectTypeOf(test2).toBe<{a: 1} | {a: 3}>();

declare const test3: HomomorphicPick<{a: 1; b: 2} | {c: 3; d: 4}, 'a' | 'c'>;
expectTypeOf(test3).toBe<{a: 1} | {c: 3}>();

// Preserves property modifiers
declare const test4: HomomorphicPick<{readonly a: 1; b?: 2; readonly c?: 3}, 'a' | 'c'>;
expectTypeOf(test4).toBe<{readonly a: 1; readonly c?: 3}>();

declare const test5: HomomorphicPick<{readonly a: 1; b?: 2} | {readonly c?: 3; d?: 4}, 'a' | 'c'>;
expectTypeOf(test5).toBe<{readonly a: 1} | {readonly c?: 3}>();

// Passes through primitives unchanged
declare const test6: HomomorphicPick<string, never>;
expectTypeOf(test6).toBe<string>();

declare const test7: HomomorphicPick<number, never>;
expectTypeOf(test7).toBe<number>();

declare const test8: HomomorphicPick<boolean, never>;
expectTypeOf(test8).toBe<boolean>();

declare const test9: HomomorphicPick<bigint, never>;
expectTypeOf(test9).toBe<bigint>();

declare const test10: HomomorphicPick<symbol, never>;
expectTypeOf(test10).toBe<symbol>();

// Picks all keys, if `KeyType` is `any`
declare const test11: HomomorphicPick<{readonly a: 1; b?: 2} | {readonly c?: 3}, any>;
expectTypeOf(test11).toBe<{readonly a: 1; b?: 2} | {readonly c?: 3}>();

// Picks no keys, if `KeyType` is `never`
declare const test12: HomomorphicPick<{a: 1; b: 2}, never>;
expectTypeOf(test12).toBe<{}>();

// Works with index signatures
declare const test13: HomomorphicPick<{[k: string]: unknown; a: 1; b: 2}, 'a' | 'b'>;
expectTypeOf(test13).toBe<{a: 1; b: 2}>();

// Doesn't pick `number` from a `string` index signature
declare const test14: HomomorphicPick<{[k: string]: unknown}, number>;
expectTypeOf(test14).toBe<{}>();

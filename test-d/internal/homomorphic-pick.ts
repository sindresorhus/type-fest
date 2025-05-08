import {expectType} from 'tsd';
import type {HomomorphicPick} from '../../source/internal/index.d.ts';

// Picks specified keys
declare const test1: HomomorphicPick<{a: 1; b: 2; c: 3}, 'a' | 'b'>;
expectType<{a: 1; b: 2}>(test1);

// Works with unions
declare const test2: HomomorphicPick<{a: 1; b: 2} | {a: 3; c: 4}, 'a'>;
expectType<{a: 1} | {a: 3}>(test2);

declare const test3: HomomorphicPick<{a: 1; b: 2} | {c: 3; d: 4}, 'a' | 'c'>;
expectType<{a: 1} | {c: 3}>(test3);

// Preserves property modifiers
declare const test4: HomomorphicPick<{readonly a: 1; b?: 2; readonly c?: 3}, 'a' | 'c'>;
expectType<{readonly a: 1; readonly c?: 3}>(test4);

declare const test5: HomomorphicPick<{readonly a: 1; b?: 2} | {readonly c?: 3; d?: 4}, 'a' | 'c'>;
expectType<{readonly a: 1} | {readonly c?: 3}>(test5);

// Passes through primitives unchanged
declare const test6: HomomorphicPick<string, never>;
expectType<string>(test6);

declare const test7: HomomorphicPick<number, never>;
expectType<number>(test7);

declare const test8: HomomorphicPick<boolean, never>;
expectType<boolean>(test8);

declare const test9: HomomorphicPick<bigint, never>;
expectType<bigint>(test9);

declare const test10: HomomorphicPick<symbol, never>;
expectType<symbol>(test10);

// Picks all keys, if `KeyType` is `any`
declare const test11: HomomorphicPick<{readonly a: 1; b?: 2} | {readonly c?: 3}, any>;
expectType<{readonly a: 1; b?: 2} | {readonly c?: 3}>(test11);

// Picks no keys, if `KeyType` is `never`
declare const test12: HomomorphicPick<{a: 1; b: 2}, never>;
expectType<{}>(test12);

// Works with index signatures
declare const test13: HomomorphicPick<{[k: string]: unknown; a: 1; b: 2}, 'a' | 'b'>;
expectType<{a: 1; b: 2}>(test13);

// Doesn't pick `number` from a `string` index signature
// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
declare const test14: HomomorphicPick<{[k: string]: unknown}, number>;
expectType<{}>(test14);

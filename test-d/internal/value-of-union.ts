import {expectType} from 'tsd';
import type {ValueOfUnion} from '../../source/internal/index.d.ts';

// Works with objects
declare const test1: ValueOfUnion<{a: 1; b: 2} | {a: 3; c: 4}, 'a'>;
expectType<1 | 3>(test1);

// Works with arrays
declare const test2: ValueOfUnion<string[] | [number, boolean], number>;
expectType<string | number | boolean>(test2);

// Works with index signatures
declare const test3: ValueOfUnion<{[x: string]: string; a: 'a'} | {[x: number]: number; a: 'a'}, string>;
expectType<string>(test3);

declare const test4: ValueOfUnion<{[x: string]: string; a: 'a'} | {[x: number]: number; a: 'a'}, number>;
expectType<string | number>(test4);

// Works with functions
declare const test5: ValueOfUnion<(() => void) | {(): void; a: 1} | {(): void; a: 2}, 'a'>;
expectType<1 | 2>(test5);

// Ignores objects where `Key` is missing
declare const test6: ValueOfUnion<{a: 1; b: 2} | {a: 3; c: 4} | {a: 5; d: 6} | {e: 7}, 'a'>;
expectType<1 | 3 | 5>(test6);

// Adds `undefined` when the key is optional
declare const test7: ValueOfUnion<{readonly a?: 1; b: 2} | {a: 3; c: 4}, 'a'>;
expectType<1 | 3 | undefined>(test7);

// Works when `Key` is a union
declare const test8: ValueOfUnion<{a: 1; b: 2} | {a: 3; c: 4} | {a: 5; b: 6} | {e: 7}, 'a' | 'b'>;
expectType<1 | 2 | 3 | 5 | 6>(test8);

// @ts-expect-error - Errors if `Key` is missing from all of the objects
declare const test9: ValueOfUnion<{a: 1; b: 2} | {a: 3; c: 4}, 'd'>;

// Returns `any` when `Key` is `any`
declare const test10: ValueOfUnion<{a: 1; b: 2} | {a: 3; c: 4}, any>;
expectType<any>(test10);

// Returns `never` when `Key` is `never`
declare const test11: ValueOfUnion<{a: 1; b: 2} | {a: 3; c: 4}, never>;
expectType<never>(test11);

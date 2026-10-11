import {expectTypeOf} from 'nz';
import type {ValueOfUnion} from '../../source/internal/index.d.ts';

// Works with objects
declare const test1: ValueOfUnion<{a: 1; b: 2} | {a: 3; c: 4}, 'a'>;
expectTypeOf(test1).toBe<1 | 3>();

// Works with arrays
declare const test2: ValueOfUnion<string[] | [number, boolean], number>;
expectTypeOf(test2).toBe<string | number | boolean>();

// Works with index signatures
declare const test3: ValueOfUnion<{[x: string]: string; a: 'a'} | {[x: number]: number; a: 'a'}, string>;
expectTypeOf(test3).toBe<string>();

declare const test4: ValueOfUnion<{[x: string]: string; a: 'a'} | {[x: number]: number; a: 'a'}, number>;
expectTypeOf(test4).toBe<string | number>();

// Works with functions
declare const test5: ValueOfUnion<(() => void) | {(): void; a: 1} | {(): void; a: 2}, 'a'>;
expectTypeOf(test5).toBe<1 | 2>();

// Ignores objects where `Key` is missing
declare const test6: ValueOfUnion<{a: 1; b: 2} | {a: 3; c: 4} | {a: 5; d: 6} | {e: 7}, 'a'>;
expectTypeOf(test6).toBe<1 | 3 | 5>();

// Adds `undefined` when the key is optional
declare const test7: ValueOfUnion<{readonly a?: 1; b: 2} | {a: 3; c: 4}, 'a'>;
expectTypeOf(test7).toBe<1 | 3 | undefined>();

// Works when `Key` is a union
declare const test8: ValueOfUnion<{a: 1; b: 2} | {a: 3; c: 4} | {a: 5; b: 6} | {e: 7}, 'a' | 'b'>;
expectTypeOf(test8).toBe<1 | 2 | 3 | 5 | 6>();

// @ts-expect-error - Errors if `Key` is missing from all of the objects
declare const test9: ValueOfUnion<{a: 1; b: 2} | {a: 3; c: 4}, 'd'>;

// Returns `any` when `Key` is `any`
declare const test10: ValueOfUnion<{a: 1; b: 2} | {a: 3; c: 4}, any>;
expectTypeOf(test10).toBe<any>();

// Returns `never` when `Key` is `never`
declare const test11: ValueOfUnion<{a: 1; b: 2} | {a: 3; c: 4}, never>;
expectTypeOf(test11).toBe<never>();

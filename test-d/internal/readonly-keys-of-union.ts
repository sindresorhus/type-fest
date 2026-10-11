import {expectTypeOf} from 'nz';
import type {ReadonlyKeysOfUnion} from '../../source/internal/index.d.ts';

declare const test1: ReadonlyKeysOfUnion<{readonly a: 1; b: 2}>;
expectTypeOf(test1).toBe<'a'>();

declare const test2: ReadonlyKeysOfUnion<{readonly a: 1; b?: 2} | {readonly c?: 3; d: 4}>;
expectTypeOf(test2).toBe<'a' | 'c'>();

declare const test3: ReadonlyKeysOfUnion<{readonly a: 1; b?: 2} | {readonly c?: 3; d: 4} | {readonly c: 5} | {d: 6}>;
expectTypeOf(test3).toBe<'a' | 'c'>();

// Returns `never` if there's no readonly key
declare const test4: ReadonlyKeysOfUnion<{a: 1; b?: 2} | {c?: 3; d: 4}>;
expectTypeOf(test4).toBe<never>();

// Works with index signatures
declare const test5: ReadonlyKeysOfUnion<{readonly [x: string]: number; a: 1} | {readonly [x: symbol]: number; a: 2}>;
expectTypeOf(test5).toBe<string | number | symbol>();

// Works with arrays
declare const test7: ReadonlyKeysOfUnion<readonly string[] | readonly [number, number]>;
expectTypeOf(test7).toBe<number | typeof Symbol.unscopables | '0' | '1' | 'length'>();

// Works with functions
declare const test8: ReadonlyKeysOfUnion<(() => void) | {(): void; readonly a: 1}>;
expectTypeOf(test8).toBe<'a'>();

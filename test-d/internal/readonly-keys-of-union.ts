import {expectType} from 'tsd';
import type {ReadonlyKeysOfUnion} from '../../source/internal/index.d.ts';

declare const test1: ReadonlyKeysOfUnion<{readonly a: 1; b: 2}>;
expectType<'a'>(test1);

declare const test2: ReadonlyKeysOfUnion<{readonly a: 1; b?: 2} | {readonly c?: 3; d: 4}>;
expectType<'a' | 'c'>(test2);

declare const test3: ReadonlyKeysOfUnion<{readonly a: 1; b?: 2} | {readonly c?: 3; d: 4} | {readonly c: 5} | {d: 6}>;
expectType<'a' | 'c'>(test3);

// Returns `never` if there's no readonly key
declare const test4: ReadonlyKeysOfUnion<{a: 1; b?: 2} | {c?: 3; d: 4}>;
expectType<never>(test4);

// Works with index signatures
declare const test5: ReadonlyKeysOfUnion<{readonly [x: string]: number; a: 1} | {readonly [x: symbol]: number; a: 2}>;
expectType<string | number | symbol>(test5);

// Works with arrays
declare const test7: ReadonlyKeysOfUnion<readonly string[] | readonly [number, number]>;
expectType<number | typeof Symbol.unscopables | '0' | '1' | 'length'>(test7);

// Works with functions
declare const test8: ReadonlyKeysOfUnion<(() => void) | {(): void; readonly a: 1}>;
expectType<'a'>(test8);

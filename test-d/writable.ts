import {expectNotAssignable, expectType} from 'tsd';
import type {Writable} from '../index.d.ts';

type Foo = {
	readonly a: number;
	readonly b: string;
};

const ab: Writable<Foo> = {a: 1, b: '2'};
ab.a = 2;
const ab2: Writable<Readonly<Foo>> = ab;
ab2.a = 2;

// Update one writable and one readonly to writable, leaving one property unaffected.
declare const variation1: Writable<{readonly a: number; b: string; readonly c: boolean}, 'b' | 'c'>;
expectType<{readonly a: number; b: string; c: boolean}>(variation1);

// Update two readonly to writable, leaving one property unaffected.
declare const variation2: Writable<{readonly a: number; readonly b: string; readonly c: boolean}, 'a' | 'b'>;
expectType<{a: number; b: string; readonly c: boolean}>(variation2);

// Three writable remain writable.
declare const variation3: Writable<{a: number; b: string; c: boolean}, 'a' | 'b' | 'c'>;
expectType<{a: number; b: string; c: boolean}>(variation3);

// Check if type changes raise an error even if readonly and writable are applied correctly.
declare const variation4: Writable<{readonly a: number; b: string; readonly c: boolean}, 'b' | 'c'>;
expectNotAssignable<{readonly a: boolean; b: string; c: boolean}>(variation4);

// Test array
declare const variation5: Writable<readonly string[]>;
expectType<string[]>(variation5);

// Test tuple
declare const variation8: Writable<readonly [string, number]>;
expectType<[string, number]>(variation8);

// Test tuple with spread
declare const variation6: Writable<readonly [...string[], number]>;
expectType<[...string[], number]>(variation6);
declare const variation7: Writable<readonly [string, ...number[]]>;
expectType<[string, ...number[]]>(variation7);

// Test readonly set
declare const variation9: Writable<ReadonlySet<string>>;
expectType<Set<string>>(variation9);

// Test readonly map
declare const variation10: Writable<ReadonlyMap<string, number>>;
expectType<Map<string, number>>(variation10);

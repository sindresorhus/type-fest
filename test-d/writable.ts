import {expectTypeOf} from 'expect-type';
import type {Writable} from '../index';

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
expectTypeOf(variation1).toEqualTypeOf<{readonly a: number; b: string; c: boolean}>();

// Update two readonly to writable, leaving one property unaffected.
declare const variation2: Writable<{readonly a: number; readonly b: string; readonly c: boolean}, 'a' | 'b'>;
expectTypeOf(variation2).toEqualTypeOf<{a: number; b: string; readonly c: boolean}>();

// Three writable remain writable.
declare const variation3: Writable<{a: number; b: string; c: boolean}, 'a' | 'b' | 'c'>;
expectTypeOf(variation3).toEqualTypeOf<{a: number; b: string; c: boolean}>();

// Check if type changes raise an error even if readonly and writable are applied correctly.
declare const variation4: Writable<{readonly a: number; b: string; readonly c: boolean}, 'b' | 'c'>;
expectTypeOf(variation4).not.toMatchTypeOf<{readonly a: boolean; b: string; c: boolean}>();

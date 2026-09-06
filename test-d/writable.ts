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

// Only strip `readonly` without otherwise changing the structure, so an index signature is preserved (https://github.com/sindresorhus/type-fest/issues/717).
declare const variation11: Writable<{readonly [key: string]: number}>;
expectType<{[key: string]: number}>(variation11);

// Preserve an index signature alongside named keys while stripping `readonly`.
declare const variation12: Writable<{readonly [key: string]: number; readonly foo: number}>;
expectType<{[key: string]: number; foo: number}>(variation12);

declare const variation13: Writable<{readonly [key: string]: number; readonly foo: number}, 'foo'>;
expectType<{readonly [key: string]: number; foo: number}>(variation13);

// Support explicit `keyof BaseType` as Keys argument
declare const variation14: Writable<Foo, keyof Foo>;
expectType<{a: number; b: string}>(variation14);

// Explicit `never` makes no properties writable.
declare const variationNever: Writable<Foo, never>;
expectType<Foo>(variationNever);
// @ts-expect-error
variationNever.a = 2;
// @ts-expect-error
variationNever.b = '2';

// Computed key selection resolving to `never` makes no properties writable.
type RecordData = {readonly id: string};
type EditableKeys = Extract<keyof RecordData, `editable${string}`>;
declare const computedNeverData: Writable<RecordData, EditableKeys>;
expectType<RecordData>(computedNeverData);
// @ts-expect-error
computedNeverData.id = 'changed';

// Readonly index signature preserved when `never` is selected.
declare const indexNever: Writable<{readonly [key: string]: number}, never>;
expectType<{readonly [key: string]: number}>(indexNever);
// @ts-expect-error
indexNever.foo = 1;
// @ts-expect-error
indexNever['foo'] = 1;

// Readonly index signature preserved when computed key selection resolves to `never`.
type IndexRecord = {readonly [key: string]: number};
type IndexKeys = Extract<keyof IndexRecord, number>;
declare const computedIndexNever: Writable<IndexRecord, IndexKeys>;
expectType<IndexRecord>(computedIndexNever);
// @ts-expect-error
computedIndexNever.foo = 1;
// @ts-expect-error
computedIndexNever['foo'] = 1;

// Test edge cases: any, never, unknown
declare const anyVariation: Writable<any>;
expectType<any>(anyVariation);

declare const neverVariation: Writable<never>;
expectType<never>(neverVariation);

declare const unknownVariation: Writable<unknown>;
expectType<{}>(unknownVariation);

// Support polymorphic `this` within class methods (https://github.com/sindresorhus/type-fest/issues/1515).
class SomeClass {
	readonly field!: number;

	method() {
		(this as Writable<this>).field = 4;
		(this as Writable<typeof this>).field = 4;
	}
}

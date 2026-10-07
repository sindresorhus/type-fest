import {expectNotAssignable, expectType} from 'tsd';
import type {KeysOfUnion, Writable} from '../index.d.ts';

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

// Test tuple with optional elements
declare const variation14: Writable<readonly [string?, number?]>;
expectType<[string?, number?]>(variation14);
declare const variation15: Writable<readonly [string, number?]>;
expectType<[string, number?]>(variation15);
declare const variation16: Writable<readonly [string?, ...number[]]>;
expectType<[string?, ...number[]]>(variation16);

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

// `Readonly<T>` distributes over a union, so `Writable` is its inverse and must too. Without it, `keyof` of the union is the intersection of the members' keys, which is empty here, so neither member is touched.
declare const union: Writable<{readonly a: number} | {readonly b: number}>;
expectType<{a: number} | {b: number}>(union);

declare const single: Writable<{readonly a: number}>;
expectType<{a: number}>(single);

// The members share a key, so `keyof` of the union is that key alone, but every key of each member must still be made writable, because the default key set means all of them.
declare const overlappingUnion: Writable<{readonly a: number} | {readonly a: number; readonly b: string}>;
expectType<{a: number} | {a: number; b: string}>(overlappingUnion);

// `Readonly<T>` distributes over a union, so `Writable` is its inverse and has to round-trip.
declare const roundTrip: Writable<Readonly<{a: number} | {a: number; b: string}>>;
expectType<{a: number} | {a: number; b: string}>(roundTrip);

// An explicit key set is still narrowed to just those keys.
declare const selected: Writable<{readonly a: number; readonly b: string; readonly c: boolean}, 'b' | 'c'>;
expectType<{readonly a: number; b: string; c: boolean}>(selected);

// A key that only one member of a union has is still a key of that member, and the type distributes over the union anyway, so it should be accepted. `keyof` of a union is the intersection of its members' keys, so the constraint rejected it and the user got a type error instead of a result.
declare const keyOfOneMember: Writable<{readonly a: 1} | {readonly b: 2}, 'a'>;
expectType<{a: 1} | {readonly b: 2}>(keyOfOneMember);

declare const keyOfTheOtherMember: Writable<{readonly a: 1} | {readonly b: 2}, 'b'>;
expectType<{readonly a: 1} | {b: 2}>(keyOfTheOtherMember);

// A union whose members share a key still makes that one key, and the default is still every key.
declare const sharedKey: Writable<{readonly a: 1} | {readonly a: 2}>;
expectType<{a: 1} | {a: 2}>(sharedKey);

// A method that mutates its own readonly member, which is the pattern the `Writable` documentation points at. `keyof this` is not a concrete key set while the class is being checked, so the result has to resolve anyway: intersecting two mapped types over `this` never resolves, and the member came out as missing instead of writable.
class Repository {
	readonly items: string[] = [];

	add(item: string) {
		(this as Writable<this>).items = [...this.items, item];
	}
}

// A key set that names every key is the same request as naming none, whether it was passed in explicitly or left to the default.
type EveryKey = {readonly a: number; b: string};
declare const explicitEveryKey: Writable<EveryKey, KeysOfUnion<EveryKey>>;
expectType<{a: number; b: string}>(explicitEveryKey);

declare const implicitEveryKey: Writable<EveryKey>;
expectType<{a: number; b: string}>(implicitEveryKey);

// `any` stays `any`, with or without keys.
expectType<any>({} as Writable<any>);
expectType<any>({} as Writable<any, 'a'>);

// Passing `never` as the keys changes no keys, the same as for `SetReadonly`, `SetOptional`, and `Except`.
declare const neverKeys: Writable<{readonly a: 1; readonly b: 2}, never>;
expectType<{readonly a: 1; readonly b: 2}>(neverKeys);

// A `symbol` key set changes only the symbol keys, so it is not mistaken for the default that stands for every key.
declare const symbolKeys: Writable<{readonly [key: symbol]: 2; readonly a: 1}, symbol>;
expectType<{[key: symbol]: 2; readonly a: 1}>(symbolKeys);

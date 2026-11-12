import {expectTypeOf} from 'nz';
import type {ArrayZip, Entries, FromEntries} from '../index.d.ts';

const settings = [['theme', 'dark'], ['retries', 3]] as const;
expectTypeOf<FromEntries<typeof settings>>().toBe<{theme: 'dark'; retries: 3}>();
expectTypeOf<FromEntries<ArrayZip<readonly ['name', 'age'], readonly [string, number]>>>().toBe<{name: string; age: number}>();
expectTypeOf<FromEntries<[]>>().toBe<{}>();
expectTypeOf<FromEntries<readonly []>>().toBe<{}>();
expectTypeOf<FromEntries<[['name', string], ['age', number]]>>().toBe<{name: string; age: number}>();
expectTypeOf<FromEntries<[['name', 1], ['name', 2]]>>().toBe<{name: 1 | 2}>();
expectTypeOf<FromEntries<[[0, 'a'], ['0', 'b']]>>().toBe<{0: 'a' | 'b'}>();
expectTypeOf<FromEntries<[['__proto__', 1], ['toString', 2]]>>().toBe<{__proto__: 1; toString: 2}>();

declare const identifier: unique symbol;
expectTypeOf<FromEntries<readonly [readonly [typeof identifier, number]]>>().toBe<{[identifier]: number}>();

// Unknown presence makes all keys optional, without losing key/value correlation.
expectTypeOf<FromEntries<Array<['name', string] | ['age', number]>>>().toBe<{name?: string; age?: number}>();
expectTypeOf<FromEntries<ReadonlyArray<readonly ['name', string]>>>().toBe<{name?: string}>();
expectTypeOf<FromEntries<[['name' | 'age', number], ['active', boolean]]>>().toBe<{name?: number; age?: number; active?: boolean}>();
expectTypeOf<FromEntries<[['name', string] | ['age', number]]>>().toBe<{name?: string; age?: number}>();
expectTypeOf<FromEntries<[['known', 1], ...Array<['other', 2]>]>>().toBe<{known?: 1; other?: 2}>();

// A wide key can overwrite a literal key, so values widen together.
expectTypeOf<FromEntries<[[string, number], ['known', boolean]]>>().toBe<{[key: string]: number | boolean | undefined}>();
expectTypeOf<FromEntries<Array<[number, string]>>>().toBe<{[key: number]: string | undefined}>();
expectTypeOf<FromEntries<[[`item-${number}`, 1], ['item-1', 2]]>>().toBe<{[key: `item-${number}`]: 1 | 2 | undefined}>();

expectTypeOf<FromEntries<[['name', string]] | [['age', number]]>>().toBe<{name: string} | {age: number}>();
expectTypeOf<FromEntries<[['value', any]]>>().toBe<{value: any}>();
expectTypeOf<FromEntries<[['value', never]]>>().toBe<{value: never}>();
expectTypeOf<FromEntries<[['value', unknown]]>>().toBe<{value: unknown}>();
expectTypeOf<FromEntries<[['value', string | undefined]]>>().toBe<{value: string | undefined}>();
expectTypeOf<FromEntries<any>>().toBe<any>();
expectTypeOf<FromEntries<never>>().toBe<never>();
expectTypeOf<{age: string}>().not.toBeAssignableTo<FromEntries<[['age', number]]>>();

// @ts-expect-error Entries must be an array of pairs.
type UnknownEntries = FromEntries<unknown>;
// @ts-expect-error Each entry must have a property key.
type InvalidKey = FromEntries<[[boolean, number]]>;
// @ts-expect-error Each entry must have two required elements.
type MissingValue = FromEntries<[['name']]>;
// @ts-expect-error Optional entries are unsupported.
type OptionalEntry = FromEntries<[['name', string]?]>;

// Fixed tuples.
expectTypeOf<FromEntries<[['a', 1], ['b', 2], ['c', 3]]>>().toBe<{a: 1; b: 2; c: 3}>();
expectTypeOf<FromEntries<[[key: 'a', value: 1]]>>().toBe<{a: 1}>();
expectTypeOf<FromEntries<[['a', 1], ['b', 2], ['a', 3]]>>().toBe<{a: 1 | 3; b: 2}>();
expectTypeOf<FromEntries<[[1, 'one'], [2, 'two']]>>().toBe<{1: 'one'; 2: 'two'}>();
expectTypeOf<FromEntries<[['0', 'a'], [0, 'b']]>>().toBe<{'0': 'a' | 'b'}>();
expectTypeOf<FromEntries<[['a', {nested: true}], ['b', string[]]]>>().toBe<{a: {nested: true}; b: string[]}>();
expectTypeOf<FromEntries<[['a', undefined]]>>().toBe<{a: undefined}>();
expectTypeOf<FromEntries<[['a', 1], readonly ['b', 2]]>>().toBe<{a: 1; b: 2}>();

enum Field {
	Name = 'name',
	Age = 'age',
}
expectTypeOf<FromEntries<[[Field.Name, string], [Field.Age, number]]>>().toBe<{[Field.Name]: string; [Field.Age]: number}>();

// The result is mutable even for readonly entries.
const fields = [['id', 1], ['title', 'Hello']] as const;
expectTypeOf<FromEntries<typeof fields>>().toBe<{id: 1; title: 'Hello'}>();

// Arrays of unknown length.
expectTypeOf<FromEntries<Array<['a', 1] | ['b', 2] | ['c', 3]>>>().toBe<{a?: 1; b?: 2; c?: 3}>();
expectTypeOf<FromEntries<Array<['a', 1] | ['a', 2]>>>().toBe<{a?: 1 | 2}>();
expectTypeOf<FromEntries<Array<['a' | 'b', 1]>>>().toBe<{a?: 1; b?: 1}>();
expectTypeOf<FromEntries<[...Array<['a', 1]>, ['b', 2]]>>().toBe<{a?: 1; b?: 2}>();
expectTypeOf<FromEntries<never[]>>().toBe<{}>();
expectTypeOf<FromEntries<Array<[string, number]>>>().toBe<{[key: string]: number | undefined}>();
expectTypeOf<FromEntries<Array<[symbol, number]>>>().toBe<{[key: symbol]: number | undefined}>();
expectTypeOf<FromEntries<Array<[PropertyKey, number]>>>().toBe<Partial<Record<PropertyKey, number>>>();
expectTypeOf<FromEntries<Array<[string, number] | ['a', boolean]>>>().toBe<{[key: string]: number | boolean | undefined}>();

// Round trip from object entries, where every key may be missing.
expectTypeOf<FromEntries<Entries<{a: 1; b: 2}>>>().toBe<{a?: 1; b?: 2}>();

// A union of tuples gives a union of objects.
expectTypeOf<FromEntries<[['a', 1]] | [['b', 2], ['c', 3]]>>().toBe<{a: 1} | {b: 2; c: 3}>();
expectTypeOf<FromEntries<[['a', 1]] | Array<['b', 2]>>>().toBe<{a: 1} | {b?: 2}>();

// Assignability.
expectTypeOf<{theme: 'dark'}>().not.toBeAssignableTo<FromEntries<typeof settings>>();
expectTypeOf<{theme: 'dark'; retries: 3}>().toBeAssignableTo<FromEntries<typeof settings>>();
expectTypeOf<{}>().toBeAssignableTo<FromEntries<Array<['a', 1] | ['b', 2]>>>();
expectTypeOf<{a: 2}>().not.toBeAssignableTo<FromEntries<Array<['a', 1] | ['b', 2]>>>();

declare const built: FromEntries<typeof settings>;
expectTypeOf(built.theme).toBe<'dark'>();
// @ts-expect-error There is no `missing` key.
const _missing: unknown = built.missing;

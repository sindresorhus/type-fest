import {expectAssignable, expectType} from 'tsd';
import type {Entries, ObjectEntries, ObjectEntry} from '../index.d.ts';
import type {Entry} from '../source/entry.d.ts';

// Objects
const objectExample = {a: 1};

const objectEntry: Entry<typeof objectExample> = ['a', 1];
expectAssignable<[string, number]>(objectEntry);

const objectEntries: Entries<typeof objectExample> = [objectEntry];
expectAssignable<Array<[string, number]>>(objectEntries);

// Maps
const mapExample = new Map([['a', 1]]);

const mapEntry: Entry<typeof mapExample> = ['a', 1];
expectAssignable<[string, number]>(mapEntry);

const mapEntries: Entries<typeof mapExample> = [mapEntry];
expectAssignable<Array<[string, number]>>(mapEntries);

// Arrays
const arrayExample = ['a', 1];

const arrayEntryString: Entry<typeof arrayExample> = [0, 'a'];
expectAssignable<[number, (string | number)]>(arrayEntryString);

const arrayEntryNumber: Entry<typeof arrayExample> = [1, 1];
expectAssignable<[number, (string | number)]>(arrayEntryNumber);

const arrayEntries: Entries<typeof arrayExample> = [
	arrayEntryString,
	arrayEntryNumber,
];
expectAssignable<Array<[number, (string | number)]>>(arrayEntries);

// Sets
const setExample = new Set(['a', 1]);

const setEntryString: Entry<typeof setExample> = ['a', 'a'];
expectAssignable<[(string | number), (string | number)]>(setEntryString);

const setEntryNumber: Entry<typeof setExample> = [1, 1];
expectAssignable<[(string | number), (string | number)]>(setEntryNumber);

const setEntries: Entries<typeof setExample> = [
	setEntryString,
	setEntryNumber,
];
expectAssignable<Array<[(string | number), (string | number)]>>(setEntries);

// ObjectEntry
type Example = {
	a: number;
	b: string;
};

declare const exampleObjectEntry: ObjectEntry<Example>;
expectType<['a' | 'b', string | number]>(exampleObjectEntry);

// ObjectEntries
declare const exampleObjectEntries: ObjectEntries<Example>;
expectType<Array<['a' | 'b', string | number]>>(exampleObjectEntries);

// ObjectEntry and ObjectEntries preserve type information with generic type parameters
declare function getEntries<T extends Record<string, unknown>>(object: T): ObjectEntries<T>;
declare function getEntry<T extends Record<string, unknown>>(object: T): ObjectEntry<T>;

declare const genericEntries: ReturnType<typeof getEntries<Example>>;
expectType<Array<['a' | 'b', string | number]>>(genericEntries);

declare const genericEntry: ReturnType<typeof getEntry<Example>>;
expectType<['a' | 'b', string | number]>(genericEntry);

import {expectTypeOf} from 'expect-type';
import type {Entries} from '../index';
import type {Entry} from '../source/entry';

// Objects
const objectExample = {a: 1};

const objectEntry: Entry<typeof objectExample> = ['a', 1];
expectTypeOf(objectEntry).toMatchTypeOf<[string, number]>();

const objectEntries: Entries<typeof objectExample> = [objectEntry];
expectTypeOf(objectEntries).toMatchTypeOf<Array<[string, number]>>();

// Maps
const mapExample = new Map([['a', 1]]);

const mapEntry: Entry<typeof mapExample> = ['a', 1];
expectTypeOf(mapEntry).toMatchTypeOf<[string, number]>();

const mapEntries: Entries<typeof mapExample> = [mapEntry];
expectTypeOf(mapEntries).toMatchTypeOf<Array<[string, number]>>();

// Arrays
const arrayExample = ['a', 1];

const arrayEntryString: Entry<typeof arrayExample> = [0, 'a'];
expectTypeOf(arrayEntryString).toMatchTypeOf<[number, (string | number)]>();

const arrayEntryNumber: Entry<typeof arrayExample> = [1, 1];
expectTypeOf(arrayEntryNumber).toMatchTypeOf<[number, (string | number)]>();

const arrayEntries: Entries<typeof arrayExample> = [
	arrayEntryString,
	arrayEntryNumber,
];
expectTypeOf(arrayEntries).toMatchTypeOf<Array<[number, (string | number)]>>();

// Sets
const setExample = new Set(['a', 1]);

const setEntryString: Entry<typeof setExample> = ['a', 'a'];
expectTypeOf(setEntryString).toMatchTypeOf<[(string | number), (string | number)]>();

const setEntryNumber: Entry<typeof setExample> = [1, 1];
expectTypeOf(setEntryNumber).toMatchTypeOf<[(string | number), (string | number)]>();

const setEntries: Entries<typeof setExample> = [
	setEntryString,
	setEntryNumber,
];
expectTypeOf(setEntries).toMatchTypeOf<Array<[(string | number), (string | number)]>>();

import {expectTypeOf} from 'nz';
import type {ArrayToRecord, Opaque, Tagged} from '../index.d.ts';

// A `const` tuple keeps each element for its own key
const animals = [
	{name: 'Shadow', species: 'dog'},
	{name: 'Chance', species: 'dog'},
	{name: 'Sassy', species: 'cat'},
	{name: 'Jake the Dog', species: 'dog', isMagical: true},
] as const;

expectTypeOf<ArrayToRecord<typeof animals, 'name'>>().toBe<{
	Shadow: {readonly name: 'Shadow'; readonly species: 'dog'};
	Chance: {readonly name: 'Chance'; readonly species: 'dog'};
	Sassy: {readonly name: 'Sassy'; readonly species: 'cat'};
	'Jake the Dog': {readonly name: 'Jake the Dog'; readonly species: 'dog'; readonly isMagical: true};
}>();

// Tuple elements
expectTypeOf<ArrayToRecord<[], 'id'>>().toBe<{}>();
expectTypeOf<ArrayToRecord<[{id: 'a'; value: 1}], 'id'>>().toBe<{a: {id: 'a'; value: 1}}>();
expectTypeOf<ArrayToRecord<[{id: 'a'; value: 1}, {id: 'b'; value: 2}], 'id'>>().toBe<{a: {id: 'a'; value: 1}; b: {id: 'b'; value: 2}}>();

// Readonly tuples and elements
expectTypeOf<ArrayToRecord<readonly [], 'id'>>().toBe<{}>();
expectTypeOf<ArrayToRecord<readonly [{readonly id: 'a'; readonly value: 1}], 'id'>>().toBe<{a: {readonly id: 'a'; readonly value: 1}}>();

// A rest element is read as the array it is
expectTypeOf<ArrayToRecord<[...Array<{id: 'a'; value: 1}>, {id: 'b'; value: 2}], 'id'>>().toBe<{a: {id: 'a'; value: 1}; b: {id: 'b'; value: 2}}>();
expectTypeOf<ArrayToRecord<[...Array<{id: 'a' | 'b'; value: 1}>, {id: 'c'; value: 2}], 'id'>>().toBe<{
	a: {id: 'a' | 'b'; value: 1};
	b: {id: 'a' | 'b'; value: 1};
	c: {id: 'c'; value: 2};
}>();

// A literal element beside a wide rest shares the union of all elements
expectTypeOf<ArrayToRecord<[{id: 'a'; value: 1}, ...Array<{id: string; value: number}>], 'id'>>().toBe<{
	[x: string]: {id: 'a'; value: 1} | {id: string; value: number};
}>();
expectTypeOf<ArrayToRecord<[...Array<{id: string; value: number}>, {id: 'z'; value: 2}], 'id'>>().toBe<{
	[x: string]: {id: string; value: number} | {id: 'z'; value: 2};
}>();

// Elements that share a key value become a union
expectTypeOf<ArrayToRecord<[{id: 'a'; value: string}, {id: string; value: number}], 'id'>['a']['value']>().toBe<string | number>();
expectTypeOf<ArrayToRecord<[{id: 1; value: string}, {id: number; value: number}], 'id'>[1]['value']>().toBe<string | number>();

expectTypeOf<ArrayToRecord<[{id: 'a'; value: 1}, {id: 'a'; value: 'x'}, {id: 'b'; value: true}], 'id'>>().toBe<{
	a: {id: 'a'; value: 1} | {id: 'a'; value: 'x'};
	b: {id: 'b'; value: true};
}>();

// A union of arrays reads the elements of every member
expectTypeOf<ArrayToRecord<[{id: 'a'; value: 1}] | [{id: 'b'; value: 2}], 'id'>>().toBe<{a: {id: 'a'; value: 1}; b: {id: 'b'; value: 2}}>();

// A key value that is a union gives a key per member
expectTypeOf<ArrayToRecord<Array<{id: 'a' | 'b'; value: number}>, 'id'>>().toBe<{a: {id: 'a' | 'b'; value: number}; b: {id: 'a' | 'b'; value: number}}>();

// Number values become numeric keys
expectTypeOf<ArrayToRecord<[{id: 1; value: 'x'}, {id: 2; value: 'y'}], 'id'>>().toBe<{1: {id: 1; value: 'x'}; 2: {id: 2; value: 'y'}}>();
expectTypeOf<ArrayToRecord<Array<{id: 1 | 2; value: 'x'}>, 'id'>>().toBe<{1: {id: 1 | 2; value: 'x'}; 2: {id: 1 | 2; value: 'x'}}>();

// A number and its string spelling are the same key at runtime, so they are merged
expectTypeOf<ArrayToRecord<[{id: 1; value: 'x'}, {id: '1'; value: 'y'}], 'id'>>().toBe<{1: {id: 1; value: 'x'} | {id: '1'; value: 'y'}}>();

// A key value that is a union of a string and a number gives both keys
expectTypeOf<ArrayToRecord<[{id: 'a' | 1; value: number}], 'id'>>().toBe<{a: {id: 'a' | 1; value: number}; 1: {id: 'a' | 1; value: number}}>();

// A numeric property name is a key property like any other
expectTypeOf<ArrayToRecord<[{0: 'a'; value: 1}, {0: 'b'; value: 2}], 0>>().toBe<{a: {0: 'a'; value: 1}; b: {0: 'b'; value: 2}}>();
expectTypeOf<ArrayToRecord<[{0: 'a'}], '0'>>().toBe<{a: {0: 'a'}}>();
expectTypeOf<ArrayToRecord<[{'0': 'a'}], 0>>().toBe<{a: {'0': 'a'}}>();

// A numeric index signature is a key property like any other
expectTypeOf<ArrayToRecord<Array<Record<number, string>>, number>>().toBe<{[x: string]: Record<number, string>}>();

// A key value of type `any` gives a string index signature
expectTypeOf<ArrayToRecord<[{id: any; value: 1}], 'id'>>().toBe<{[x: string]: {id: any; value: 1}}>();

// Duplicate key values across a union of tuples are merged too
expectTypeOf<ArrayToRecord<[{id: 'a'; value: 1}] | [{id: 'a'; value: 2}], 'id'>>().toBe<{a: {id: 'a'; value: 1} | {id: 'a'; value: 2}}>();

// Other properties keep their optional modifier
expectTypeOf<ArrayToRecord<[{id: 'a'; nickname?: string}], 'id'>>().toBe<{a: {id: 'a'; nickname?: string}}>();

// String enum values are their values
enum Direction {
	Up = 'up',
	Down = 'down',
}

expectTypeOf<ArrayToRecord<[{direction: Direction.Up; step: 1}, {direction: Direction.Down; step: -1}], 'direction'>>().toBe<{
	up: {direction: Direction.Up; step: 1};
	down: {direction: Direction.Down; step: -1};
}>();

// Numeric enum values are their values
enum Level {
	Low,
	High,
}

expectTypeOf<ArrayToRecord<[{level: Level.Low; name: 'low'}, {level: Level.High; name: 'high'}], 'level'>>().toBe<{
	0: {level: Level.Low; name: 'low'};
	1: {level: Level.High; name: 'high'};
}>();

// A wide `string` key gives a string index signature
expectTypeOf<ArrayToRecord<Array<{id: string; value: number}>, 'id'>>().toBe<{[x: string]: {id: string; value: number}}>();
expectTypeOf<ArrayToRecord<ReadonlyArray<{id: string; value: number}>, 'id'>>().toBe<{[x: string]: {id: string; value: number}}>();

// A literal key value in a non-tuple array still gives its own key
expectTypeOf<ArrayToRecord<Array<{id: 'a'; value: 1}>, 'id'>>().toBe<{a: {id: 'a'; value: 1}}>();

// A wide `number` key gives a numeric index signature
expectTypeOf<ArrayToRecord<Array<{id: number; name: string}>, 'id'>>().toBe<{[x: number]: {id: number; name: string}}>();

// A wide `string | number` key gives both index signatures with the same value
expectTypeOf<ArrayToRecord<Array<{id: string | number; name: string}>, 'id'>>().toBe<{
	[x: string]: {id: string | number; name: string};
	[x: number]: {id: string | number; name: string};
}>();

// A wide `string` element and a wide `number` element give both index signatures with the union of all elements
declare const mixedIds: ArrayToRecord<Array<{id: string} | {id: number}>, 'id'>;
expectTypeOf(mixedIds['name']).toBe<{id: string} | {id: number} | undefined>();
expectTypeOf(mixedIds[1]).toBe<{id: string} | {id: number} | undefined>();

// An element with an index signature keeps it
expectTypeOf<ArrayToRecord<Array<Record<string, string>>, 'id'>>().toBe<{[x: string]: Record<string, string>}>();

// Keys that clash with object prototype names stay ordinary keys
expectTypeOf<ArrayToRecord<[{id: 'toString'; value: 1}], 'id'>>().toBe<{toString: {id: 'toString'; value: 1}}>();

// An empty string is a key like any other
expectTypeOf<ArrayToRecord<[{id: ''; value: 1}], 'id'>>().toBe<{'': {id: ''; value: 1}}>();

// A template literal key value gives a template literal index signature
expectTypeOf<ArrayToRecord<[{id: `user-${number}`; name: string}], 'id'>>().toBe<{[x: `user-${number}`]: {id: `user-${number}`; name: string}}>();
expectTypeOf<ArrayToRecord<[{id: 'user-1'; value: string}, {id: `user-${number}`; value: number}], 'id'>['user-1']['value']>().toBe<string | number>();

// Keys of the record are the key property's values, and the values are the elements
declare const animalsByName: ArrayToRecord<typeof animals, 'name'>;
expectTypeOf(animalsByName.Shadow.species).toBe<'dog'>();
expectTypeOf(animalsByName['Jake the Dog'].isMagical).toBe<true>();
expectTypeOf(animalsByName.Sassy).toBe<{readonly name: 'Sassy'; readonly species: 'cat'}>();
expectTypeOf<keyof ArrayToRecord<typeof animals, 'name'>>().toBe<'Shadow' | 'Chance' | 'Sassy' | 'Jake the Dog'>();

// A key that the record does not have cannot be read
// @ts-expect-error `Nope` is not a key of the record
type MissingKey = ArrayToRecord<typeof animals, 'name'>['Nope'];

// Reading a string index signature gives `undefined` for a missing key
declare const anyAnimalByName: ArrayToRecord<Array<{name: string; species: string}>, 'name'>;
expectTypeOf(anyAnimalByName['Shadow']).toBe<{name: string; species: string} | undefined>();

// A key keeps the element it belongs to, while `Record` gives every key the whole union
type AnimalsRecord = Record<'Shadow' | 'Chance' | 'Sassy' | 'Jake the Dog', (typeof animals)[number]>;
// @ts-expect-error `isMagical` is not on every element of the union
type MissingOnSomeElements = AnimalsRecord['Shadow']['isMagical'];

// The precise record is assignable to the loose `Record`, but not the other way around
expectTypeOf<ArrayToRecord<typeof animals, 'name'>>().toBeAssignableTo<Record<'Shadow' | 'Chance' | 'Sassy' | 'Jake the Dog', (typeof animals)[number]>>();
expectTypeOf<AnimalsRecord>().not.toBeAssignableTo<ArrayToRecord<typeof animals, 'name'>>();

// Every key is required, because a record of literal keys has no index signature
declare function renderRoutes(routes: ArrayToRecord<[{path: '/'; title: string}, {path: '/about'; title: string}], 'path'>): string;

renderRoutes({
	'/': {path: '/', title: 'Home'},
	'/about': {path: '/about', title: 'About'},
});

// @ts-expect-error The `/about` route is missing
renderRoutes({'/': {path: '/', title: 'Home'}});

// @ts-expect-error `title` must be a string
renderRoutes({'/': {path: '/', title: 1}, '/about': {path: '/about', title: 'About'}});

// Generic inference with a `const` type parameter
declare function keyBy<const Items extends readonly object[], const Key extends keyof Items[number]>(
	items: Items,
	key: Key,
): ArrayToRecord<Items, Key>;

expectTypeOf(keyBy([{id: 'a', value: 1}], 'id')).toBe<{a: {readonly id: 'a'; readonly value: 1}}>();
expectTypeOf(keyBy(animals, 'name')).toBe<ArrayToRecord<typeof animals, 'name'>>();

// A wide array still gives an index signature through the generic wrapper
declare const wideAnimals: Array<{id: string; value: number}>;
expectTypeOf(keyBy(wideAnimals, 'id')).toBe<{[x: string]: {id: string; value: number}}>();

// Without a `const` type parameter, the key values widen and the wrapper gives an index signature
declare function looseKeyBy<Items extends readonly object[], Key extends keyof Items[number]>(
	items: Items,
	key: Key,
): ArrayToRecord<Items, Key>;

expectTypeOf(looseKeyBy([{id: 'a', value: 1}], 'id')).toBe<{[x: string]: {id: string; value: number}}>();

// @ts-expect-error No element has a `name` property
keyBy([{id: 'a'}], 'name');

// A concrete key works against an array type parameter, so a typed lookup helper is possible
type ById<Items extends ReadonlyArray<{id: string}>> = ArrayToRecord<Items, 'id'>;
expectTypeOf<ById<readonly [{id: 'a'; name: 'Shadow'}, {id: 'b'; name: 'Chance'}]>>().toBe<{
	a: {id: 'a'; name: 'Shadow'};
	b: {id: 'b'; name: 'Chance'};
}>();
expectTypeOf<ById<ReadonlyArray<{id: string; name: string}>>>().toBe<{[x: string]: {id: string; name: string}}>();

// A key value branded as a wide `string` gives an index signature
type UserId = Opaque<string, 'UserId'>;
expectTypeOf<ArrayToRecord<Array<{id: UserId; name: string}>, 'id'>>().toBe<{[x: string]: {id: UserId; name: string}}>();

declare const usersById: ArrayToRecord<Array<{id: UserId; name: string}>, 'id'>;
declare const userId: UserId;
expectTypeOf(usersById[userId]).toBe<{id: UserId; name: string} | undefined>();

// A brand on a literal is unwrapped
expectTypeOf<ArrayToRecord<[{id: Tagged<'a', 'UserId'>; name: string}], 'id'>>().toBe<{a: {id: Tagged<'a', 'UserId'>; name: string}}>();
expectTypeOf<ArrayToRecord<[{id: Opaque<'a', 'UserId'>; name: string}], 'id'>>().toBe<{a: {id: Opaque<'a', 'UserId'>; name: string}}>();
expectTypeOf<ArrayToRecord<[{id: Opaque<1, 'UserId'>; name: string}], 'id'>>().toBe<{1: {id: Opaque<1, 'UserId'>; name: string}}>();

// A numeric index signature is read with a number
declare const animalsById: ArrayToRecord<Array<{id: number; name: string}>, 'id'>;
declare const numericId: number;
expectTypeOf(animalsById[numericId]).toBe<{id: number; name: string} | undefined>();

// A class instance is kept as it is
class Animal {
	get kind(): 'dog' {
		return 'dog';
	}

	bark(): string {
		return 'woof';
	}
}

expectTypeOf<ArrayToRecord<[Animal, Animal], 'kind'>>().toBe<{dog: Animal}>();

// Elements that carry functions keep them
const commands = [
	{name: 'build', run: () => 1},
	{name: 'test', run: () => 'ok'},
] as const;

expectTypeOf<ArrayToRecord<typeof commands, 'name'>>().toBe<{
	build: {readonly name: 'build'; readonly run: () => number};
	test: {readonly name: 'test'; readonly run: () => string};
}>();

// Typing a lookup table built at runtime
const animalsByNameAtRuntime = Object.fromEntries(animals.map(animal => [animal.name, animal] as const)) as ArrayToRecord<typeof animals, 'name'>;
expectTypeOf(animalsByNameAtRuntime.Sassy.species).toBe<'cat'>();

// Edge cases
expectTypeOf<ArrayToRecord<any, 'id'>>().toBe<any>();
expectTypeOf<ArrayToRecord<never, 'id'>>().toBe<{}>();
expectTypeOf<ArrayToRecord<any[], 'id'>>().toBe<{[x: string]: any}>();
expectTypeOf<ArrayToRecord<never[], 'id'>>().toBe<{}>();
expectTypeOf<ArrayToRecord<[{id: never}], 'id'>>().toBe<{}>();
expectTypeOf<ArrayToRecord<[never], 'id'>>().toBe<{}>();

// @ts-expect-error `unknown` is not an array
type UnknownArray = ArrayToRecord<unknown, 'id'>;

// @ts-expect-error An `unknown` element is not an object
type UnknownElementArray = ArrayToRecord<unknown[], 'id'>;

// @ts-expect-error `string[]` is not an array of objects
type NonObjectArray = ArrayToRecord<string[], 'id'>;

// @ts-expect-error Optional elements are not objects
type OptionalElement = ArrayToRecord<[{id: 'a'; value: 1}?], 'id'>;

// @ts-expect-error An element that lacks the key
type MissingKeyOnOneElement = ArrayToRecord<[{id: 'a'; value: 1}, {value: 2}], 'id'>;

// @ts-expect-error A union member that lacks the key
type MissingKeyOnUnionMember = ArrayToRecord<Array<{id: 'a'} | {name: string}>, 'id'>;

// @ts-expect-error A key that no element has
type MisspelledKey = ArrayToRecord<[{id: 'a'; value: 1}], 'idd'>;

// @ts-expect-error A noncanonical numeric string does not select a numeric property
type NoncanonicalNumericKey = ArrayToRecord<[{0: 'a'}], '00'>;

// @ts-expect-error A number does not select a noncanonical numeric string property
type NoncanonicalStringKey = ArrayToRecord<[{'00': 'a'}], 0>;

// @ts-expect-error A plain string does not select an enum property
type PlainStringEnumKey = ArrayToRecord<[{[Direction.Up]: 'a'}], 'up'>;

// A key property that holds anything else gives `never`
expectTypeOf<ArrayToRecord<[{id: 'a'; tags: string[]}], 'tags'>>().toBe<never>();
expectTypeOf<ArrayToRecord<[{id: 'a'; meta: {readonly createdAt: number}}], 'meta'>>().toBe<never>();
expectTypeOf<ArrayToRecord<[{id: symbol}], 'id'>>().toBe<never>();
expectTypeOf<ArrayToRecord<[{id: 1n}], 'id'>>().toBe<never>();
expectTypeOf<ArrayToRecord<[{id: true}], 'id'>>().toBe<never>();
expectTypeOf<ArrayToRecord<[{id: null}], 'id'>>().toBe<never>();
expectTypeOf<ArrayToRecord<[{id: undefined}], 'id'>>().toBe<never>();
expectTypeOf<ArrayToRecord<[{id: 'a' | null}], 'id'>>().toBe<never>();
expectTypeOf<ArrayToRecord<[{id: 'a'; run(): void}], 'run'>>().toBe<never>();
expectTypeOf<ArrayToRecord<[{id: unknown}], 'id'>>().toBe<never>();
expectTypeOf<ArrayToRecord<[{id?: 'a'; value: 1}], 'id'>>().toBe<never>();
expectTypeOf<ArrayToRecord<Array<{id?: 'a'}>, 'id'>>().toBe<never>();
expectTypeOf<ArrayToRecord<[{id: 'a'; value: 1}, {id: string[]; value: 2}], 'id'>>().toBe<never>();
expectTypeOf<ArrayToRecord<[{id: any}, {id: boolean}], 'id'>>().toBe<never>();
expectTypeOf<ArrayToRecord<[{id: any}, {id: unknown}], 'id'>>().toBe<never>();

// Mixed numeric property spellings resolve on each element.
expectTypeOf<ArrayToRecord<[{0: 'a'}, {'0': 'b'}], 0>>().toBe<{a: {0: 'a'}; b: {'0': 'b'}}>();
expectTypeOf<ArrayToRecord<[{0: 'a'}, {'0': 'b'}], '0'>>().toBe<{a: {0: 'a'}; b: {'0': 'b'}}>();
expectTypeOf<ArrayToRecord<[{0: 'a'}, {'0': string}], 0>>().toBe<Record<string, {0: 'a'} | {'0': string}>>();

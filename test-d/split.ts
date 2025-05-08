import {expectType} from 'tsd';
import type {Split, StringRepeat} from '../index.d.ts';
import type {BuildTuple} from '../source/internal/index.d.ts';

declare function split<
	S extends string,
	Delimiter extends string,
>(string: S, separator: Delimiter): Split<S, Delimiter>;

const items = 'foo,bar,baz,waldo';

// General use.
expectType<['foo', 'bar', 'baz', 'waldo']>(split(items, ','));

// Missing replacement character in original string.
expectType<['foo,bar,baz,waldo']>(split(items, ' '));

// Empty string split (every character).
expectType<[
	'f', 'o', 'o', ',', 'b', 'a', 'r', ',',
	'b', 'a', 'z', ',', 'w', 'a', 'l', 'd', 'o',
]>(split(items, ''));

// Split single same character.
expectType<['', '']>(split(' ', ' '));

// Split empty string by empty string.
expectType<[]>(split('', ''));

// Split empty string by any string.
expectType<['']>(split('', ' '));

// Unions
expectType<['a', 'b', 'c'] | ['x', 'y', 'z']>({} as Split<'a,b,c' | 'x,y,z', ','>);
expectType<['a', 'b', 'c'] | ['a,', ',c']>({} as Split<'a,b,c', ',' | 'b'>);
expectType<['a', 'b', 'c'] | ['a,b,c'] | ['x', 'y', 'z'] | ['x:y:z']>({} as Split<'a,b,c' | 'x:y:z', ',' | ':'>);

// -- strictLiteralChecks: false --
// NOTE: The behaviour covered in the test below is not acurate because the `a.b.${string}` type might hold a value like `a.b.c.d`,
// which, when split by `.`, would result in `['a', 'b', 'c', 'd']`, which wouldn't conform to the output type of `['a', 'b', string]`.
expectType<['a', 'b', string]>({} as Split<`a.b.${string}`, '.', {strictLiteralChecks: false}>);

// -- strictLiteralChecks: true --
expectType<string[]>({} as Split<string, ''>);
expectType<string[]>({} as Split<Uppercase<string>, '-'>);
expectType<string[]>({} as Split<`on${string}`, 'n'>);
expectType<string[]>({} as Split<'a,b,c', string>);
expectType<string[]>({} as Split<'a,b,c', Lowercase<string>>);
expectType<string[]>({} as Split<'a,b,c', `,${string}`, {strictLiteralChecks: true}>);
expectType<string[]>({} as Split<`on${string}`, Lowercase<string>, {strictLiteralChecks: true}>);

expectType<['a', 'b', 'c'] | string[]>({} as Split<'a,b,c' | `bye, ${string}`, ',', {strictLiteralChecks: true}>);
expectType<['a', 'b', 'c'] | string[]>({} as Split<'a,b,c', ',' | `b${string}`, {strictLiteralChecks: true}>);
expectType<['a', 'b', 'c'] | string[]>({} as Split<'a,b,c' | `bye, ${string}`, ',' | `b${string}`, {strictLiteralChecks: true}>);

// Recursion depth at which a non-tail recursive implementation starts to fail.
type FiftyZeroes = StringRepeat<'0', 50>;
expectType<BuildTuple<50, '0'>>({} as Split<FiftyZeroes, ''>);

// Maximum allowed recursion depth for a tail recursive implementation.
type NineHundredNinetyNineZeroes = StringRepeat<'0', 999>;
expectType<BuildTuple<999, '0'>>({} as Split<NineHundredNinetyNineZeroes, ''>);

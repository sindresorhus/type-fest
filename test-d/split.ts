import {expectTypeOf} from 'nz';
import type {Split, StringRepeat, TupleOf} from '../index.d.ts';

declare function split<
	S extends string,
	Delimiter extends string,
>(string: S, separator: Delimiter): Split<S, Delimiter>;

const items = 'foo,bar,baz,waldo';

// General use.
expectTypeOf(split(items, ',')).toBe<['foo', 'bar', 'baz', 'waldo']>();

// Missing replacement character in original string.
expectTypeOf(split(items, ' ')).toBe<['foo,bar,baz,waldo']>();

// Empty string split (every character).
expectTypeOf(split(items, '')).toBe<[
	'f', 'o', 'o', ',', 'b', 'a', 'r', ',',
	'b', 'a', 'z', ',', 'w', 'a', 'l', 'd', 'o',
]>();

// Split single same character.
expectTypeOf(split(' ', ' ')).toBe<['', '']>();

// Split empty string by empty string.
expectTypeOf(split('', '')).toBe<[]>();

// Split empty string by any string.
expectTypeOf(split('', ' ')).toBe<['']>();

// Unions
expectTypeOf<Split<'a,b,c' | 'x,y,z', ','>>().toBe<['a', 'b', 'c'] | ['x', 'y', 'z']>();
expectTypeOf<Split<'a,b,c', ',' | 'b'>>().toBe<['a', 'b', 'c'] | ['a,', ',c']>();
expectTypeOf<Split<'a,b,c' | 'x:y:z', ',' | ':'>>().toBe<['a', 'b', 'c'] | ['a,b,c'] | ['x', 'y', 'z'] | ['x:y:z']>();

// -- strictLiteralChecks: false --
// NOTE: The behaviour covered in the test below is not acurate because the `a.b.${string}` type might hold a value like `a.b.c.d`,
// which, when split by `.`, would result in `['a', 'b', 'c', 'd']`, which wouldn't conform to the output type of `['a', 'b', string]`.
expectTypeOf<Split<`a.b.${string}`, '.', {strictLiteralChecks: false}>>().toBe<['a', 'b', string]>();

// Ensure the last dynamic "string" is not dropped when split by `''`.
// https://github.com/sindresorhus/type-fest/issues/1203
expectTypeOf<Split<`ab${string}`, '', {strictLiteralChecks: false}>>().toBe<['a', 'b', string]>();

// -- strictLiteralChecks: true --
expectTypeOf<Split<string, ''>>().toBe<string[]>();
expectTypeOf<Split<Uppercase<string>, '-'>>().toBe<string[]>();
expectTypeOf<Split<`on${string}`, 'n'>>().toBe<string[]>();
expectTypeOf<Split<'a,b,c', string>>().toBe<string[]>();
expectTypeOf<Split<'a,b,c', Lowercase<string>>>().toBe<string[]>();
expectTypeOf<Split<'a,b,c', `,${string}`, {strictLiteralChecks: true}>>().toBe<string[]>();
expectTypeOf<Split<`on${string}`, Lowercase<string>, {strictLiteralChecks: true}>>().toBe<string[]>();

expectTypeOf<Split<'a,b,c' | `bye, ${string}`, ',', {strictLiteralChecks: true}>>().toBe<['a', 'b', 'c'] | string[]>();
expectTypeOf<Split<'a,b,c', ',' | `b${string}`, {strictLiteralChecks: true}>>().toBe<['a', 'b', 'c'] | string[]>();
expectTypeOf<Split<'a,b,c' | `bye, ${string}`, ',' | `b${string}`, {strictLiteralChecks: true}>>().toBe<['a', 'b', 'c'] | string[]>();

// Recursion depth at which a non-tail recursive implementation starts to fail.
type FiftyZeroes = StringRepeat<'0', 50>;
expectTypeOf<Split<FiftyZeroes, ''>>().toBe<TupleOf<50, '0'>>();

// Maximum allowed recursion depth for a tail recursive implementation.
type NineHundredNinetyNineZeroes = StringRepeat<'0', 999>;
expectTypeOf<Split<NineHundredNinetyNineZeroes, ''>>().toBe<TupleOf<999, '0'>>();

// The non-strict option splits only the literal parts it can see, so a subject whose literal parts have no delimiter is one part, even when its non-literal parts could contain one. `Get` relies on this to read a non-literal path as a single key.
expectTypeOf<Split<string, ',', {strictLiteralChecks: false}>>().toBe<[string]>();
declare const numberPatternSplit: [`v${number}`];
expectTypeOf<Split<`v${number}`, '.', {strictLiteralChecks: false}>>().toBe<typeof numberPatternSplit>();

import {expectType} from 'tsd';
import type {Split} from '../index';
import type {BuildTuple} from '../source/internal';

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

// String union split.
expectType<
	| ['A', 'B.CD.E', 'FG.HI', 'J.K', 'L']
	| ['A,B', 'CD', 'E,FG', 'HI,J', 'K,L']
	| ['L', 'K.J', 'IH.GF', 'E.DC.B', 'A']
	| ['L,K', 'J,IH', 'GF,E', 'DC', 'B,A']
>(
	split(
		'A,B.CD.E,FG.HI,J.K,L' as 'A,B.CD.E,FG.HI,J.K,L' | 'L,K.J,IH.GF,E.DC.B,A',
		',' as ',' | '.'
	)
);

// Split non-literal string by literal string.
expectType<string[]>(split(null! as string, "foobar"))

// Split non-literal string by non-literal string.
expectType<string[]>(split(null! as string, null! as string))

// Split literal string by non-literal string.
expectType<
	| ['ABCDEF']
	| ['', '']
	| ['', 'F'] | ['A', '']
	| ['', 'EF'] | ['A', 'F'] | ['AB', '']
	| ['', 'DEF'] | ['A', 'EF'] | ['AB', 'F'] | ['ABC', '']
	| ['', 'CDEF'] | ['A', 'DEF'] | ['AB', 'EF'] | ['ABC', 'F'] | ['ABCD', '']
	| ['', 'BCDEF'] | ['A', 'CDEF'] | ['AB', 'DEF'] | ['ABC', 'EF'] | ['ABCD', 'F'] | ['ABCDE', '']
	| ['A', 'B', 'C', 'D', 'E', 'F']
>(split("ABCDEF", null! as string))

// Recursion depth at which a non-tail recursive implementation starts to fail.
const fiftyZeroes = '00000000000000000000000000000000000000000000000000';
expectType<BuildTuple<50, '0'>>(split(fiftyZeroes, ''));

// Maximum allowed recursion depth for a tail recursive implementation.
const nineHundredNinetyNineZeroes = '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
expectType<BuildTuple<999, '0'>>(split(nineHundredNinetyNineZeroes, ''));

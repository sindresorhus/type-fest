import {expectTypeOf} from 'expect-type';
import type {Split} from '../index';

declare function split<
	S extends string,
	Delimiter extends string,
>(string: S, separator: Delimiter): Split<S, Delimiter>;

const items = 'foo,bar,baz,waldo';

// General use.
expectTypeOf(split(items, ',')).toEqualTypeOf<['foo', 'bar', 'baz', 'waldo']>();

// Missing replacement character in original string.
expectTypeOf(split(items, ' ')).toEqualTypeOf<['foo,bar,baz,waldo']>();

// Empty string split (every character).
expectTypeOf(split(items, '')).toEqualTypeOf<[
	'f', 'o', 'o', ',', 'b', 'a', 'r', ',',
	'b', 'a', 'z', ',', 'w', 'a', 'l', 'd', 'o',
]>();

// Split single same character.
expectTypeOf(split(' ', ' ')).toEqualTypeOf<['', '']>();

// Split empty string by empty string.
expectTypeOf(split('', '')).toEqualTypeOf<[]>();

// Split empty string by any string.
expectTypeOf(split('', ' ')).toEqualTypeOf<['']>();

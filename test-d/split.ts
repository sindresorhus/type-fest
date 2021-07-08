import {expectType} from 'tsd';
import {Split} from '../ts41';

declare function split<
	S extends string,
	Delimiter extends string
>(string: S, separator: Delimiter): Split<S, Delimiter>;

const items = 'foo,bar,baz,waldo';

// General use
expectType<['foo', 'bar', 'baz', 'waldo']>(split(items, ','));

// Non-present character
expectType<['foo,bar,baz,waldo']>(split(items, ' '));

// Empty string split (every char)
expectType<[
	'f', 'o', 'o', ',', 'b', 'a', 'r', ',',
	'b', 'a', 'z', ',', 'w', 'a', 'l', 'd', 'o'
]>(split(items, ''));

// Split single-same-character
expectType<['', '']>(split(' ', ' '));

// Split empty string by empty string
expectType<[]>(split('', ''));

// Split empty string by any string
expectType<['']>(split('', ' '));

import {expectType} from 'tsd';
import type {Substrings} from '../../source/internal';

expectType<Substrings<'ABCDEF'>>([
	'ABCDEF',
	'ABCDE', 'BCDEF',
	'ABCD', 'BCDE', 'CDEF',
	'ABC', 'BCD', 'CDE', 'DEF',
	'AB', 'BC', 'CD', 'DE', 'EF',
	'A', 'B', 'C', 'D', 'E', 'F',
	'',
])
expectType<Substrings<''>>([''])
expectType<Substrings<string>>(null! as string[])
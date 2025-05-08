import {expectType} from 'tsd';
import type {Replace, StringRepeat} from '../index.d.ts';

declare function replace<
	Input extends string,
	Search extends string,
	Replacement extends string,
>(
	input: Input,
	search: Search,
	replacement: Replacement
): Replace<Input, Search, Replacement>;

declare function replaceAll<
	Input extends string,
	Search extends string,
	Replacement extends string,
>(
	input: Input,
	search: Search,
	replacement: Replacement
): Replace<Input, Search, Replacement, {all: true}>;

expectType<'hello 🦄'>(replace('hello ?', '?', '🦄'));
expectType<'hello ❓?'>(replace('hello ??', '?', '❓'));
expectType<'10-42-00'>(replaceAll('10:42:00', ':', '-'));
expectType<'userName'>(replaceAll('__userName__', '__', ''));
expectType<'MyCoolTitle'>(replaceAll('My Cool Title', ' ', ''));
expectType<'fobarfobar'>(replaceAll('foobarfoobar', 'ob', 'b'));

// Unions
expectType<'bcabc' | 'cbcba'>({} as Replace<'abcabc' | 'cbacba', 'a', ''>);
expectType<'bcabc' | 'acabc'>({} as Replace<'abcabc', 'a' | 'b', ''>);
expectType<'bcabc' | 'Abcabc'>({} as Replace<'abcabc', 'a', '' | 'A'>);

expectType<'bcabc' | 'acabc' | 'cbcba' | 'cacba'>({} as Replace<'abcabc' | 'cbacba', 'a' | 'b', ''>);
expectType<'bcabc' | 'Abcabc' | 'cbcba' | 'cbAcba'>({} as Replace<'abcabc' | 'cbacba', 'a', '' | 'A'>);
expectType<'bcabc' | 'Abcabc' | 'acabc' | 'aAcabc'>({} as Replace<'abcabc', 'a' | 'b', '' | 'A'>);

expectType<'bcabc' | 'Abcabc' | 'acabc' | 'aAcabc' | 'cbcba' | 'cbAcba' | 'cacba' | 'cAacba'>(
	{} as Replace<'abcabc' | 'cbacba', 'a' | 'b', '' | 'A'>,
);

expectType<'bcbc' | 'cbcb'>({} as Replace<'abcabc' | 'cbacba', 'a', '', {all: true}>);
expectType<'bcbc' | 'acac'>({} as Replace<'abcabc', 'a' | 'b', '', {all: true}>);
expectType<'bcbc' | 'AbcAbc'>({} as Replace<'abcabc', 'a', '' | 'A', {all: true}>);

expectType<'bcbc' | 'acac' | 'cbcb' | 'caca'>({} as Replace<'abcabc' | 'cbacba', 'a' | 'b', '', {all: true}>);
expectType<'bcbc' | 'AbcAbc' | 'cbcb' | 'cbAcbA'>({} as Replace<'abcabc' | 'cbacba', 'a', '' | 'A', {all: true}>);
expectType<'bcbc' | 'AbcAbc' | 'acac' | 'aAcaAc'>({} as Replace<'abcabc', 'a' | 'b', '' | 'A', {all: true}>);

expectType<'bcbc' | 'AbcAbc' | 'acac' | 'aAcaAc' | 'cbcb' | 'cbAcbA' | 'caca' | 'cAacAa'>(
	{} as Replace<'abcabc' | 'cbacba', 'a' | 'b', '' | 'A', {all: true}>,
);

// Recursion depth at which a non-tail recursive implementation starts to fail.
type FiftyZeroes = StringRepeat<'0', 50>;
type FiftyOnes = StringRepeat<'1', 50>;
expectType<FiftyOnes>({} as Replace<FiftyZeroes, '0', '1', {all: true}>);

// Maximum allowed recursion depth for a tail recursive implementation.
type NineHundredNinetyNineZeroes = StringRepeat<'0', 999>;
type NineHundredNinetyNineOnes = StringRepeat<'1', 999>;
expectType<NineHundredNinetyNineOnes>({} as Replace<NineHundredNinetyNineZeroes, '0', '1', {all: true}>);

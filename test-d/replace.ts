import {expectType} from 'tsd';
import type {Replace, StringRepeat} from '../index';

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

// Recursion depth at which a non-tail recursive implementation starts to fail.
type FiftyZeroes = StringRepeat<'0', 50>;
type FiftyOnes = StringRepeat<'1', 50>;
expectType<FiftyOnes>({} as Replace<FiftyZeroes, '0', '1', {all: true}>);

// Maximum allowed recursion depth for a tail recursive implementation.
type NineHundredNinetyNineZeroes = StringRepeat<'0', 999>;
type NineHundredNinetyNineOnes = StringRepeat<'1', 999>;
expectType<NineHundredNinetyNineOnes>({} as Replace<NineHundredNinetyNineZeroes, '0', '1', {all: true}>);

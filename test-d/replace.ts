import {expectType} from 'tsd';
import type {Replace} from '../index';

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

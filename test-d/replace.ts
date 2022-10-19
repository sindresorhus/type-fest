import {expectTypeOf} from 'expect-type';
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

expectTypeOf(replace('hello ?', '?', '🦄')).toEqualTypeOf<'hello 🦄'>();
expectTypeOf(replace('hello ??', '?', '❓')).toEqualTypeOf<'hello ❓?'>();
expectTypeOf(replaceAll('10:42:00', ':', '-')).toEqualTypeOf<'10-42-00'>();
expectTypeOf(replaceAll('__userName__', '__', '')).toEqualTypeOf<'userName'>();
expectTypeOf(replaceAll('My Cool Title', ' ', '')).toEqualTypeOf<'MyCoolTitle'>();
expectTypeOf(replaceAll('foobarfoobar', 'ob', 'b')).toEqualTypeOf<'fobarfobar'>();

import {expectType} from 'tsd';
import type {StringRepeat} from '../index.d.ts';

declare const unknown: unknown;

expectType<StringRepeat<'', 0>>('');
expectType<StringRepeat<'', -1>>(unknown as never);
expectType<StringRepeat<string, 0>>('');
expectType<StringRepeat<string, -1>>(unknown as never);
expectType<StringRepeat<'', number>>('');
expectType<StringRepeat<string, number>>(unknown as string);
expectType<StringRepeat<'0', number>>(unknown as string);
expectType<StringRepeat<'0', -1>>(unknown as never);
expectType<StringRepeat<'0', 0>>('');
expectType<StringRepeat<'0', 1>>('0');
expectType<StringRepeat<'0', 5>>('00000');
expectType<StringRepeat<'012345-', 0>>('');
expectType<StringRepeat<'012345-', 1>>('012345-');
expectType<StringRepeat<'012345-', 5>>('012345-012345-012345-012345-012345-');

// Non literal strings
expectType<StringRepeat<string, 2>>(unknown as string);
expectType<StringRepeat<`abc${string}`, 2>>(unknown as `abc${string}abc${string}`);
expectType<StringRepeat<Uppercase<string>, 2>>(unknown as `${Uppercase<string>}${Uppercase<string>}`);

// Union cases
expectType<StringRepeat<'0' | '1', 5>>(unknown as '00000' | '11111');
expectType<StringRepeat<'0', 4 | 5>>(unknown as '0000' | '00000');
expectType<StringRepeat<'0' | '1', 4 | 5>>(unknown as '0000' | '00000' | '1111' | '11111');

// Recursion depth at which a non-tail recursive implementation starts to fail.
const fiftyZeroes = '00000000000000000000000000000000000000000000000000';
expectType<StringRepeat<'0', 50>>(fiftyZeroes);

// Maximum allowed recursion depth for a tail recursive implementation.
const nineHundredNinetyNineZeroes = '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
expectType<StringRepeat<'0', 999>>(nineHundredNinetyNineZeroes);

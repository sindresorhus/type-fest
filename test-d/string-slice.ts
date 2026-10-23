import {expectTypeOf} from 'nz';
import type {StringRepeat, StringSlice, Tagged} from '../index.d.ts';

expectTypeOf<StringSlice<'abcde'>>().toBe<'abcde'>();
expectTypeOf<StringSlice<'abcde'>>().toBe<'abcde'>();
expectTypeOf<StringSlice<'abcde', 0, -1>>().toBe<'abcd'>();
expectTypeOf<StringSlice<'abcde', 1, -1>>().toBe<'bcd'>();
expectTypeOf<StringSlice<'abcde', 1, 2>>().toBe<'b'>();
expectTypeOf<StringSlice<'abcde', 1, 3>>().toBe<'bc'>();
expectTypeOf<StringSlice<'abcde', -100, -1>>().toBe<'abcd'>();
expectTypeOf<StringSlice<'abcde', -100, -3>>().toBe<'ab'>();
expectTypeOf<StringSlice<'abcde', 3, 100>>().toBe<'de'>();
expectTypeOf<StringSlice<'abcde', 1, 1>>().toBe<''>();
expectTypeOf<StringSlice<'abcde', 100, 1>>().toBe<''>();
expectTypeOf<string>().toBe<StringSlice<string>>();
expectTypeOf<string>().toBe<StringSlice<string, 1>>();
expectTypeOf<string>().toBe<StringSlice<string, 1, 2>>();

// Unions
// String is union
expectTypeOf<'012' | 'abcd'>().toBe<StringSlice<'012' | 'abcd', 0>>(); // Positive start, no end
expectTypeOf<'12' | 'cd'>().toBe<StringSlice<'012' | 'abcd', -2>>(); // Negative start, no end
expectTypeOf<'01' | 'ab'>().toBe<StringSlice<'012' | 'abcd', 0, 2>>(); // Positive start, positive end
expectTypeOf<'1' | 'c'>().toBe<StringSlice<'012' | 'abcd', -2, -1>>(); // Negative start, negative end
expectTypeOf<'01' | 'b'>().toBe<StringSlice<'012' | 'abcd', -3, 2>>(); // Negative start, positive end
expectTypeOf<'1' | 'bc'>().toBe<StringSlice<'012' | 'abcd', 1, -1>>(); // Positive start, negative end

// Start is union
expectTypeOf<'123' | '23'>().toBe<StringSlice<'0123', 1 | -2>>(); // Positive/Negative start, no end
expectTypeOf<'2' | '12'>().toBe<StringSlice<'0123', 2 | -3, 3>>(); // Positive/Negative start, positive end
expectTypeOf<'2' | '012'>().toBe<StringSlice<'0123', 0 | -2, -1>>(); // Positive/Negative start, negative end

// End is union
expectTypeOf<'0' | '01'>().toBe<StringSlice<'0123', 0, 1 | -2>>(); // Positive start, positive/negative end
expectTypeOf<'' | '2'>().toBe<StringSlice<'0123', -2, 2 | -1>>(); // Negative start, positive/negative end

// Array and start are unions
expectTypeOf<'12' | '2' | 'bcd' | 'd'>().toBe<StringSlice<'012' | 'abcd', 1 | -1>>(); // Positive/Negative start, no end
expectTypeOf<'1' | 'b' | ''>().toBe<StringSlice<'012' | 'abcd', 1 | -2, 2>>(); // Positive/Negative start, positive end
expectTypeOf<'01' | '1' | 'abc' | 'c'>().toBe<StringSlice<'012' | 'abcd', 0 | -2, -1>>(); // Positive/Negative start, negative end

// Array and end are unions
expectTypeOf<'2' | '' | 'c'>().toBe<StringSlice<'012' | 'abcd', 2, 3 | -1>>(); // Positive start, positive/negative end
expectTypeOf<'012' | '0' | 'bc' | 'b'>().toBe<StringSlice<'012' | 'abcd', -3, 3 | -2>>(); // Negative start, positive/negative end

// Start and end are unions
// Positive/Negative start, positive/negative end
expectTypeOf<'01' | '012' | '' | '1' | '12'>().toBe<StringSlice<'0123', -5 | 0 | 1, -2 | 0 | 3>>();

// Array, start and end are unions
// Positive/Negative start, positive/negative end
expectTypeOf<'1' | '12' | '01' | '012' | 'abcd' | 'abc' | 'bc' | 'bcd'>().toBe<StringSlice<'012' | 'abcd', 1 | -4, 4 | -1>>();

// A long string does not hit the recursion limit.
expectTypeOf<StringSlice<StringRepeat<'a', 200>, 1>>().toBe<StringRepeat<'a', 199>>();

// These ranges are empty for every possible string, even when its text is unknown.
expectTypeOf<StringSlice<string, 0, 0>>().toBe<''>();
expectTypeOf<StringSlice<string, 2, 1>>().toBe<''>();
expectTypeOf<StringSlice<string, never, 0>>().toBe<''>();

expectTypeOf<StringSlice<string, 3, 3>>().toBe<''>();
expectTypeOf<StringSlice<string, 100, 1>>().toBe<''>();
expectTypeOf<StringSlice<string, 0 | 1 | 2, 0>>().toBe<''>();
expectTypeOf<StringSlice<string, 2, 0 | 1 | 2>>().toBe<''>();
expectTypeOf<StringSlice<string, 1, 2>>().toBe<string>();
expectTypeOf<StringSlice<string, -2, -1>>().toBe<string>();
expectTypeOf<StringSlice<string, 1, number>>().toBe<string>();
expectTypeOf<StringSlice<Tagged<string, 'Text'>, 2, 1>>().toBe<''>();
expectTypeOf<StringSlice<`prefix${string}`, 2, 1>>().toBe<''>();
expectTypeOf<StringSlice<'abc' | `prefix${string}`, 1, 1>>().toBe<''>();
expectTypeOf<StringSlice<string, any, any>>().toBe<string>();
expectTypeOf<StringSlice<any>>().toBe<string>();
expectTypeOf<StringSlice<any, 0, 0>>().toBe<string>();
expectTypeOf<StringSlice<never, 0, 0>>().toBe<never>();
// @ts-expect-error
expectTypeOf<StringSlice<unknown, 0, 0>>();

// A small slice can cross a marker inside a long literal.
type LongCharacterText = `${StringRepeat<'a', 600>}X${StringRepeat<'b', 600>}`;
expectTypeOf<StringSlice<LongCharacterText, 599, 602>>().toBe<'aXb'>();

expectTypeOf<StringSlice<LongCharacterText, -601, -600>>().toBe<'X'>();
expectTypeOf<StringSlice<LongCharacterText | 'short', 599, 602>>().toBe<'aXb' | ''>();

declare function sliceText<Text extends string, Start extends number, End extends number>(text: Text, start: Start, end: End): StringSlice<Text, Start, End>;
declare const longSliceInput: LongCharacterText;
const inferredLongSlice = sliceText(longSliceInput, 599, 602);
expectTypeOf(inferredLongSlice).toBe<'aXb'>();
expectTypeOf(inferredLongSlice).not.toBeAssignableTo<'aaa'>();

import {expectTypeOf} from 'nz';
import type {StringSlice} from '../index.d.ts';

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

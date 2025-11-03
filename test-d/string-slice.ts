import {expectType} from 'tsd';
import type {StringSlice} from '../index.d.ts';

expectType<StringSlice<'abcde'>>('abcde');
expectType<StringSlice<'abcde'>>('abcde');
expectType<StringSlice<'abcde', 0, -1>>('abcd');
expectType<StringSlice<'abcde', 1, -1>>('bcd');
expectType<StringSlice<'abcde', 1, 2>>('b');
expectType<StringSlice<'abcde', 1, 3>>('bc');
expectType<StringSlice<'abcde', -100, -1>>('abcd');
expectType<StringSlice<'abcde', -100, -3>>('ab');
expectType<StringSlice<'abcde', 3, 100>>('de');
expectType<StringSlice<'abcde', 1, 1>>('');
expectType<StringSlice<'abcde', 100, 1>>('');
expectType<StringSlice<string>>(null! as string);
expectType<StringSlice<string, 1>>(null! as string);
expectType<StringSlice<string, 1, 2>>(null! as string);

// Unions
// String is union
expectType<StringSlice<'012' | 'abcd', 0>>({} as '012' | 'abcd'); // Positive start, no end
expectType<StringSlice<'012' | 'abcd', -2>>({} as '12' | 'cd'); // Negative start, no end
expectType<StringSlice<'012' | 'abcd', 0, 2>>({} as '01' | 'ab'); // Positive start, positive end
expectType<StringSlice<'012' | 'abcd', -2, -1>>({} as '1' | 'c'); // Negative start, negative end
expectType<StringSlice<'012' | 'abcd', -3, 2>>({} as '01' | 'b'); // Negative start, positive end
expectType<StringSlice<'012' | 'abcd', 1, -1>>({} as '1' | 'bc'); // Positive start, negative end

// Start is union
expectType<StringSlice<'0123', 1 | -2>>({} as '123' | '23'); // Positive/Negative start, no end
expectType<StringSlice<'0123', 2 | -3, 3>>({} as '2' | '12'); // Positive/Negative start, positive end
expectType<StringSlice<'0123', 0 | -2, -1>>({} as '2' | '012'); // Positive/Negative start, negative end

// End is union
expectType<StringSlice<'0123', 0, 1 | -2>>({} as '0' | '01'); // Positive start, positive/negative end
expectType<StringSlice<'0123', -2, 2 | -1>>({} as '' | '2'); // Negative start, positive/negative end

// Array and start are unions
expectType<StringSlice<'012' | 'abcd', 1 | -1>>({} as '12' | '2' | 'bcd' | 'd'); // Positive/Negative start, no end
expectType<StringSlice<'012' | 'abcd', 1 | -2, 2>>({} as '1' | 'b' | ''); // Positive/Negative start, positive end
expectType<StringSlice<'012' | 'abcd', 0 | -2, -1>>({} as '01' | '1' | 'abc' | 'c'); // Positive/Negative start, negative end

// Array and end are unions
expectType<StringSlice<'012' | 'abcd', 2, 3 | -1>>({} as '2' | '' | 'c'); // Positive start, positive/negative end
expectType<StringSlice<'012' | 'abcd', -3, 3 | -2>>({} as '012' | '0' | 'bc' | 'b'); // Negative start, positive/negative end

// Start and end are unions
expectType<StringSlice<'0123', -5 | 0 | 1, -2 | 0 | 3>>( // Positive/Negative start, positive/negative end
	{} as '01' | '012' | '' | '1' | '12',
);

// Array, start and end are unions
expectType<StringSlice<'012' | 'abcd', 1 | -4, 4 | -1>>( // Positive/Negative start, positive/negative end
	{} as '1' | '12' | '01' | '012' | 'abcd' | 'abc' | 'bc' | 'bcd',
);

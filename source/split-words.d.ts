import type {WordSeparators} from './internal';

type IsLowerCase<T extends string> = T extends Lowercase<T> ? true : false;
type IsUpperCase<T extends string> = T extends Uppercase<T> ? true : false;
type IsNumeric<T extends string> = T extends `${number}` ? true : false;

type SkipEmptyWord<Word extends string> = Word extends '' ? [] : [Word];

type RemoveLastChar<Sentence extends string, Char extends string> = Sentence extends `${infer LeftSide}${Char}`
	? SkipEmptyWord<LeftSide>
	: never;

/**
Split a string (almost) like Lodash's `_.words()` function.

- Split on each word that begins with a capital letter.
- Split on each {@link WordSeparators}.
- Split on numeric sequence.

@example
```
type Words0 = SplitWords<'helloWorld'>; // ['hello', 'World']
type Words1 = SplitWords<'helloWORLD'>; // ['hello', 'WORLD']
type Words2 = SplitWords<'hello-world'>; // ['hello', 'world']
type Words3 = SplitWords<'--hello the_world'>; // ['hello', 'the', 'world']
type Words4 = SplitWords<'lifeIs42'>; // ['life', 'Is', '42']
```

@internal
@category Change case
@category Template literal
*/
export type SplitWords<
	Sentence extends string,
	LastChar extends string = '',
	CurrentWord extends string = '',
> = Sentence extends `${infer FirstChar}${infer RemainingChars}`
	? FirstChar extends WordSeparators
		// Skip word separator
		? [...SkipEmptyWord<CurrentWord>, ...SplitWords<RemainingChars, LastChar>]
		: LastChar extends ''
			// Fist char of word
			? SplitWords<RemainingChars, FirstChar, FirstChar>
			// Case change: non-numeric to numeric, push word
			: [false, true] extends [IsNumeric<LastChar>, IsNumeric<FirstChar>]
				? [...SkipEmptyWord<CurrentWord>, ...SplitWords<RemainingChars, FirstChar, FirstChar>]
				// Case change: numeric to non-numeric, push word
				: [true, false] extends [IsNumeric<LastChar>, IsNumeric<FirstChar>]
					? [...SkipEmptyWord<CurrentWord>, ...SplitWords<RemainingChars, FirstChar, FirstChar>]
					// No case change: concat word
					: [true, true] extends [IsNumeric<LastChar>, IsNumeric<FirstChar>]
						? SplitWords<RemainingChars, FirstChar, `${CurrentWord}${FirstChar}`>
					// Case change: lower to upper, push word
						: [true, true] extends [IsLowerCase<LastChar>, IsUpperCase<FirstChar>]
							? [...SkipEmptyWord<CurrentWord>, ...SplitWords<RemainingChars, FirstChar, FirstChar>]
						// Case change: upper to lower, brings back the last character, push word
							: [true, true] extends [IsUpperCase<LastChar>, IsLowerCase<FirstChar>]
								? [...RemoveLastChar<CurrentWord, LastChar>, ...SplitWords<RemainingChars, FirstChar, `${LastChar}${FirstChar}`>]
							// No case change: concat word
								: SplitWords<RemainingChars, FirstChar, `${CurrentWord}${FirstChar}`>
	: [...SkipEmptyWord<CurrentWord>];

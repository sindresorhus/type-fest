import type {
	ApplyDefaultOptions,
	AsciiPunctuation,
	IsNumeric,
	WordSeparators,
} from './internal/index.d.ts';
import type {IsLowercase} from './is-lowercase.d.ts';
import type {UnwrapBrand} from './internal/object.d.ts';
import type {IsStringLiteral} from './is-string-literal.d.ts';
import type {IsUppercase} from './is-uppercase.d.ts';

type SkipEmptyWord<Word extends string> = Word extends '' ? [] : [Word];

type RemoveLastCharacter<
	Sentence extends string,
	Character extends string,
> = Sentence extends `${infer LeftSide}${Character}`
	? SkipEmptyWord<LeftSide>
	: never;

/**
Options for the `Words` type.

@see {@link Words}
*/
export type WordsOptions = {
	/**
	Split on numeric sequence.

	@default true

	@example
	```
	import type {Words} from 'type-fest';

	type Example1 = Words<'p2pNetwork', {splitOnNumbers: true}>;
	//=> ['p', '2', 'p', 'Network']

	type Example2 = Words<'p2pNetwork', {splitOnNumbers: false}>;
	//=> ['p2p', 'Network']
	```
	*/
	splitOnNumbers?: boolean;
	/**
	Split on {@link AsciiPunctuation | punctuation characters} (e.g., `#`, `&`, `*`, `:`, `?`, `@`, `~`).

	@example
	```
	import type {Words} from 'type-fest';

	type Example1 = Words<'hello:world', {splitOnPunctuation: true}>;
	//=> ['hello', 'world']

	type Example2 = Words<'hello:world', {splitOnPunctuation: false}>;
	//=> ['hello:world']
	```
	*/
	splitOnPunctuation?: boolean;
};

export type _DefaultWordsOptions = {
	splitOnNumbers: true;
	splitOnPunctuation: false;
};

/**
Split a string similar to Lodash's `_.words()` function.

- Split on each word that begins with a capital letter.
- Split on each {@link WordSeparators}.
- Split on each {@link AsciiPunctuation} (if {@link WordsOptions.splitOnPunctuation} is enabled).
- Split on numeric sequence.

@example
```
import type {Words} from 'type-fest';

type Words0 = Words<'helloWorld'>;
//=> ['hello', 'World']

type Words1 = Words<'helloWORLD'>;
//=> ['hello', 'WORLD']

type Words2 = Words<'hello-world'>;
//=> ['hello', 'world']

type Words3 = Words<'--hello the_world'>;
//=> ['hello', 'the', 'world']

type Words4 = Words<'lifeIs42'>;
//=> ['life', 'Is', '42']

type Words5 = Words<'p2pNetwork', {splitOnNumbers: false}>;
//=> ['p2p', 'Network']

type Words6 = Words<'hello:world', {splitOnPunctuation: true}>;
//=> ['hello', 'world']

type Words7 = Words<'hello:world', {splitOnPunctuation: false}>;
//=> ['hello:world']

type Words8 = Words<'hello::world', {splitOnPunctuation: true}>;
//=> ['hello', 'world']
```

@category Change case
@category Template literal
*/
export type Words<Sentence extends string, Options extends WordsOptions = {}> = Sentence extends unknown // For distributing `Sentence`
	// A branded or tagged string can be a literal, so remove the brand once before classification and walking; an intersection with a non-empty object type does not match a template literal pattern.
	? (Sentence extends object ? UnwrapBrand<Sentence> : Sentence) extends infer Input extends string
		? IsStringLiteral<Input> extends true // A string type with an infinite set of possible values cannot be walked character by character, so only the element type survives.
			// Option objects are not distributed, so for a union of option objects, an option that differs between the members reads as `boolean` and acts as disabled.
			? _Words<Input, ApplyDefaultOptions<WordsOptions, _DefaultWordsOptions, Options>>
			: string[]
		: never
	: never; // Should never happen, since `Sentence` is a string

/**
Splits a known unbranded string literal using resolved options. Casing types reuse this entry point after checking and normalizing their own inputs.
*/
export type _Words<
	Sentence extends string,
	Options extends Required<WordsOptions>,
	LastCharacter extends string = '',
	CurrentWord extends string = '',
	// The words found so far are kept in `Result`, so the recursion is in tail position and a long sentence does not hit the recursion limit.
	Result extends string[] = [],
> = Sentence extends `${infer FirstCharacter}${infer RemainingCharacters}`
	? FirstCharacter extends WordSeparators | (Options['splitOnPunctuation'] extends true ? AsciiPunctuation : never)
		// Skip word separator
		? _Words<RemainingCharacters, Options, '', '', [...Result, ...SkipEmptyWord<CurrentWord>]>
		: LastCharacter extends ''
			// First character of word
			? _Words<RemainingCharacters, Options, FirstCharacter, FirstCharacter, Result>
			// Case change between numeric and non-numeric characters.
			: [IsNumeric<LastCharacter>, IsNumeric<FirstCharacter>] extends [false, true] | [true, false]
				? Options['splitOnNumbers'] extends true
					// Split on number: push word
					? _Words<RemainingCharacters, Options, FirstCharacter, FirstCharacter, [...Result, ...SkipEmptyWord<CurrentWord>]>
					// No split on number: concat word
					: _Words<RemainingCharacters, Options, FirstCharacter, `${CurrentWord}${FirstCharacter}`, Result>
				// No case change: concat word
				: [true, true] extends [IsNumeric<LastCharacter>, IsNumeric<FirstCharacter>]
					? _Words<RemainingCharacters, Options, FirstCharacter, `${CurrentWord}${FirstCharacter}`, Result>
				// Case change: lower to upper, push word
					: [true, true] extends [IsLowercase<LastCharacter>, IsUppercase<FirstCharacter>]
						// Only a capital letter starts a new word. A character with no case at all, such as a Han character or an emoji, satisfies both case predicates but is its own lowercase form, so it is not one.
						? IsCapitalLetter<FirstCharacter> extends true
							? _Words<RemainingCharacters, Options, FirstCharacter, FirstCharacter, [...Result, ...SkipEmptyWord<CurrentWord>]>
							: _Words<RemainingCharacters, Options, FirstCharacter, `${CurrentWord}${FirstCharacter}`, Result>
					// Case change: upper to lower, brings back the last character, push word
						: [true, true] extends [IsUppercase<LastCharacter>, IsLowercase<FirstCharacter>]
							// Only a capital followed by a lowercase letter starts a new word. Punctuation or a character with no case after an acronym, as in `userID?`, satisfies both case predicates, so it would otherwise split off the last capital.
							? [IsCapitalLetter<LastCharacter>, IsLowercaseLetter<FirstCharacter>] extends [true, true]
								? _Words<
									RemainingCharacters, Options, FirstCharacter, `${LastCharacter}${FirstCharacter}`,
									[...Result, ...RemoveLastCharacter<CurrentWord, LastCharacter>]
								>
								: _Words<RemainingCharacters, Options, FirstCharacter, `${CurrentWord}${FirstCharacter}`, Result>
						// No case change: concat word
							: _Words<RemainingCharacters, Options, FirstCharacter, `${CurrentWord}${FirstCharacter}`, Result>
	: [...Result, ...SkipEmptyWord<CurrentWord>];

/**
Whether the given character is a capital letter, which is what decides whether it begins a new word.

A character with no case at all, such as a Han character or an emoji, is its own lowercase form and so is not a capital. Every other cased character is, in any script, so this is deliberately not restricted to ASCII: `É` and `Ä` are capitals just as `A` is.
*/
type IsCapitalLetter<Character extends string> = Lowercase<Character> extends Character ? false : true;

/**
Whether the given character is a lowercase letter, which is what decides whether a preceding capital begins a new word.

Like {@link IsCapitalLetter}, a character with no case at all, such as punctuation, a Han character, or an emoji, is its own uppercase form and so is not a lowercase letter.
*/
type IsLowercaseLetter<Character extends string> = Uppercase<Character> extends Character ? false : true;

export {};

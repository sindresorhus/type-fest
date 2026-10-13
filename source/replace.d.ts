import type {ApplyDefaultOptions, Whitespace} from './internal/index.d.ts';
import type {IsStringLiteral} from './is-string-literal.d.ts';

export type ReplaceOptions = {
	all?: boolean;
};

type DefaultReplaceOptions = {
	all: false;
};

/**
Represents a string with some or all matches replaced by a replacement.

Known limitations:
- The replacement is inserted literally. `String.prototype.replace()` also expands `$$`, `$&`, `$\``, and `$'` in the replacement, so `Replace<'abc', 'b', '$&'>` is `'a$&c'` where the runtime gives `'abc'`. Write the pattern itself when you need it.
- A non-literal `Search`, like `${number}` or `Uppercase<string>`, uses TypeScript's prefix inference at each character. It is meant for replacing the same placeholder in a template literal type, like ``Replace<`item.${number}`, `${number}`, 'id'>``, which is `'item.id'`. In concrete numeric text, `${number}` and `${bigint}` match individual digits, leaving signs and decimal points in place, so ``Replace<'a-12b', `${number}`, 'N', {all: true}>`` is `'a-NNb'`. A lone whitespace character is never a match, even though TypeScript accepts it as a `${number}`. The input is walked one character at a time, so it is limited to about 1000 characters.

Use-case:
- `kebab-case-path` to `dotted.path.notation`
- Changing date/time format: `01-08-2042` → `01/08/2042`
- Manipulation of type properties, for example, removal of prefixes

@example
```
import type {Replace} from 'type-fest';

declare function replace<
	Input extends string,
	Search extends string,
	Replacement extends string,
>(
	input: Input,
	search: Search,
	replacement: Replacement,
): Replace<Input, Search, Replacement>;

declare function replaceAll<
	Input extends string,
	Search extends string,
	Replacement extends string,
>(
	input: Input,
	search: Search,
	replacement: Replacement,
): Replace<Input, Search, Replacement, {all: true}>;

// The return type is the exact string literal, not just `string`.

replace('hello ?', '?', '🦄');
//=> 'hello 🦄'

replace('hello ??', '?', '❓');
//=> 'hello ❓?'

replaceAll('10:42:00', ':', '-');
//=> '10-42-00'

replaceAll('__userName__', '__', '');
//=> 'userName'

replaceAll('My Cool Title', ' ', '');
//=> 'MyCoolTitle'
```

@category String
@category Template literal
*/
export type Replace<
	Input extends string,
	Search extends string,
	Replacement extends string,
	Options extends ReplaceOptions = {},
> = _Replace<Input, Search, Replacement, ApplyDefaultOptions<ReplaceOptions, DefaultReplaceOptions, Options>>;

type _Replace<
	Input extends string,
	Search extends string,
	Replacement extends string,
	Options extends Required<ReplaceOptions>,
	Accumulator extends string = '',
> = Search extends string // For distributing `Search`
	? Replacement extends string // For distributing `Replacement`
		? string extends Search
			? Input extends string
				? string
				: never
			: Search extends ''
				// An empty `Search` is a zero-width match, so it matches before every character and after the last one. The pattern below cannot express a zero-width match, because TypeScript anchors the head to the first character instead of the empty string.
				? Options['all'] extends true
					? Input extends string // For distributing `Input`
						? IsStringLiteral<Input> extends true
							? _ReplaceEmptySearch<Input, Replacement, `${Accumulator}${Replacement}`>
							: string
						: never
					: `${Accumulator}${Replacement}${Input}`
				: IsStringLiteral<Search> extends true
					? Input extends `${infer Head}${Search}${infer Tail}`
						? Options['all'] extends true
							? _Replace<Tail, Search, Replacement, Options, `${Accumulator}${Head}${Replacement}`>
							: `${Head}${Replacement}${Tail}`
						: `${Accumulator}${Input}`
					: _ReplaceNonLiteralSearch<Input, Search, Replacement, Options, Accumulator>
		: never
	: never;

/**
Replaces a non-literal `Search`, like `${number}` or `Uppercase<string>`, by checking whether `Input` starts with it at each character. The pattern in `_Replace` cannot do this, because TypeScript infers an empty head and then fails to match the rest. Literal searches skip this, because walking one character at a time limits the input length.

Boundary: This matcher targets template placeholders. Complete signed or fractional matches in concrete numeric text are intentionally unsupported, since numeric special cases or scanning every possible prefix would add disproportionate complexity.
*/
type _ReplaceNonLiteralSearch<
	Input extends string,
	Search extends string,
	Replacement extends string,
	Options extends Required<ReplaceOptions>,
	Accumulator extends string,
> =
	// TypeScript accepts whitespace as a number, because `+' '` is `0`, so a lone whitespace character would match `${number}` and replace the space in `Page ${number}`. Such a character is kept instead. A search that starts with whitespace, like ` ${number}`, does not match a lone whitespace character, so it is unaffected.
	Input extends `${infer WhitespaceCharacter extends Whitespace & Search}${infer Rest}`
		? _ReplaceNonLiteralSearch<Rest, Search, Replacement, Options, `${Accumulator}${WhitespaceCharacter}`>
		: Input extends `${Search}${infer Rest}`
			? Options['all'] extends true
				? _ReplaceNonLiteralSearch<Rest, Search, Replacement, Options, `${Accumulator}${Replacement}`>
				: `${Accumulator}${Replacement}${Rest}`
			: Input extends `${infer FirstCharacter}${infer Rest}`
				? _ReplaceNonLiteralSearch<Rest, Search, Replacement, Options, `${Accumulator}${FirstCharacter}`>
				: Input extends ''
					? Accumulator
					// What is left cannot be split. A placeholder like `Uppercase<string>` is still a match on its own, and anything else, like `string`, is kept.
					: Input extends Search
						? `${Accumulator}${Replacement}`
						: `${Accumulator}${Input}`;

/**
Inserts the replacement before every character of `Input`, and once after the last one, which is what replacing an empty search does. The accumulator already holds the leading replacement.
*/
type _ReplaceEmptySearch<
	Input extends string,
	Replacement extends string,
	Accumulator extends string,
> = Input extends `${infer FirstCharacter}${infer Rest}`
	? _ReplaceEmptySearch<Rest, Replacement, `${Accumulator}${FirstCharacter}${Replacement}`>
	: Accumulator;

export {};

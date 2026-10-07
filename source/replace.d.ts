import type {ApplyDefaultOptions} from './internal/index.d.ts';
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
		? Search extends ''
			// An empty `Search` is a zero-width match, so it matches before every character and after the last one. The pattern below cannot express a zero-width match, because TypeScript anchors the head to the first character instead of the empty string.
			? Options['all'] extends true
				? Input extends string // For distributing `Input`
					? IsStringLiteral<Input> extends true
						? _ReplaceEmptySearch<Input, Replacement, `${Accumulator}${Replacement}`>
						: string
					: never
				: `${Accumulator}${Replacement}${Input}`
			: Input extends `${infer Head}${Search}${infer Tail}`
				? Options['all'] extends true
					? _Replace<Tail, Search, Replacement, Options, `${Accumulator}${Head}${Replacement}`>
					: `${Head}${Replacement}${Tail}`
				: `${Accumulator}${Input}`
		: never
	: never;

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

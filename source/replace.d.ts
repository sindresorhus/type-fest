type ReplaceOptions = {
	all?: boolean;
};

/**
Returns a new string with some or all matches
of a string replaced by a replacement.

Use-case:
	- snake-case-path to dotted.path.notation
	- Date/Time format "01-08-2042" -> "01/08/2042"
	- Manipulation of type properties e.g. removal of prefixes

@example
```
import {Replace} from 'type-fest';

declare function replace<
	Input extends string,
	Search extends string,
	Replacement extends string
>(
	input: Input,
	search: Search,
	replacement: Replacement
): Replace<Input, Search, Replacement>;

declare function replaceAll<
	Input extends string,
	Search extends string,
	Replacement extends string
>(
	input: Input,
	search: Search,
	replacement: Replacement
): Replace<Input, Search, Replacement, { all: true }>;

replace("hello ?", "?", "🦄"); // => "hello 🦄"
replace("hello ??", "?", "❓"); // => "hello ❓?"

replaceAll("10:42:00", ":", "-");     // => "10-42-00"
replaceAll("__userName__", "__", ""); // => "userName"
replaceAll("My Cool Title", " ", ""); // => "MyCoolTitle"
```

@category String
@category Template literal
*/
export type Replace<
	Input extends string,
	Search extends string,
	Replacement extends string,
	Options extends ReplaceOptions = {},
> = Input extends `${infer Head}${Search}${infer Tail}`
	? Options['all'] extends true
		? Replace<`${Head}${Replacement}${Tail}`, Search, Replacement, Options>
		: `${Head}${Replacement}${Tail}`
	: Input;

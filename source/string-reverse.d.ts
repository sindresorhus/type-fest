import type {UnwrapBrandedPrimitive} from './unwrap-branded-primitive.d.ts';
import type {IsStringLiteral} from './is-string-literal.d.ts';

/**
Reverse the order of characters in a string literal type.

Use to type string-reversal functions or build other string transformations.

Returns `string` for non-literal strings (including template literal patterns) and `any`. Distributes over unions and preserves `never`. Input brands are removed.

Note: Whether supplementary Unicode characters, such as emoji, stay intact depends on the TypeScript compiler. Grapheme clusters, such as combining sequences, are not preserved.

Note: Strings longer than 998 characters cause a “Type instantiation is excessively deep” error.

@example
```
import type {StringReverse} from 'type-fest';

declare function reverseText<Text extends string>(text: Text): StringReverse<Text>;

const reversed = reverseText('hello');
//=> 'olleh'

type ReversedWords = StringReverse<'hello' | 'world'>;
//=> 'olleh' | 'dlrow'

type DynamicText = StringReverse<`prefix${string}`>;
//=> string
```

@category String
@category Template literal
*/
export type StringReverse<Value extends string> =
	// Template literal inference does not match a branded string, so the brand is removed first.
	(Value extends object ? UnwrapBrandedPrimitive<Value> : Value) extends infer Input extends string
		? Input extends unknown // To distribute `Input`, which also preserves `never`
			? IsStringLiteral<Input> extends true
				? _StringReverse<Input>
				: string
			: never
		: never;

// Prepend each character to the result so the recursion is tail-recursive.
type _StringReverse<Value extends string, Result extends string = ''> =
	Value extends `${infer First}${infer Rest}`
		? _StringReverse<Rest, `${First}${Result}`>
		: Result;

export {};

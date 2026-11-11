import type {UnwrapBrandedPrimitive} from './unwrap-branded-primitive.d.ts';
import type {IsStringLiteral} from './is-string-literal.d.ts';

/**
Returns a boolean for whether a string consists only of zero or more repetitions of the given pattern.

Useful for validating character sets or repeated substrings. Matching is case-sensitive and literal, with no regular expression syntax or Unicode normalization. Branded strings match by their underlying value.

A union of literal patterns allows mixing its members, and overlapping patterns match if any complete segmentation succeeds. Input unions distribute: `true` when every member matches, `false` when none does, and `boolean` when they disagree.

A `never` input returns `never`, and an empty input returns `true` for every pattern. For a non-empty literal input, empty pattern members are ignored and a `never` pattern returns `false`. A non-literal input or pattern, including `any` or a pattern union with a non-literal member, returns `boolean` unless the input is empty or `never`.

@example
```
import type {ConsistsOnlyOf, DigitCharacter} from 'type-fest';

type NumericId = ConsistsOnlyOf<'00123', DigitCharacter>;
//=> true

type Decimal = ConsistsOnlyOf<'12.3', DigitCharacter>;
//=> false

type RepeatedToken = ConsistsOnlyOf<'abab', 'ab'>;
//=> true

type MixedTokens = ConsistsOnlyOf<'aab', 'a' | 'ab'>;
//=> true

type Empty = ConsistsOnlyOf<'', DigitCharacter>;
//=> true

type DynamicInput = ConsistsOnlyOf<string, DigitCharacter>;
//=> boolean
```

@example
```
import type {ConsistsOnlyOf, DigitCharacter} from 'type-fest';

// Filter a union to identifiers containing only digits, preserving leading zeros.
type DigitOnly<Value extends string> = Value extends unknown
	? ConsistsOnlyOf<Value, DigitCharacter> extends true ? Value : never
	: never;

type NumericIds = DigitOnly<'00123' | '12.3' | '42'>;
//=> '00123' | '42'
```

It removes matching prefixes recursively, keeping every possible remainder so any complete segmentation can succeed.

@category String
@category Template literal
@category Type Guard
*/
export type ConsistsOnlyOf<Value extends string, Pattern extends string> = _ConsistsOnlyOf<Value extends object ? UnwrapBrandedPrimitive<Value> : Value, Pattern extends object ? UnwrapBrandedPrimitive<Pattern> : Pattern>;

type _ConsistsOnlyOf<Value extends string, Pattern extends string> = Value extends ''
	? true
	: IsStringLiteral<Value> extends true
		? [Pattern] extends [never]
			? false
			: IsStringLiteral<Pattern> extends true
				// An empty pattern member consumes no characters, so leave it out before recurring.
				? ConsistsOnlyOfLiteral<Value, Exclude<Pattern, ''>>
				: boolean
		: boolean;

// Keep alternative remainders together so any complete segmentation succeeds, without branching the recursion.
type ConsistsOnlyOfLiteral<Value extends string, Pattern extends string> = [Value] extends [never]
	? false
	: '' extends Value
		? true
		: ConsistsOnlyOfLiteral<RemovePattern<Value, Pattern>, Pattern>;

type RemovePattern<Value extends string, Pattern extends string> = Value extends `${Pattern}${infer Tail}` ? Tail : never;

export {};

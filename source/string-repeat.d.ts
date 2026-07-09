import type {IsNumericLiteral} from './is-literal.d.ts';
import type {IsNegative} from './numeric.d.ts';
import type {DigitCharacter} from './characters.d.ts';

/**
Returns a new string which contains the specified number of copies of a given string, just like `String#repeat()`.

@example
```
import type {StringRepeat} from 'type-fest';

declare function stringRepeat<
	S extends string,
	Count extends number,
>(input: S, count: Count): StringRepeat<S, Count>;

// The return type is the exact string literal, not just `string`.

stringRepeat('foo', 2);
//=> 'foofoo'

stringRepeat('=', 3);
//=> '==='
```

Note: If the specified count has a decimal part, the decimal part will be ignored.

@example
```
import type {StringRepeat} from 'type-fest';

type DecimalCount = StringRepeat<'foo', 2.5>;
//=> 'foofoo'
```

@category String
@category Template literal
*/
export type StringRepeat<S extends string, Count extends number> =
	Count extends unknown // To distribute `Count`
		? IsNegative<Count> extends true
			? never
			: S extends ''
				? ''
				: IsNumericLiteral<Count> extends false
					? string
					: `${Count}` extends `${string}e${string}`
						? string
						: BuildStringDigitByDigit<S, `${Count}`>
		: never;

type BuildStringDigitByDigit<S extends string, Count extends string, Accumulator extends string = ''> =
	Count extends `${infer First extends DigitCharacter}${infer Rest}`
		? BuildStringDigitByDigit<
			S,
			Rest,
			`${RepeatStringTenTimes<Accumulator>}${DigitStringRepeat<S, First>}`
		>
		: Accumulator;

type RepeatStringTenTimes<S extends string> = `${S}${S}${S}${S}${S}${S}${S}${S}${S}${S}`;

type DigitStringRepeat<S extends string, Digit extends DigitCharacter> = [
	'',
	`${S}`,
	`${S}${S}`,
	`${S}${S}${S}`,
	`${S}${S}${S}${S}`,
	`${S}${S}${S}${S}${S}`,
	`${S}${S}${S}${S}${S}${S}`,
	`${S}${S}${S}${S}${S}${S}${S}`,
	`${S}${S}${S}${S}${S}${S}${S}${S}`,
	`${S}${S}${S}${S}${S}${S}${S}${S}${S}`,
][Digit];

export {};

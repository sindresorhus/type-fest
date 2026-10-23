import type {DigitCharacter} from './characters.d.ts';
import type {ConsistsOnlyOf} from './internal/string.d.ts';
import type {UnwrapBrand} from './internal/object.d.ts';
import type {NonNegativeInteger} from './numeric.d.ts'; // For `@link`
import type {StringToNumber} from './string-to-number.d.ts'; // For `@link`
import type {Tagged} from './tagged.d.ts'; // For `@link`

/**
A `string` that represents a non-negative integer, like `'42'`.

The underlying string must consist only of the decimal digits `0`-`9`. Leading zeros are allowed, since `'007'` is still a non-negative integer written as a string. A sign, a decimal point, an exponent, a numeric separator, whitespace, a non-ASCII digit, or an empty string is rejected. A union is kept only when every member is valid, so `'1' | 'a'` is rejected. A valid branded string retains its brand.

Use-cases:
- Validate a string that must hold a numeric ID, like a Discord snowflake or a 64-bit integer from an API. A `number` would lose precision above `Number.MAX_SAFE_INTEGER`.
- Validate a zero-padded value from a form field or a JSON response, like `'0930'`, without allowing a sign or a decimal point.

Note: A wide `string` can't be proven to hold only digits, so it is rejected. To accept a value that is only known at runtime, check it at runtime and accept a {@link Tagged} brand next to `NonNegativeIntegerString<Value>`, as in the last example.

@example
```
import type {NonNegativeIntegerString} from 'type-fest';

type A = NonNegativeIntegerString<'42'>;
//=> '42'

type B = NonNegativeIntegerString<'007'>;
//=> '007'

type C = NonNegativeIntegerString<'-1'>;
//=> never

type D = NonNegativeIntegerString<'1.5'>;
//=> never

type E = NonNegativeIntegerString<'1e3'>;
//=> never

type F = NonNegativeIntegerString<' 42'>;
//=> never

type G = NonNegativeIntegerString<string>;
//=> never
```

@example
```
import type {NonNegativeIntegerString} from 'type-fest';

declare function setCount<T extends string>(count: NonNegativeIntegerString<T>): void;

setCount('42');

// @ts-expect-error
setCount('-1');
```

@example
```
import type {NonNegativeIntegerString, Tagged} from 'type-fest';

type UserId = Tagged<string, 'UserId'>;

function isUserId(value: string): value is UserId {
	return /^\d+$/v.test(value);
}

declare function getUser<T extends string>(userId: NonNegativeIntegerString<T> | UserId): void;

getUser('42');

declare const input: string;

if (isUserId(input)) {
	getUser(input);
}
```

The built-in `${number}` is not enough because it also matches `'-1'`, `'1.5'`, `'1e3'`, `'0x10'`, and `' 42'`, and `${bigint}` also matches `'-1'` and `'0x10'` while rejecting `'007'`. So this type walks the string one character at a time and rejects the first character that is not a digit. Each step removes the first character, so the recursion is in tail position and up to 999 characters are accepted. The string is kept as is, so no precision is lost.

@see {@link NonNegativeInteger}
@see {@link StringToNumber}

@category Numeric
@category String
@category Template literal
*/
export type NonNegativeIntegerString<Value extends string> =
	// `ConsistsOnlyOf` accepts empty strings. Include enum values without losing the constraint on generic strings.
	'' extends UnwrapBrand<Value> | `${UnwrapBrand<Value>}`
		? never
		: ConsistsOnlyOf<UnwrapBrand<Value>, DigitCharacter> extends true
			? Value
			: never;

export {};

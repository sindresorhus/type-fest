import type {IsNever} from './is-never.d.ts';
import type {WhitespaceCharacter} from './whitespace-character.d.ts';
import type {IsNumberLike} from './is-number-like.d.ts'; // For `@link`
import type {NonNegativeIntegerString} from './non-negative-integer-string.d.ts'; // For `@link`

/**
Returns a boolean for whether the given type is a numeric string without surrounding whitespace.

Useful for identifying numeric configuration values or string keys.

Accepts TypeScript's `${number}` forms (decimal, scientific, hexadecimal, binary, and octal), but rejects surrounding whitespace, empty strings, `'Infinity'`, `'NaN'`, numeric separators, and overflow. Unlike {@link IsNumberLike}, numbers themselves are excluded. For decimal digits only, use {@link NonNegativeIntegerString}.

Brands do not change the result. Returns `boolean` for `any` or mixed union results, and `false` for `never`, `unknown`, and widened `string`. Unions are normalized before checking each member.

Template patterns use assignability, not exhaustive validation: `${number}` returns `true`, while `${bigint}` returns `false`.

The whitespace check works around [Microsoft/TypeScript#46109](https://github.com/microsoft/TypeScript/issues/46109#issuecomment-930307987).

@example
```
import type {IsNumericString} from 'type-fest';

type Port = IsNumericString<'8080'>;
//=> true

type Scientific = IsNumericString<'5e-3'>;
//=> true

type Padded = IsNumericString<' 8080 '>;
//=> false

type NumberValue = IsNumericString<8080>;
//=> false

type Mixed = IsNumericString<'42' | 'auto'>;
//=> boolean
```

@example
```
import type {IsNumericString} from 'type-fest';

type Query = {page: '2'; search: 'cats'};
type ParsedQuery = {
	[Key in keyof Query]: IsNumericString<Query[Key]> extends true ? number : Query[Key];
};
//=> {page: number; search: 'cats'}
```

@category Type Guard
@category Numeric
@category String
*/
export type IsNumericString<Value> = IsNever<Value> extends true
	? false
	: Value extends `${number}`
		// Check the boundaries directly, so brands do not need to be removed to compare against a trimmed string.
		? Value extends `${WhitespaceCharacter}${string}` | `${string}${WhitespaceCharacter}` ? false : true
		: false;

export {};

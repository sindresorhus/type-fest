import type {IsNever} from './is-never.d.ts';
import type {IsNumericLiteral} from './is-numeric-literal.d.ts'; // For `@link`

/**
Returns a boolean for whether the given type is a `number` or a numeric string.

Useful for identifying numeric keys or selecting numeric fields in type transformations.

Strings follow TypeScript's `${number}` matching: decimal, scientific, hexadecimal, binary, and octal forms are accepted, including surrounding whitespace and whitespace-only strings. A leading `+` is accepted on decimal and scientific forms, but not on radix-prefixed forms. Empty strings, `'Infinity'`, `'NaN'`, and digit separators such as `'1_000'` are rejected. A form is accepted only when its value is finite and within the `number` range, so `'1e308'` is accepted but `'1e309'` is rejected. The `number` type includes the values `NaN`, `Infinity`, and `-Infinity`, so a value of type `number` is accepted even when it is one of those; only their string spellings are rejected. The check is on the type, not runtime coercion, so a non-string value that would coerce to a number, such as a `{valueOf(): number}` object, is excluded.

Template literal patterns are compared by assignability, so a pattern such as `${bigint}` returns `false` even though every value it can produce is a numeric string. Unions are normalized before classification; mixed results return `boolean`. Returns `boolean` for `any`, and `false` for `never`, `unknown`, and the widened `string` type. Unlike {@link IsNumericLiteral}, this also matches the widened `number` type and numeric strings; `bigint` literals do not match.

@example
```
import type {IsNumberLike} from 'type-fest';

type Port = IsNumberLike<'8080'>;
//=> true

type Price = IsNumberLike<19.99>;
//=> true

type Scientific = IsNumberLike<'5e-3'>;
//=> true

type Hex = IsNumberLike<'0x1F'>;
//=> true

type Invalid = IsNumberLike<'12px'>;
//=> false

type Mixed = IsNumberLike<42 | 'abc'>;
//=> boolean
```

@category Type Guard
@category Numeric
*/
export type IsNumberLike<Value> = IsNever<Value> extends true ? false : Value extends number | `${number}` ? true : false;

export {};

import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {NegativeInfinity, PositiveInfinity} from './numeric.d.ts';
import type {Replace} from './replace.d.ts';

/**
Converts a numeric string to a number.

@example
```
import type {StringToNumber} from 'type-fest';

type PositiveInteger = StringToNumber<'1234'>;
//=> 1234

type NegativeInteger = StringToNumber<'-1234'>;
//=> -1234

type PositiveFloat = StringToNumber<'1234.56'>;
//=> 1234.56

type NegativeFloat = StringToNumber<'-1234.56'>;
//=> -1234.56

type WithSeparators = StringToNumber<'1_234_567.123_456_7'>;
//=> 1234567.1234567
```

Note: Due to some quirks in the type system, you may occasionally encounter unexpected results (see [microsoft/TypeScript#57404](https://github.com/microsoft/TypeScript/issues/57404)). For example, `StringToNumber<'-0.0000001'>` returns `number`. However, this type does handle fractional numbers ending in zero (such as `1.50`) and numbers with separators (such as `1_000`).

@category String
@category Numeric
@category Template literal
*/
export type StringToNumber<S extends string> =
	IfNotAnyOrNever<S,
		S extends `_${string}` | `${string}_` | `${string}__${string}` | `${string}._${string}` | `${string}_.${string}`
			? never
			: _StringToNumber<Replace<S, '_', '', {all: true}>>,
		number>;

type _StringToNumber<S extends string> =
	S extends '-0'
		? -0
		: S extends `-0.${infer _Fraction extends 0}` // Matches `-0.0`, `-0.00`, etc.
			? -0
			: S extends `${infer N extends number}.0` // Matches `1.0`, `1234.0`, etc.
				? N
				: S extends `${infer N}.${infer Fraction}0` // Matches `1.10`, `1234.5600`, etc.
					? _StringToNumber<`${N}.${Fraction}`>
					: S extends `${infer N extends number}`
						? N
						: S extends 'Infinity'
							? PositiveInfinity
							: S extends '-Infinity'
								? NegativeInfinity
								: never;

export {};

import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {NegativeInfinity, PositiveInfinity} from './numeric.d.ts';

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

type PositiveInfinity = StringToNumber<'Infinity'>;
//=> Infinity

type NegativeInfinity = StringToNumber<'-Infinity'>;
//=> -Infinity
```

Note: Some strings, such as `'1.50'`, `'0b10'`, or `'12_345'`, may look like they can be converted to numbers, but they don't actually have corresponding numeric literals. So, in such cases, this type produces `never`. See [type-fest#1446](https://github.com/sindresorhus/type-fest/pull/1446) for more details.

@example
```
import type {StringToNumber} from 'type-fest';

type FractionalsEndingInZero = StringToNumber<'1.50'>;
//=> never

type NonDecimalBases = StringToNumber<'0b10' | '0o10' | '0x10'>;
//=> never

type NumericSeparators = StringToNumber<'12_345'>;
//=> never
```

@category String
@category Numeric
@category Template literal
*/
export type StringToNumber<S extends string> = IfNotAnyOrNever<S, {ifNot: _StringToNumber<S>; ifAny: number}>;

type _StringToNumber<S extends string> =
	S extends `${infer N extends number}`
		? number extends N
			? `${number}` extends S
				? N
				: never
			: N
		: string extends S
			? number
			: S extends 'Infinity'
				? PositiveInfinity
				: S extends '-Infinity'
					? NegativeInfinity
					: never;

export {};

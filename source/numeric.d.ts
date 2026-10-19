import type {UnwrapBrand} from './internal/object.d.ts';
import type {IsFloat} from './is-float.d.ts';
import type {IsInteger} from './is-integer.d.ts';
import type {IsNumericLiteral} from './is-numeric-literal.d.ts';
import type {Tagged} from './tagged.d.ts'; // For `@link`

export type _Numeric = number | bigint;

type Zero = 0 | 0n;

/**
Matches the hidden `Infinity` type.

Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/32277) if you want to have this type as a built-in in TypeScript.

@see {@link NegativeInfinity}

@category Numeric
*/
// See https://github.com/microsoft/TypeScript/issues/31752
// eslint-disable-next-line no-loss-of-precision
export type PositiveInfinity = 1e999;

/**
Matches the hidden `-Infinity` type.

Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/32277) if you want to have this type as a built-in in TypeScript.

@see {@link PositiveInfinity}

@category Numeric
*/
// See https://github.com/microsoft/TypeScript/issues/31752
// eslint-disable-next-line no-loss-of-precision
export type NegativeInfinity = -1e999;

/**
A finite `number`.
You can't pass a `bigint` as they are already guaranteed to be finite.

Use-case: Validating and documenting parameters.

Note: TypeScript types the `NaN`, `Infinity`, and `-Infinity` values as `number`, so a wide `number` can't be proven finite and is rejected. To accept a value that is only known at runtime, accept a {@link Tagged} brand next to `Finite<T>` in the parameter type, as shown in the last example. Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/28682) if you want to have a `NaN` type as a built-in in TypeScript.

@example
```
import type {Finite, PositiveInfinity} from 'type-fest';

type A = Finite<1.5>;
//=> 1.5

type B = Finite<PositiveInfinity>;
//=> never

type C = Finite<number>;
//=> never
```

@example
```
import type {Finite, Tagged} from 'type-fest';

type FiniteNumber = Tagged<number, 'Finite'>;

function isFiniteNumber(value: number): value is FiniteNumber {
	return Number.isFinite(value);
}

declare function setScore<T extends number>(score: Finite<T> | FiniteNumber): void;

setScore(1.5);

declare const input: number;

if (isFiniteNumber(input)) {
	setScore(input);
}
```

@category Numeric
*/
export type Finite<T extends number> = T extends PositiveInfinity | NegativeInfinity ? never : IsNumericLiteral<T> extends true ? T : never;

/**
A `number` that is an integer.

Use-case: Validating and documenting parameters.

@example
```
import type {Integer} from 'type-fest';

type SomeInteger = Integer<1>;
//=> 1

type IntegerWithDecimal = Integer<1.0>;
//=> 1

type NegativeInteger = Integer<-1>;
//=> -1

type Float = Integer<1.5>;
//=> never

// Supports non-decimal numbers

type OctalInteger = Integer<0o10>;
//=> 8

type BinaryInteger = Integer<0b10>;
//=> 2

type HexadecimalInteger = Integer<0x10>;
//=> 16
```

@example
```
import type {Integer} from 'type-fest';

declare function setYear<T extends number>(length: Integer<T>): void;
```

@see {@link NegativeInteger}
@see {@link NonNegativeInteger}

@category Numeric
*/
// `${bigint}` is a type that matches a valid bigint literal without the `n` (ex. 1, 0b1, 0o1, 0x1)
// Because T is a number and not a string we can effectively use this to filter out any numbers containing decimal points
export type Integer<T> =
	T extends unknown // To distributive type
		? IsInteger<T> extends true ? T : never
		: never; // Never happens

/**
A `number` that is not an integer.

Use-case: Validating and documenting parameters.

It does not accept `Infinity` or `-Infinity`.

@example
```
import type {Float} from 'type-fest';

declare function setPercentage<T extends number>(length: Float<T>): void;
```

@see {@link Integer}

@category Numeric
*/
export type Float<T> =
	T extends unknown // To distributive type
		? IsFloat<T> extends true ? T : never
		: never; // Never happens

/**
A negative (`-∞ < x < 0`) `number` that is not an integer.
Equivalent to `Negative<Float<T>>`.

Use-case: Validating and documenting parameters.

@see {@link Negative}
@see {@link Float}

@category Numeric
*/
export type NegativeFloat<T extends number> = Negative<Float<T>>;

/**
A negative `number`/`bigint` (`-∞ < x < 0`).

Use-case: Validating and documenting parameters.

It does not accept `-Infinity`.

Note: A wide `number` or `bigint` can't be proven negative, so it is rejected. To accept a value that is only known at runtime, accept a branded type next to `Negative<T>` in the parameter type, as shown for {@link Finite}.

@see {@link NegativeInteger}
@see {@link NonNegative}

@example
```
import type {Negative, NegativeInfinity} from 'type-fest';

type A = Negative<-1>;
//=> -1

type B = Negative<0>;
//=> never

type C = Negative<NegativeInfinity>;
//=> never

type D = Negative<number>;
//=> never
```

@example
```
import type {Negative} from 'type-fest';

declare function setOffset<T extends number>(offset: Negative<T>): void;
```

@category Numeric
*/
export type Negative<T extends _Numeric> = T extends NegativeInfinity ? never : NegativeSign<T>;

// Matches values with a negative sign, including `-Infinity`.
// Read the sign from the unbranded primitive, because `${T}` does not reduce for a literal intersected with an object type, but keep the original brand on accepted values.
type NegativeSign<T extends _Numeric> = T extends Zero ? never : `${T extends object ? UnwrapBrand<T> : T}` extends `-${string}` ? T : never;

/**
A negative (`-∞ < x < 0`) `number` that is an integer.
Equivalent to `Negative<Integer<T>>`.

You can't pass a `bigint` as they are already guaranteed to be integers, instead use `Negative<T>`.

Use-case: Validating and documenting parameters.

@see {@link Negative}
@see {@link Integer}

@category Numeric
*/
export type NegativeInteger<T extends number> = Negative<Integer<T>>;

/**
A non-negative `number`/`bigint` (`0 <= x < ∞`).

Use-case: Validating and documenting parameters.

It does not accept `Infinity`.

Note: A wide `number` or `bigint` can't be proven non-negative, so it is rejected. To accept a value that is only known at runtime, accept a branded type next to `NonNegative<T>` in the parameter type, as shown for {@link Finite}.

@see {@link NonNegativeInteger}
@see {@link Negative}

@example
```
import type {NonNegative} from 'type-fest';

type A = NonNegative<1>;
//=> 1

type B = NonNegative<-1>;
//=> never

type C = NonNegative<number>;
//=> never
```

@example
```
import type {NonNegative} from 'type-fest';

declare function setLength<T extends number>(length: NonNegative<T>): void;
```

@category Numeric
*/
export type NonNegative<T extends _Numeric> = T extends NegativeSign<T> | PositiveInfinity ? never : IsNumericLiteral<T> extends true ? T : never;

/**
A non-negative (`0 <= x < ∞`) `number` that is an integer.
Equivalent to `NonNegative<Integer<T>>`.

You can't pass a `bigint` as they are already guaranteed to be integers, instead use `NonNegative<T>`.

Use-case: Validating and documenting parameters.

@see {@link NonNegative}
@see {@link Integer}

@example
```
import type {NonNegativeInteger} from 'type-fest';

declare function setLength<T extends number>(length: NonNegativeInteger<T>): void;
```

@category Numeric
*/
export type NonNegativeInteger<T extends number> = NonNegative<Integer<T>>;

/**
Returns a boolean for whether the given number is a negative number.

Unlike {@link Negative}, it returns `true` for `-Infinity`, since it only checks the sign.

@see {@link Negative}

@example
```
import type {IsNegative, NegativeInfinity} from 'type-fest';

type A = IsNegative<-1>;
//=> true

type B = IsNegative<1>;
//=> false

type C = IsNegative<NegativeInfinity>;
//=> true
```

@category Numeric
*/
export type IsNegative<T extends _Numeric> = T extends NegativeSign<T> ? true : false;

export {};

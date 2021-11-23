type Numeric = number | bigint;

type Zero = 0 | 0n;

/**
Matches the hidden `Infinity` type.

Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/32277) if you want to have this type as a built-in in TypeScript.

@category Basic
*/
// See https://github.com/microsoft/TypeScript/issues/31752
// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
export type PositiveInfinity = 1e999;
/**
Matches the hidden `-Infinity` type.

Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/32277) if you want to have this type as a built-in in TypeScript.

@category Basic
*/
// See https://github.com/microsoft/TypeScript/issues/31752
// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
export type NegativeInfinity = -1e999;

/**
A finite `number`.
You can't pass a `bigint` as they are already guaranteed to be finite.

Use-case: Validating and documenting parameters.

@example
```
import {Finite} from 'type-fest';

declare function setScore<T extends number>(length: Finite<T>): void;
```

@category Utilities
*/
export type Finite<T extends number> = T extends PositiveInfinity | NegativeInfinity ? never : T;

/**
A `number` that is an integer.
You can't pass a `bigint` as they are already guaranteed to be integers.

Use-case: Validating and documenting parameters.

@example
```
import {Integer} from 'type-fest';

declare function setYear<T extends number>(length: Integer<T>): void;
```

@category Utilities
*/
// `${bigint}` is a type that matches a valid bigint literal without the `n` (ex. 1, 0b1, 0o1, 0x1)
// Because T is a number and not a string we can effectively use this to filter out any numbers containing decimal points
export type Integer<T extends number> = `${T}` extends `${bigint}` ? T : never;

/**
A negative `number`/`bigint` (`(-∞, 0)`).

Use-case: Validating and documenting parameters.

@see Positive
@see Natural

@category Utilities
*/
export type Negative<T extends Numeric> = T extends Zero ? never : `${T}` extends `-${string}` ? T : never;

/**
A negative (`(∞, 0)`) `number` that is an integer.
Equivalent to `Negative<Integer<T>>`.

You can't pass a `bigint` as they are already guaranteed to be integers, instead use `Negative<T>`.

Use-case: Validating and documenting parameters.

@see Negative
@see Integer

@category Utilities
*/
export type NegativeInteger<T extends number> = Negative<Integer<T>>;

/**
A positive `number`/`bigint` (`(0, ∞)`).

Use-case: Validating and documenting parameters.

@see Negative
@see Natural

@example
```
import {Positive} from 'type-fest';

declare function setQuantity<T extends number>(length: Positive<T>): void;
```

@category Utilities
*/
export type Positive<T extends Numeric> = T extends Zero ? never : Negative<T> extends never ? T : never;

/**
A positive (`(0, ∞)`) `number` that is an integer.
Equivalent to `Positive<Integer<T>>`.

You can't pass a `bigint` as they are already guaranteed to be integers, instead use `Positive<T>`.

Use-case: Validating and documenting parameters.

@see Positive
@see Integer
@see Natural

@example
```
import {PositiveInteger} from 'type-fest';

declare function setLength<T extends number>(length: PositiveInteger<T>): void;
```

@category Utilities
*/
export type PositiveInteger<T extends number> = Positive<Integer<T>>;

/**
A natural `number`/`bigint` (`[0, ∞)`).
Natural numbers are positive numbers or zero.

Use-case: Validating and documenting parameters.

@see Positive
@see Negative

@example
```
import {Natural} from 'type-fest';

declare function setLength<T extends number>(length: Natural<T>): void;
```

@category Utilities
*/
export type Natural<T extends Numeric> = T extends Zero ? T : Positive<T>;

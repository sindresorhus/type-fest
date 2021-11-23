type Infinities = 'Infinity' | '-Infinity';

type Numeric = number | bigint;

type Zero = 0 | 0n;

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
export type Integer<T extends number> = `${T}` extends Infinities ? never : `${T}` extends `${bigint}` ? T : never;

/**
A negative `number`/`bigint` (`(-∞, 0)`).

Use-case: Validating and documenting parameters.

@see Positive
@see Natural

@category Utilities
*/
export type Negative<T extends Numeric> = T extends Zero ? never : `${T}` extends `-${string}` ? T : never;

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

/**
A `number` that is an integer.

Use-case: Validating and documenting parameters.

@example
```
declare function setYear<T extends number>(length: Integer<T>): void;
```

@category Utilities
*/
export type Integer<T extends number> = `${T}` extends `${bigint}` ? T : never;

type Numeric = number | bigint;

type Zero = 0 | 0n;

/**
A negative `number`/`bigint` (`(-∞, 0)`).

Use-case: Validating and documenting parameters.

@category Utilities
*/
export type Negative<T extends Numeric> = T extends Zero ? never : `${T}` extends `-${string}` ? T : never;

/**
A positive `number`/`bigint` (`(0, ∞)`).

Use-case: Validating and documenting parameters.

@example
```
declare function setQuantity<T extends number>(length: Positive<T>): void;
```

@category Utilities
*/
export type Positive<T extends Numeric> = T extends Zero ? never : Negative<T> extends never ? T : never;

/**
A natural `number`/`bigint` (`[0, ∞)`).

Use-case: Validating and documenting parameters.

@example
```
declare function setLength<T extends number>(length: Natural<T>): void;
```

@category Utilities
*/
export type Natural<T extends Numeric> = T extends Zero ? T : Positive<T>;

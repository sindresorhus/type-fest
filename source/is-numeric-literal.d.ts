import type {CollapseLiterals, UnwrapBrand} from './internal/object.d.ts';
import type {IsNever} from './is-never.d.ts';

/**
Returns a boolean for whether the given type is a `number` or `bigint` [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

@example
```
import type {IsNumericLiteral} from 'type-fest';

type A = IsNumericLiteral<0>;
//=> true

type B = IsNumericLiteral<number>;
//=> false

type C = IsNumericLiteral<100n>;
//=> true

type D = IsNumericLiteral<bigint>;
//=> false

type E = IsNumericLiteral<1 | 2 | 10n | 20n>;
//=> true

type F = IsNumericLiteral<number | bigint>;
//=> false

type G = IsNumericLiteral<1 | bigint>;
//=> boolean
```

@category Type Guard
@category Utilities
*/
// The normalized predicate rejects `any`; only `never` needs a separate guard.
// Plain primitives need no brand normalization.
export type IsNumericLiteral<T> = IsNever<T> extends true ? false : _IsNumericLiteral<CollapseLiterals<T extends object ? UnwrapBrand<T> : T>>;

// Numeric enum members accept `number`, but only constant members have known values. Comparing printed types also rejects computed members, whose numeric value is unknown.
export type _IsNumericLiteral<T> = T extends number | bigint
	? `${number}` extends `${T}`
		? false
		: `${bigint}` extends `${T}`
			? false
			: true
	: false;

export {};

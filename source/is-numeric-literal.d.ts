import type {CollapseLiterals, UnwrapBrand} from './internal/object.d.ts';
import type {IfNotAnyOrNever} from './internal/type.d.ts';

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
export type IsNumericLiteral<T> = IfNotAnyOrNever<T, {
	ifNot: _IsNumericLiteral<CollapseLiterals<UnwrapBrand<T>>>;
	ifAny: false;
	ifNever: false;
}>;

type _IsNumericLiteral<T> = T extends number | bigint
	? number extends T
		? false
		: bigint extends T
			? false
			: true
	: false;

export {};

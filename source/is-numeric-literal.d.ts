import type {CollapseLiterals, UnwrapBrand} from './internal/object.d.ts';
import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {IsEqual} from './is-equal.d.ts';

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

// A numeric enum member is a literal even though `number extends T` is `true` for it, because TypeScript 5.0 made every enum a union of its members. Identity is what separates a member from the widened `number` and `bigint`, so a member is whatever is neither of those.
type _IsNumericLiteral<T> = T extends number | bigint
	? IsEqual<T, number> extends true
		? false
		: IsEqual<T, bigint> extends true
			? false
			: true
	: false;

export {};

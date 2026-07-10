import type {IsStringLiteral} from './is-string-literal.d.ts';
import type {IsNumericLiteral} from './is-numeric-literal.d.ts';
import type {IsBooleanLiteral} from './is-boolean-literal.d.ts';
import type {IsSymbolLiteral} from './is-symbol-literal.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {CollapseLiterals, UnwrapBrand} from './internal/object.d.ts';

/**
Returns a boolean for whether the given type is a [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

@example
```
import type {IsLiteral} from 'type-fest';

type A = IsLiteral<1>;
//=> true

type B = IsLiteral<number>;
//=> false

type C = IsLiteral<1n>;
//=> true

type D = IsLiteral<bigint>;
//=> false

type E = IsLiteral<'type-fest'>;
//=> true

type F = IsLiteral<string>;
//=> false

type G = IsLiteral<`on${string}`>;
//=> false

declare const symbolLiteral: unique symbol;
type H = IsLiteral<typeof symbolLiteral>;
//=> true

type I = IsLiteral<symbol>;
//=> false

type J = IsLiteral<true>;
//=> true

type K = IsLiteral<false>;
//=> true

type L = IsLiteral<boolean>;
//=> false

type M = IsLiteral<1 | 'foo' | false>;
//=> true

type N = IsLiteral<string | number | symbol>;
//=> false

type O = IsLiteral<1000n | string | true>;
//=> boolean
```

@category Type Guard
@category Utilities
*/
export type IsLiteral<T> = IfNotAnyOrNever<T, {
	ifNot: _IsLiteral<CollapseLiterals<UnwrapBrand<T>>>;
	ifAny: false;
	ifNever: false;
}>;

type _IsLiteral<T> =
	| (Extract<T, boolean> extends infer Bools
		// We can't instantiate `IsBooleanLiteral` with `never`,
		// because that will add an extraneous `false` to the result if there are no booleans.
		? IsNever<Bools> extends true
			? never
			: IsBooleanLiteral<Bools>
		: never)
	| (IsLiteralNonBools<Exclude<T, boolean>>);

type IsLiteralNonBools<T> =
	T extends number | bigint
		? IsNumericLiteral<T>
		: T extends string
			? IsStringLiteral<T>
			: T extends symbol
				? IsSymbolLiteral<T>
				: false;

export {};

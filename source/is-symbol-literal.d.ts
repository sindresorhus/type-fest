import type {CollapseLiterals, UnwrapBrand} from './internal/object.d.ts';
import type {IsNever} from './is-never.d.ts';

/**
Returns a boolean for whether the given type is a `symbol` [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

@example
```
import type {IsSymbolLiteral} from 'type-fest';

declare const symbolLiteral1: unique symbol;
declare const symbolLiteral2: unique symbol;

type A = IsSymbolLiteral<typeof symbolLiteral1>;
//=> true

type B = IsSymbolLiteral<symbol>;
//=> false

type C = IsSymbolLiteral<typeof symbolLiteral1 | typeof symbolLiteral2>;
//=> true
```

@category Type Guard
@category Utilities
*/
// The normalized predicate rejects `any`; only `never` needs a separate guard.
// Plain primitives need no brand normalization.
export type IsSymbolLiteral<T> = IsNever<T> extends true ? false : _IsSymbolLiteral<CollapseLiterals<T extends object ? UnwrapBrand<T> : T>>;

export type _IsSymbolLiteral<T> = T extends symbol
	? symbol extends T
		? false
		: true
	: false;

export {};

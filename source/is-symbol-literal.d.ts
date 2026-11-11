import type {CollapseLiterals} from './collapse-literals.d.ts';
import type {UnwrapBrandedPrimitive} from './unwrap-branded-primitive.d.ts';
import type {IsNever} from './is-never.d.ts';

/**
Returns a boolean for whether the given type is a `symbol` [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

Returns `false` for `any`, `never`, and `unknown`. Unions are normalized before classification; mixed results return `boolean`.

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
export type IsSymbolLiteral<T> = IsNever<T> extends true ? false : _IsSymbolLiteral<CollapseLiterals<T extends object ? UnwrapBrandedPrimitive<T> : T>>;

export type _IsSymbolLiteral<T> = T extends symbol
	? symbol extends T
		? false
		: true
	: false;

export {};

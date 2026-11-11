import type {CollapseLiterals} from './collapse-literals.d.ts';
import type {UnwrapBrandedPrimitive} from './unwrap-branded-primitive.d.ts';
import type {IsNever} from './is-never.d.ts';

/**
Returns a boolean for whether the given type is a `true` or `false` [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

Returns `false` for `any`, `never`, and `unknown`. Unions are normalized before classification; mixed results return `boolean`.

@example
```
import type {IsBooleanLiteral} from 'type-fest';

type A = IsBooleanLiteral<true>;
//=> true

type B = IsBooleanLiteral<false>;
//=> true

type C = IsBooleanLiteral<boolean>;
//=> false

type D = IsBooleanLiteral<true | false>;
//=> false
```

@category Type Guard
@category Utilities
*/
// The normalized predicate rejects `any`; only `never` needs a separate guard.
// Plain primitives need no brand normalization.
export type IsBooleanLiteral<T> = IsNever<T> extends true ? false : _IsBooleanLiteral<CollapseLiterals<T extends object ? UnwrapBrandedPrimitive<T> : T>>;

export type _IsBooleanLiteral<T> = boolean extends T
	? false
	: T extends boolean
		? true
		: false;

export {};

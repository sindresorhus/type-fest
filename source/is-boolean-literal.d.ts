import type {CollapseLiterals, UnwrapBrand} from './internal/object.d.ts';
import type {IsNever} from './is-never.d.ts';

/**
Returns a boolean for whether the given type is a `true` or `false` [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

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
export type IsBooleanLiteral<T> = IsNever<T> extends true ? false : _IsBooleanLiteral<CollapseLiterals<T extends object ? UnwrapBrand<T> : T>>;

export type _IsBooleanLiteral<T> = boolean extends T
	? false
	: T extends boolean
		? true
		: false;

export {};

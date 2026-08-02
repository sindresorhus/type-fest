import type {CollapseLiterals, UnwrapBrand} from './internal/object.d.ts';
import type {IfNotAnyOrNever} from './internal/type.d.ts';

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
export type IsBooleanLiteral<T> = IfNotAnyOrNever<T, {
	ifNot: _IsBooleanLiteral<CollapseLiterals<UnwrapBrand<T>>>;
	ifAny: false;
	ifNever: false;
}>;

type _IsBooleanLiteral<T> = boolean extends T
	? false
	: T extends boolean
		? true
		: false;

export {};

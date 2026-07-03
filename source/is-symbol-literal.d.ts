import type {CollapseLiterals, IfNotAnyOrNever} from './internal/index.d.ts';
import type {TagContainer, UnwrapTagged} from './tagged.d.ts';

/**
Returns a boolean for whether the given type is a `symbol` [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

@example
```
import type {IsSymbolLiteral} from 'type-fest';

declare const sym1: unique symbol;
declare const sym2: unique symbol;

type A = IsSymbolLiteral<typeof sym1>;
//=> true

type B = IsSymbolLiteral<symbol>;
//=> false

type C = IsSymbolLiteral<typeof sym1 | typeof sym2>;
//=> true
```

@category Type Guard
@category Utilities
*/
export type IsSymbolLiteral<T> = IfNotAnyOrNever<T, {
	ifNot: _IsSymbolLiteral<CollapseLiterals<T extends TagContainer<any> ? UnwrapTagged<T> : T>>;
	ifAny: false;
	ifNever: false;
}>;

type _IsSymbolLiteral<T> = T extends symbol
	? symbol extends T
		? false
		: true
	: false;

export {};

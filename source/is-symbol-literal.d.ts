import type {CollapseLiterals, IfNotAnyOrNever} from './internal/index.d.ts';
import type {TagContainer, UnwrapTagged} from './tagged.d.ts';

/**
Returns a boolean for whether the given type is a `symbol` [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

Useful for:
	- providing strongly-typed functions when given literal arguments
	- type utilities, such as when constructing parsers and ASTs

@example
```
import type {IsSymbolLiteral} from 'type-fest';

type Get<Object_ extends Record<symbol, number>, Key extends keyof Object_> =
	IsSymbolLiteral<Key> extends true
		? Object_[Key]
		: number;

function get<Object_ extends Record<symbol, number>, Key extends keyof Object_>(o: Object_, key: Key) {
	return o[key] as Get<Object_, Key>;
}

const symbolLiteral = Symbol('literal');
let symbolValue = Symbol('value1');
symbolValue = Symbol('value2');

get({[symbolLiteral]: 1} as const, symbolLiteral);
//=> 1

get({[symbolValue]: 1} as const, symbolValue);
//=> number
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

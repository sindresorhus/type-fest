/**
Given a [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types) return the {@link Primitive | primitive type} it belongs to, or `never` if it's not a primitive.

Use-case: Working with generic types that may be literal types.

@example
```
import {LiteralToPrimitive} from 'type-fest';

type T = 123 | 'hello' | {key: string};
type U = LiteralToPrimitive<T>; // number | string
```

@category Type
*/
export type LiteralToPrimitive<T> = T extends number
	? number
	: T extends bigint
	? bigint
	: T extends string
	? string
	: T extends boolean
	? boolean
	: T extends symbol
	? symbol
	: T extends null
	? null
	: T extends undefined
	? undefined
	: never;

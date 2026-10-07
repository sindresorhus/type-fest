import type {IsAny} from './is-any.d.ts';

/**
Given a [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types) return the [primitive type](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) it belongs to, or `never` if it's not a primitive.

Use-case: Working with generic types that may be literal types.

@example
```
import type {LiteralToPrimitive} from 'type-fest';

// No overloads needed to get the correct return type
function plus<T extends number | bigint | string>(x: T, y: T): LiteralToPrimitive<T> {
	return x + (y as any);
}

plus('a', 'b'); // string
plus(1, 2); // number
plus(1n, 2n); // bigint
```

@category Type
*/
export type LiteralToPrimitive<T> = IsAny<T> extends true
	// `any` is not a literal, and the conditional below distributes over it, which would let every branch of the chain contribute and leave the union of every primitive in the library as the answer. `LiteralToPrimitiveDeep` hands `any` straight back, and it documents itself as this type apart from converting inside an object or an array, so the two have to agree here.
	? T
	: T extends number
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

export {};

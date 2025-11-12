/**
Given a [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types) return the {@link Primitive | primitive type} it belongs to, or `never` if it's not a primitive.

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
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gGWDFUCGANgCoQAKUoOwAbigL5wBmUEIcA5EqgLRMoBnGBwDcAKDEB6SXAByEOBDpRCEfABMBcAHYoU6-QgUBzFPBgALNAGNoUFNfj2YAVyjaEyFGKYvtj4AgPMEIXAQAeYjgUAA9cbU0dFxAAIzw4AB84FOBjYG14LKFKbWMAPgAKGIAuOGIAGjhEWuIASlrsXAISckoQajpIsowxAEhnNw8YuABqOArEOHwtfG1EVvF6CRCwio58DkaOFI4NuGk4YvzjMR2BCoBGRoAmM4vtZLSoW9D7h+0Xto3jIcnkCkA)

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

export {};

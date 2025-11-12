import type {GreaterThanOrEqual} from './greater-than-or-equal.d.ts';

/**
Returns a boolean for whether a given number is less than another number.

@example
```
import type {LessThan} from 'type-fest';

type A = LessThan<1, -5>;
//=> false

type B = LessThan<1, 1>;
//=> false

type C = LessThan<1, 5>;
//=> true
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gGRQZxwFQAsBDAOwF84AzKCEOAciVQForcYGBuAKB+bQBBOAF442PETIAeAIwAaOCwCsAPl4B6DSNXViAGxwo+AuACFR43ARKk5i2ep5adew8f7I0AYUsSbMgpwapraujBQAK4oQA)
*/
export type LessThan<A extends number, B extends number> = number extends A | B
	? never
	: GreaterThanOrEqual<A, B> extends infer Result
		? Result extends true
			? false
			: true
		: never; // Should never happen

export {};

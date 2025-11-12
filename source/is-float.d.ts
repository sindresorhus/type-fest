/**
Returns a boolean for whether the given number is a float, like `1.5` or `-1.5`.

Use-case:
- If you want to make a conditional branch based on the result of whether a number is a float or not.

@example
```
import type {IsFloat, PositiveInfinity} from 'type-fest';

type A = IsFloat<1.5>;
//=> true

type B = IsFloat<-1.5>;
//=> true

type C = IsFloat<1e-7>;
//=> true

type D = IsFloat<1.0>;
//=> false

type E = IsFloat<PositiveInfinity>;
//=> false

type F = IsFloat<1.23e+21>;
//=> false
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSQM4DEA2EAhjADRwAKE2wMwAbipgHYBmwztiAvnK1BBBwA5ElQBaVimwxhAbgBQCsWgCCcALxwcBYjAA8ARgB0AVgB8igPRWN5hFACuKJSrgAhTdryES+8SYW1rb2ME4uyshoAMJeOr4GhijiAOyWCjZ2Ds6uUXAAInE+ekbGAAzpmfasRPjYEW4AokW6flQ0dIws7JxIlSF8tfW5qHC4LQmlAEwAzCgA1FOG-Vk1dShAA)

@category Type Guard
@category Numeric
*/
export type IsFloat<T> = T extends number
	? `${T}` extends `${number}e${infer E extends '-' | '+'}${number}`
		? E extends '-'
			? true
			: false
		: `${T}` extends `${number}.${number}`
			? true
			: false
	: false;

export {};

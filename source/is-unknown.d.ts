import type {IsNull} from './is-null.d.ts';

/**
Returns a boolean for whether the given type is `unknown`.

@link https://github.com/dsherret/conditional-type-checks/pull/16

Useful in type utilities, such as when dealing with unknown data from API calls.

@example
```
import type {IsUnknown} from 'type-fest';

type A = IsUnknown<unknown>;
//=> unknown

type B = IsUnknown<any>;
//=> false

type C = IsUnknown<never>;
//=> false

type D = IsUnknown<unknown[]>;
//=> false

type E = IsUnknown<object>;
//=> false

type F = IsUnknown<string>;
//=> false
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSQM4FUB2A1vhAO74C+cAZlBCHAORKoC01K2MjA3AFB8WaAIJwAvHBwFiZfAB4ArkRLkAfPwD0GsarhKZ5AULgAhcZLzLZcgIb5E6vlp00bAG2wojyNAGFzUlbkcvgoAG4oUI7OutTunt6ocAAiAZYG8voq+ADaALrR2rHxXoI+cACiadLZchAARgBWKADGMIUucR6lxgBi1UHyXFDA+ADmHcXdQA)

@category Utilities
*/
export type IsUnknown<T> = (
	unknown extends T // `T` can be `unknown` or `any`
		? IsNull<T> extends false // `any` can be `null`, but `unknown` can't be
			? true
			: false
		: false
);

export {};

import type {AllExtend} from './all-extend.d.ts';

/**
Returns a boolean for whether two given types are both true.

Use-case: Constructing complex conditional types where multiple conditions must be satisfied.

@example
```
import type {And} from 'type-fest';

type TT = And<true, true>;
//=> true

type TF = And<true, false>;
//=> false

type FT = And<false, true>;
//=> false

type FF = And<false, false>;
//=> false
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gQQHYBMC+cAZlBCHAORKoC0RKAzjBQNwBQb1aAKt3ALxwcuADwwoAVxQAaBJJQA+dgHpl-BXKkcucbgDEBQvGPmyiAQwA2DRSrUaL1lNuRo9fQcJGObs8VKU2VXViKxsXVDg9A09jHxlQp0DghzCUIA)

Note: When `boolean` is passed as an argument, it is distributed into separate cases, and the final result is a union of those cases.
For example, `And<true, boolean>` expands to `And<true, true> | And<true, false>`, which simplifies to `true | false` (i.e., `boolean`).

@example
```
import type {And} from 'type-fest';

type A = And<true, boolean>;
//=> boolean

type B = And<boolean, true>;
//=> boolean

type C = And<false, boolean>;
//=> false

type D = And<boolean, false>;
//=> false

type E = And<boolean, boolean>;
//=> boolean
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gQQHYBMC+cAZlBCHAORKoC0RKAzjBQNwBQb1amcAvHDlwAeGFACuKADRwARhAgAbFAENsAPnYB6TbzWz5S1Ry5wAQnwF4hcxSuzTREjW2279to52RoAwhcFCRMoKDFLuhupaOnpBISjG3nAAIv5WNhHSsaHOrjHBoQmocACiqcLpdtIVqjnR4XZAA)

Note: If either of the types is `never`, the result becomes `false`.

@example
```
import type {And} from 'type-fest';

type A = And<true, never>;
//=> false

type B = And<never, true>;
//=> false

type C = And<false, never>;
//=> false

type D = And<never, false>;
//=> false

type E = And<boolean, never>;
//=> false

type F = And<never, boolean>;
//=> false

type G = And<never, never>;
//=> false
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gQQHYBMC+cAZlBCHAORKoC0RKAzjBQNwBQb1amcAvHDlwAeGFACuKADRxsKAG4ooAPnYB6VbyXEAhgBsGKDlzgAhPgLxDZCqNNESVbdZp37DnZGgDC5wUKJ6BtLWio7OWgFuRp5wACK+liG2rgZhGhGB7sYAognCAEYQELoo2tjB8qFq6SlZMQBieVaVyYXFpdhpLpEG0ahwAOJNSRU2XRluQA)

@see {@link Or}
@see {@link Xor}
*/
export type And<A extends boolean, B extends boolean> = AllExtend<[A, B], true>;

export {};

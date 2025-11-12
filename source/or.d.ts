import type {If} from './if.d.ts';
import type {IsNever} from './is-never.d.ts';

/**
Returns a boolean for whether either of two given types is true.

Use-case: Constructing complex conditional types where at least one condition must be satisfied.

@example
```
import type {Or} from 'type-fest';

type TT = Or<true, true>;
//=> true

type TF = Or<true, false>;
//=> true

type FT = Or<false, true>;
//=> true

type FF = Or<false, false>;
//=> false
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3geSgXzgMyghDgHIlUBafFAZxlIG4AoZitAFQ7gF45sAPDCgBXFABoEolAD4WAenk8ZUsa3ZwOAMV78oQ6ZPwBDADa1ZCpSuFq2yNFu59BJ8xNWXmi5Z-UO4LR0XfTcLIzMLOW9rAkiUIA)

Note: When `boolean` is passed as an argument, it is distributed into separate cases, and the final result is a union of those cases.
For example, `Or<false, boolean>` expands to `Or<false, true> | Or<false, false>`, which simplifies to `true | false` (i.e., `boolean`).

@example
```
import type {Or} from 'type-fest';

type A = Or<false, boolean>;
//=> boolean

type B = Or<boolean, false>;
//=> boolean

type C = Or<true, boolean>;
//=> true

type D = Or<boolean, true>;
//=> true

type E = Or<boolean, boolean>;
//=> boolean
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3geSgXzgMyghDgHIlUBafFAZxlIG4AoZitAQTgF45sAefAEMANrRQAaOACMIEESiEA7AHwsA9Ou4qZchctbs4AIR58o-WfMVKpwsSjXNN23dYNtkaAMJmBMKABXSTd9VQ0tHQDgwy84ABE-CyswqWjHCNd02NQ4AFEkyz0bKRSbJxcdMuUgA)

Note: If `never` is passed as an argument, it is treated as `false` and the result is computed accordingly.

@example
```
import type {Or} from 'type-fest';

type A = Or<true, never>;
//=> true

type B = Or<never, true>;
//=> true

type C = Or<false, never>;
//=> false

type D = Or<never, false>;
//=> false

type E = Or<boolean, never>;
//=> boolean

type F = Or<never, boolean>;
//=> boolean

type G = Or<never, never>;
//=> false
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3geSgXzgMyghDgHIlUBafFAZxlIG4AoZitAQTgF45sAeGFACuKADRwAdigBuKKAD4WAemXcFCESlbs4AIR58o-aXKgShopc1XrNoncjQBhQwPwBDADa1xU2fLWthqePtpsTnAAIm7GpvISob5BaiHevo6ocACisfwARhAQXigekhLxiiqpcIXFpZKZaABieZUSdSVlKXadDU1wAOJtAeb+Zj1pYUA)

@see {@link And}
@see {@link Xor}
*/
export type Or<A extends boolean, B extends boolean> =
	_Or<If<IsNever<A>, false, A>, If<IsNever<B>, false, B>>; // `never` is treated as `false`

export type _Or<A extends boolean, B extends boolean> = A extends true
	? true
	: B extends true
		? true
		: false;

export {};

import type {Not} from './internal/type.d.ts';
import type {And} from './and.d.ts';
import type {Or} from './or.d.ts';

/**
Returns a boolean for whether only one of two given types is true.

Use-case: Constructing complex conditional types where one single condition must be satisfied.

@example
```
import type {Xor} from 'type-fest';

type TT = Xor<true, true>;
//=> false

type TF = Xor<true, false>;
//=> true

type FT = Xor<false, true>;
//=> true

type FF = Xor<false, false>;
//=> false
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gDWgXzgMyghDgHIlUBafFAZxlIG4AoZitAFQ7gF45soAHhhQArigA0CMSgB8LAPQKesggEMANrRSt2cDgDFe-aMJlT8m7fOZKV08buRoD3PgMGWtkh3MXLVEUc2ZzgDI3dTL20LKz9bAPVvIA)

Note: When `boolean` is passed as an argument, it is distributed into separate cases, and the final result is a union of those cases.
For example, `Xor<false, boolean>` expands to `Xor<false, true> | Xor<false, false>`, which simplifies to `true | false` (i.e., `boolean`).

@example
```
import type {Xor} from 'type-fest';

type A = Xor<false, boolean>;
//=> boolean

type B = Xor<boolean, false>;
//=> boolean

type C = Xor<true, boolean>;
//=> boolean

type D = Xor<boolean, true>;
//=> boolean

type E = Xor<boolean, boolean>;
//=> boolean
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gDWgXzgMyghDgHIlUBafFAZxlIG4AoZitAQTgF45soAPPgCGAG1ooANHABGECKJTCAdgD4WAeg3dVs+YpWt2cAEI8+0AXIVLl0keJTrmWnXpuG2yNAGFz-ARgoAFcpdwM1TW1dawijbzgAEX9LWNtpINDnVxj9W3jUOABRFME0lWlyyJdo8NsgA)

Note: If `never` is passed as an argument, it is treated as `false` and the result is computed accordingly.

@example
```
import type {Xor} from 'type-fest';

type A = Xor<true, never>;
//=> true

type B = Xor<never, true>;
//=> true

type C = Xor<false, never>;
//=> false

type D = Xor<never, false>;
//=> false

type E = Xor<boolean, never>;
//=> boolean

type F = Xor<never, boolean>;
//=> boolean

type G = Xor<never, never>;
//=> false
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gDWgXzgMyghDgHIlUBafFAZxlIG4AoZitAQTgF45soAPDCgBXFABo4AOxQA3FFAB8LAPQruihKJSt2cAEI8+0ATPlRJwscuZqNWsbuRoAwkf4D8AQwA2tCdJyCjZ2mt5+OmzOcAAi7iZmCpLh-iHqYb7+TqhwAKLxggBGEBA+KF5SkolKqulwxaXlUtloAGIFpkEW9SVlFWn2DX3NUTkA4h3VVV0DGRFAA)

@see {@link And}
@see {@link Or}
*/
export type Xor<A extends boolean, B extends boolean> = And<Or<A, B>, Not<And<A, B>>>;

export {};

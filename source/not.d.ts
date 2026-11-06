import type {And} from './and.d.ts'; // For `@link`
import type {If} from './if.d.ts';
import type {Or} from './or.d.ts'; // For `@link`
import type {Xor} from './xor.d.ts'; // For `@link`

/**
Returns a boolean for whether the given type is `false`.

Use-case: Constructing complex conditional types where a condition must be negated.

@example
```
import type {Not} from 'type-fest';

type A = Not<true>;
//=> false

type B = Not<false>;
//=> true
```

@example
```
import type {IsAny, Not} from 'type-fest';

type IsNotAny<Value> = Not<IsAny<Value>>;

type A = IsNotAny<string>;
//=> true

type B = IsNotAny<any>;
//=> false
```

Note: When `boolean` or `any` is passed as an argument, it is distributed into separate cases, and the final result is a union of those cases.
For example, `Not<boolean>` expands to `Not<true> | Not<false>`, which simplifies to `true | false` (i.e., `boolean`).

@example
```
import type {Not} from 'type-fest';

type A = Not<boolean>;
//=> boolean

type B = Not<any>;
//=> boolean
```

Note: Like {@link And}, {@link Or}, and {@link Xor}, if `never` is passed as an argument, it is treated as `false` and the result is computed accordingly, so `Not<never>` is `true`.

@example
```
import type {Not} from 'type-fest';

type A = Not<never>;
//=> true
```

@see {@link If}
@see {@link And}
@see {@link Or}
@see {@link Xor}
*/
export type Not<A extends boolean> = If<A, false, true>;

export {};

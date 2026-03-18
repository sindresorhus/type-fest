import type {AllExtend} from './all-extend.d.ts';

/**
Returns a boolean for whether all of the given elements are `true`.

Use-cases:
- Check if all conditions in a list of booleans are met.

@example
```
import type {AndAll} from 'type-fest';

type TTT = AndAll<[true, true, true]>;
//=> true

type TTF = AndAll<[true, true, false]>;
//=> false

type TFT = AndAll<[true, false, true]>;
//=> false
```

Note: When `boolean` is passed as an element, it is distributed into separate cases, and the final result is a union of those cases.
For example, `AndAll<[true, boolean]>` expands to `AndAll<[true, true]> | AndAll<[true, false]>`, which simplifies to `true | false` (i.e., `boolean`).

```
import type {AndAll} from 'type-fest';

type A = AndAll<[true, boolean]>;
//=> boolean

type B = AndAll<[false, boolean]>;
//=> false
```

Note: If `never` is passed as an element, it is treated as `false` and the result is computed accordingly.
```
import type {AndAll} from 'type-fest';

type A = AndAll<[never, never, true]>;
//=> false

type B = AndAll<[never, never, false]>;
//=> false

type C = AndAll<[never, never, never]>;
//=> false

type D = AndAll<[never, never, boolean]>;
//=> false
```

Note: If `any` is passed as an element, it is treated as `boolean` and the result is computed accordingly.
```
import type {AndAll} from 'type-fest';

type A = AndAll<[false, any]>;
//=> false

type B = AndAll<[true, any]>;
//=> boolean
```

@see {@link And}
*/
export type AndAll<T extends readonly boolean[]> = AllExtend<T, true>;

export {};

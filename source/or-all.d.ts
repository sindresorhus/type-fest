import type {SomeExtend} from './some-extend.d.ts';

/**
Returns a boolean for whether any of the given elements is `true`.

Use-cases:
- Check if at least one condition in a list of booleans is met.

@example
```
import type {OrAll} from 'type-fest';

type FFT = OrAll<[false, false, true]>;
//=> true

type FFF = OrAll<[false, false, false]>;
//=> false
```

Note: When `boolean` is passed as an element, it is distributed into separate cases, and the final result is a union of those cases.
For example, `OrAll<[false, boolean]>` expands to `OrAll<[false, true]> | OrAll<[false, false]>`, which simplifies to `true | false` (i.e., `boolean`).

```
import type {OrAll} from 'type-fest';

type A = OrAll<[false, boolean]>;
//=> boolean

type B = OrAll<[true, boolean]>;
//=> true
```

Note: If `never` is passed as an element, it is treated as `false` and the result is computed accordingly.
```
import type {OrAll} from 'type-fest';

type A = OrAll<[never, never, true]>;
//=> true

type B = OrAll<[never, never, false]>;
//=> false

type C = OrAll<[never, never, never]>;
//=> false

type D = OrAll<[never, never, boolean]>;
//=> boolean
```

Note: If `any` is passed as an element, it is treated as `boolean` and the result is computed accordingly.
```
import type {OrAll} from 'type-fest';

type A = OrAll<[false, any]>;
//=> boolean

type B = OrAll<[true, any]>;
//=> true
```

@see {@link Or}
*/
export type OrAll<T extends readonly boolean[]> = SomeExtend<T, true>;

export {};

import type {SomeExtend} from './some-extend.d.ts';

/**
Returns a boolean for whether any of the given elements is `true`.

Use-cases:
- Check if at least one condition in a list of booleans is met.

@example
```
import type {OrMultiple} from 'type-fest';

type FFT = OrMultiple<[false, false, true]>;
//=> true

type FFF = OrMultiple<[false, false, false]>;
//=> false
```

Note: When `boolean` is passed as an element, it is distributed into separate cases, and the final result is a union of those cases.
For example, `OrMultiple<[false, boolean]>` expands to `OrMultiple<[false, true]> | OrMultiple<[false, false]>`, which simplifies to `true | false` (i.e., `boolean`).

```
import type {OrMultiple} from 'type-fest';

type A = OrMultiple<[false, boolean]>;
//=> boolean

type B = OrMultiple<[true, boolean]>;
//=> true
```

Note: If `never` is passed as an element, it is treated as `false` and the result is computed accordingly.
```
import type {OrMultiple} from 'type-fest';

type A = OrMultiple<[never, never, true]>;
//=> true

type B = OrMultiple<[never, never, false]>;
//=> false

type C = OrMultiple<[never, never, never]>;
//=> false

type D = OrMultiple<[never, never, boolean]>;
//=> boolean
```

Note: If `any` is passed as an element, it is treated as `boolean` and the result is computed accordingly.
```
import type {OrMultiple} from 'type-fest';

type A = OrMultiple<[false, any]>;
//=> boolean

type B = OrMultiple<[true, any]>;
//=> true
```
*/
export type OrMultiple<T extends readonly boolean[]> = SomeExtend<T, true>;

export {};

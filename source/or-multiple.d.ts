import type {SomeExtend} from './some-extend.d.ts';

/**
Returns a boolean for whether any of the given elements are `true`.

Use-cases:
- Check if at least one condition in a list of booleans is met.

@example
```
import type {OrMultiple} from 'type-fest';

type IsValid = OrMultiple<[false, true, false]>;
//=> true

type IsInvalid = OrMultiple<[false, false]>;
//=> false

type OnBooleanCase = OrMultiple<[true, boolean], false>;
//=> boolean
```
*/
export type OrMultiple<T extends readonly boolean[]> = SomeExtend<T, true>;

export {};

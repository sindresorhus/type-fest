import type {IterableElement} from './iterable-element';

/**
Provides all values for a constant array or tuple.

Use-case: This type is useful when working with constant arrays or tuples and you want to enforce type-safety with their values.

@example
```
import type {ArrayValues} from 'type-fest';

type values = ArrayValues<['a', 'b', 'c']>;
//=> 'a' | 'b' | 'c'

```

@category Array
*/
export type ArrayValues<Element extends readonly unknown[]> = IterableElement<Element>;

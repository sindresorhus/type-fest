import type {ArrayAt} from './array-at.d.ts';
import type {LastArrayElement} from './last-array-element.d.ts'; // For `@link`
import type {Tagged} from './tagged.d.ts'; // For `@link`
import type {UnknownArray} from './unknown-array.d.ts';

/**
Extract the type of the first element of an array.

Use-case: Defining the return type of functions that extract the first element of an array, for example [`lodash.head`](https://lodash.com/docs/4.17.15#head).

The result includes `undefined` if the array can be empty, matching `array[0]` and `array.at(0)` at runtime. If a rest element can come first, the result is a union of the rest element and the element after it. When an optional element comes before a rest element, the rest element cannot fill the first position, so `[1?, ...string[]]` yields `1 | undefined`.

Note: When a tuple with a leading rest element is also branded, for example with {@link Tagged}, the result is `unknown`, because the rest element split cannot see through the brand.

@example
```
import type {FirstArrayElement} from 'type-fest';

declare function firstOf<const V extends readonly unknown[]>(array: V): FirstArrayElement<V>;

const first = firstOf(['foo', 'bar']);
//=> 'foo'

type A = FirstArrayElement<[string?, number?]>;
//=> string | undefined

type B = FirstArrayElement<string[]>;
//=> string | undefined

type C = FirstArrayElement<[...string[], number]>;
//=> string | number

type D = FirstArrayElement<[]>;
//=> undefined
```

@see {@link LastArrayElement}
@see {@link ArrayAt}

@category Array
*/
// The conditional makes TypeScript report the constraint for a non-array input, which `ArrayAt` alone accepts silently.
export type FirstArrayElement<TArray extends UnknownArray> =
	TArray extends UnknownArray ? ArrayAt<TArray, 0> : never;

export {};

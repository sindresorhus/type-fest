/**
Represents a strictly empty array, the `[]` value.

@example
```
import type {EmptyArray} from 'type-fest';

const bar1: EmptyArray = []; // Pass
const bar2: EmptyArray = [1]; // Fail
const bar3: EmptyArray = {}; // Fail
```

@category Array
*/
export type EmptyArray = never[];

/**
Returns a `boolean` for whether the type is strictly equal to an empty array, the `[]` value.

@example
```
import type {IsEmptyArray} from 'type-fest';

type Pass = IsEmptyArray<[]>; //=> true
type Fail = IsEmptyArray<[1]>; //=> false
type Fail = IsEmptyArray<{}>; //=> false
```

@see EmptyArray
@category Array
*/
export type IsEmptyArray<T> = T extends EmptyArray ? true : false;

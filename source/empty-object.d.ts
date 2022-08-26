declare const emptyObjectSymbol: unique symbol;

/**
Represents a strictly empty object. In other words, this type accepts `{}` only.

@example
```
import type {EmptyObject} from 'type-fest';

let foo: EmptyObject = {};

foo = {}; // Pass

foo = []; // Error
foo = 42; // Error
foo = null; // Error
foo.bar = {}; // Error
```

@category Object
*/
export type EmptyObject = {[emptyObjectSymbol]?: never};

/**
Returns a `boolean` whether the type is strictly equal to `{}`.

@example
```
import type {IsEmptyObject} from 'type-fest';

type Pass = IsEmptyObject<{}>; // => true
type Fail = IsEmptyObject<[]>; // => false
type Fail = IsEmptyObject<null>; // => false
```

@see EmptyObject
@category Object
*/
export type IsEmptyObject<T> = T extends EmptyObject ? true : false;

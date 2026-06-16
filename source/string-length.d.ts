import type {StringToArray} from './string-to-array.d.ts';

/**
Returns the length of the given string.

@example
```
import type {StringLength} from 'type-fest';

type A = StringLength<'abcde'>;
//=> 5

type B = StringLength<'abcde' | 'fgh'>;
//=> 3 | 5
```

For non-literal strings, the result is `number` because the length of a non-literal string can be any number.

@example
```
import type {StringLength} from 'type-fest';

type A = StringLength<string>;
//=> number

type B = StringLength<Uppercase<string>>;
//=> number

type C = StringLength<`${string}abc`>;
//=> number
```

@category String
@category Template literal
*/
export type StringLength<S extends string> = StringToArray<S>['length'];

export {};

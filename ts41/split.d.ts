/**
Represents an array of strings split using a passed-in character or character set.

Use case: defining the return type of the `String.prototype.split` method.

@example
```
import {Split} from 'type-fest';

declare function split<S extends string, D extends string>(string: S, separator: D): Split<S, D>;

type Item = 'foo' | 'bar' | 'baz' | 'waldo';
const items = 'foo,bar,baz,waldo';
let array: Item[];

array = split(items, ',');
```
*/
export type Split<S extends string, D extends string> =
    S extends `${infer T}${D}${infer U}`
        ? [T, ...Split<U, D>]
        : [S];

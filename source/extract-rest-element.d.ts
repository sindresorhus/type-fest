import type {SplitOnRestElement} from './split-on-rest-element.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Extract the [`rest`](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types) element type from an array.

@example
```
import type {ExtractRestElement} from 'type-fest';

type T1 = ExtractRestElement<[number, ...string[], string, 'foo']>;
//=> string

type T2 = ExtractRestElement<[...boolean[], string]>;
//=> boolean

type T3 = ExtractRestElement<[...'foo'[], true]>;
//=> 'foo'

type T4 = ExtractRestElement<[number, string]>;
//=> never
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gUQB4ygQwGMYAlFAZxkwBsUQUA7GAXzgDMoIQ4ByJVALRsKMHgG4AUBP5oAKgEY4AXjg48RUiJp1GMADwBtBgFcQAIxRQANHAB09ylGAMA5gYC6Nx85c2ebCAgedwA+SQB6cKUQuG9XKRk4WQAmZVVcAmIySm16JkN7WzNA2nwGDy88H1CIqJjiiFKGBOQ5AGY0tUzNHNo8-QNC-0CeCoQoYxQaiUjo3gCgltQkgBZOjI1sqj7dQxNzS0qnV2nZmIYUADdLIA)

@see {@link ExcludeRestElement}
@see {@link SplitOnRestElement}
@category Array
*/
export type ExtractRestElement<T extends UnknownArray> = SplitOnRestElement<T>[1][number];

export {};

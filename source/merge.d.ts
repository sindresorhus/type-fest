import type {OmitIndexSignature} from './omit-index-signature.d.ts';
import type {PickIndexSignature} from './pick-index-signature.d.ts';
import type {Simplify} from './simplify.d.ts';

// Merges two objects without worrying about index signatures.
type SimpleMerge<Destination, Source> = {
	[Key in keyof Destination as Key extends keyof Source ? never : Key]: Destination[Key];
} & Source;

/**
Merge two types into a new type. Keys of the second type overrides keys of the first type.

@example
```
import type {Merge} from 'type-fest';

interface Foo {
	[x: string]: unknown;
	[x: number]: unknown;
	foo: string;
	bar: symbol;
}

type Bar = {
	[x: number]: number;
	[x: symbol]: unknown;
	bar: Date;
	baz: boolean;
};

export type FooBar = Merge<Foo, Bar>;
// => {
// 	[x: string]: unknown;
// 	[x: number]: number;
// 	[x: symbol]: unknown;
// 	foo: string;
// 	bar: Date;
// 	baz: boolean;
// }
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gWRVA5igXzgDMoIQ4ByJVAWmJQGcZKBuAKHeADsYdiAhgGM0AMQgQM7AJABtAB4AuOMyg9cAXWUBXbgGtuEAO7cOcpXG7aQAIxxa4ug8dMziE5avVmbAqJ8RbCAAbDgJOGjQAIT84AF4pc2UrW3tk6zsoMwUAoOCHJ0MTHz9lABEBPhKAL2UbCWCUAVcCDnYUeUhYBGQxCRioeLhsPBQAHnEIABo4AYA+DgB6Rfi5qWW4JJUYNW5NHX0i1w2tlMyHM5wlla3GQPr8g+di9hP3CE8d71eb3384CpVH6bXy1OD1EJNY4rAhAA)

@category Object
*/
export type Merge<Destination, Source> =
Simplify<
	SimpleMerge<PickIndexSignature<Destination>, PickIndexSignature<Source>>
	& SimpleMerge<OmitIndexSignature<Destination>, OmitIndexSignature<Source>>
>;

export {};

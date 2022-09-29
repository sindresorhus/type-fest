import type {OmitIndexSignature} from './omit-index-signature';
import type {PickIndexSignature} from './pick-index-signature';
import type {EnforceOptional} from './enforce-optional';

// Merges two objects without worrying about index signatures or optional keys.
type SimpleMerge<Destination, Source> = {
	[Key in keyof Destination | keyof Source]: Key extends keyof Source
		? Source[Key]
		: Key extends keyof Destination
			? Destination[Key]
			: never;
};

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

@category Object
*/
export type Merge<Destination, Source> = EnforceOptional<
SimpleMerge<PickIndexSignature<Destination>, PickIndexSignature<Source>>
& SimpleMerge<OmitIndexSignature<Destination>, OmitIndexSignature<Source>>>;

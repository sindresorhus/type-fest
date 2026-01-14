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

type Foo = {
	[x: string]: unknown;
	[x: number]: unknown;
	foo: string;
	bar: symbol;
};

type Bar = {
	[x: number]: number;
	[x: symbol]: unknown;
	bar: Date;
	baz: boolean;
};

export type FooBar = Merge<Foo, Bar>;
//=> {
// 	[x: string]: unknown;
// 	[x: number]: number;
// 	[x: symbol]: unknown;
// 	foo: string;
// 	bar: Date;
// 	baz: boolean;
// }
```

Note: If you want a merge type that more accurately reflects the runtime behavior of object spread or `Object.assign`, refer to the {@link ObjectMerge} type.

@see {@link ObjectMerge}
@category Object
*/
export type Merge<Destination, Source> =
Simplify<
	SimpleMerge<PickIndexSignature<Destination>, PickIndexSignature<Source>>
	& SimpleMerge<OmitIndexSignature<Destination>, OmitIndexSignature<Source>>
>;

export {};

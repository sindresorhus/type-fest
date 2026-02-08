/**
Create a type that makes the given keys nullable, where the remaining keys are kept as is.

If no keys are given, all keys will be made nullable.

Use-case: You want to define a single model where the only thing that changes is whether or not some or all of the keys are nullable.

@example
```
import type {SetNullable} from 'type-fest';

type Foo = {
	a: number;
	b: string;
	c?: boolean;
};

type SomeNullable = SetNullable<Foo, 'a' | 'c'>;
// type SomeNullable = {
// 	a: number | null;
// 	b: string;
// 	c?: boolean | null;
// }

type AllNullable = SetNullable<Foo>;
// type AllNullable = {
// 	a: number | null;
// 	b: string | null;
// 	c?: boolean | null;
// }
```

@see {@link SetNonNullable}

@category Object
*/
export type SetNullable<BaseType, Keys extends keyof BaseType = keyof BaseType> = {
	[Key in keyof BaseType]: Key extends Keys
		? BaseType[Key] | null
		: BaseType[Key];
};

export {};

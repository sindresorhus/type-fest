/**
Create a type that makes the given keys non-nullable, where the remaining keys are kept as is.

If no keys are given, all keys will be made non-nullable.

Use-case: You want to define a single model where the only thing that changes is whether or not some or all of the keys are non-nullable.

@example
```
import type {SetNonNullable} from 'type-fest';

type Foo = {
	a: number | null;
	b: string | undefined;
	c?: boolean | null;
};

type SomeNonNullable = SetNonNullable<Foo, 'b' | 'c'>;
//=> {
// 	a: number | null;
// 	b: string;
// 	c?: NonNullable<boolean | null | undefined>;
// }

type AllNonNullable = SetNonNullable<Foo>;
//=> {a: number; b: string; c?: NonNullable<boolean | null | undefined>}
```

@category Object
*/
export type SetNonNullable<BaseType, Keys extends keyof BaseType = keyof BaseType> = {
	[Key in keyof BaseType]: Key extends Keys
		? NonNullable<BaseType[Key]>
		: BaseType[Key];
};

export {};

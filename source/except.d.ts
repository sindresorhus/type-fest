/**
Create a type from an object type without certain keys.

This type is a stricter version of [`Omit`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-5.html#the-omit-helper-type). The `Omit` type does not restrict the omitted keys to be keys present on the given type, while `Except` does. The benefits of a stricter type are avoiding typos and allowing the compiler to pick up on rename refactors automatically.

This type was proposed to the TypeScript team, which declined it, saying they prefer that libraries implement stricter versions of the built-in types ([microsoft/TypeScript#30825](https://github.com/microsoft/TypeScript/issues/30825#issuecomment-523668235)).

@example
```
import {Except} from 'type-fest';

type Foo = {
	a: number;
	b: string;
	c: boolean;
};

type FooWithoutA = Except<Foo, 'a' | 'c'>;
//=> {b: string};
```

@category Utilities
*/

type EqualsTest<T> = <A>() => A extends T ? 1 : 0;
type Equals<A1, A2> = EqualsTest<A2> extends EqualsTest<A1> ? 1 : 0;

type Filter<K, I> = Equals<K, I> extends 1 ? never : (K extends I ? never : K);

export type Except<T, I> = {
	[K in keyof T as Filter<K, I>]: T[K];
};

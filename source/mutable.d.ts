/**
Convert an object with `readonly` keys into a mutable object. Inverse of `Readonly<T>`.
Alternatively create a type that converts the given keys from `readonly` to mutable. The remaining keys are kept as is.

This can be used to [store and mutate options within a class](https://github.com/sindresorhus/pageres/blob/4a5d05fca19a5fbd2f53842cbf3eb7b1b63bddd2/source/index.ts#L72), [edit `readonly` objects within tests](https://stackoverflow.com/questions/50703834), and [construct a `readonly` object within a function](https://github.com/Microsoft/TypeScript/issues/24509) or to define a single model where the only thing that changes is whether or not some of the keys are mutable.

@example
```
import {Mutable} from 'type-fest';

type Foo = {
	readonly a: number;
    readonly b: readonly string[]; // To show that only the mutability status of the properties, not their values, are affected
    readonly c: boolean;
};

const mutableFoo: Mutable<Foo> = {a: 1, b: ['2']};
mutableFoo.a = 3;
mutableFoo.b[0] = 'new value'; // -> Will still fail as the value of property "b" is still a readonly type
mutableFoo.b = ['something']; // -> Will work as the "b" property itself is no longer readonly

type SomeMutable = Mutable<Foo, 'b' | 'c'>;
// type SomeMutable = {
// 	readonly a: number;
// 	b: readonly string[]; // Is now mutable, type of the property remains unaffected.
// 	c: boolean; // Is now mutable.
// }
```
*/
export type Mutable<BaseType, Keys extends keyof BaseType = keyof BaseType> =
	Simplify<
		// Pick just the keys that are not mutable from the base type.
		Except<BaseType, Keys> &
        // Pick the keys that should be mutable from the base type and make them mutable by removing the `readonly` modifier from the key.
        {-readonly [KeyType in keyof Pick<BaseType, Keys>]: Pick<BaseType, Keys>[KeyType]}
	>;

/**
Convert an object with `readonly` keys into a mutable object. Inverse of `Readonly<T>`.

This can be used to [store and mutate options within a class](https://github.com/sindresorhus/pageres/blob/4a5d05fca19a5fbd2f53842cbf3eb7b1b63bddd2/source/index.ts#L72), [edit `readonly` objects within tests](https://stackoverflow.com/questions/50703834), and [construct a `readonly` object within a function](https://github.com/Microsoft/TypeScript/issues/24509).

@see [`SetMutable`](source/set-mutable.d.ts) – a type that can selectively set some keys as mutable.

@example
```
import {Mutable} from 'type-fest';

type Foo = {
	readonly a: number;
	readonly b: readonly string[];
};

const mutableFoo: Mutable<Foo> = {a: 1, b: ['2']};
mutableFoo.a = 3;
// Type of the property remains unaffected
mutableFoo.b[0] = '3'; // -> Error: Index signature in type 'readonly string[]' only permits reading.ts(2542).
mutableFoo.b = ['3'];
```
*/
export type Mutable<ObjectType> = {
	// For each `Key` in the keys of `ObjectType`, make a mapped type by removing the `readonly` modifier from the key.
	-readonly [KeyType in keyof ObjectType]: ObjectType[KeyType];
};

import type {IsNever} from './is-never.d.ts';
import type {LastOfUnion} from './internal/index.d.ts';

/**
Convert a union type into an unordered tuple type of its elements.

"Unordered" means the elements of the tuple are not guaranteed to be in the same order as in the union type. The arrangement can appear random and may change at any time.

This can be useful when you have objects with a finite set of keys and want a type defining only the allowed keys, but do not want to repeat yourself.

@example
```
import type {UnionToTuple} from 'type-fest';

type Numbers = 1 | 2 | 3;
type NumbersTuple = UnionToTuple<Numbers>;
//=> [1, 2, 3]
```

@example
```
import type {UnionToTuple} from 'type-fest';

const pets = {
	dog: '🐶',
	cat: '🐱',
	snake: '🐍',
};

type Pet = keyof typeof pets;
//=> 'dog' | 'cat' | 'snake'

const petList = Object.keys(pets) as UnionToTuple<Pet>;
//=> ['dog', 'cat', 'snake']
```

@category Array
*/
export type UnionToTuple<T> = _UnionToTuple<T>;

type _UnionToTuple<T, L = LastOfUnion<T>> =
	IsNever<T> extends false
		? [..._UnionToTuple<Exclude<T, L>>, L]
		: [];

export {};

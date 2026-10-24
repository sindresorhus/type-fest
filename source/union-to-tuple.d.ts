import type {IsEqual} from './is-equal.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {TupleToUnion} from './tuple-to-union.d.ts'; // For `@link`
import type {UnionMember} from './union-member.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Convert a union type into an unordered tuple type of its elements.

"Unordered" means the elements of the tuple are not guaranteed to be in the same order as in the union type. The arrangement can appear random and may change at any time.

Because of this, it cannot be used to make sure a hand-written array lists every member of the union. For that, define the array first and derive the union with {@link TupleToUnion}, or list the members as object keys with `satisfies Record<Union, true>` and use `Object.keys()`.

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

@see {@link TupleToUnion}

@category Array
*/
export type UnionToTuple<Union> =
	_UnionToTuple<Union> extends infer Result extends UnknownArray ? Result : never; // Nudges the compiler that `UnionToTuple` always yields an array.

type _UnionToTuple<Union, Accumulator extends UnknownArray = [], Member = UnionMember<Union>> =
	IsNever<Union> extends true
		? Accumulator
		: _UnionToTuple<
			// `Member` is already selected; exact comparison keeps structurally covering members distinct.
			Union extends unknown ? IsEqual<Union, Member> extends true ? never : Union : never,
			[Member, ...Accumulator]
		>;

export {};

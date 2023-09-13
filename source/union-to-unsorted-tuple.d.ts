import type {UnionToIntersection} from './union-to-intersection';

/**
 Convert a union type into a unsorted tuple/array type of its elements.

 This can be useful when you have objects with a finite set of keys and want a type defining only the allowed keys, but do not want to repeat yourself.

 @example
 ```
 const pets = {
   dog: '🐶',
   cat: '🐱',
   snake: '🐍',
 };

 type Pet = keyof typeof pets;
 //=> "dog" | "cat" | "snake"

 const petList = Object.keys(pets) as UnionToUnsortedTuple<Pet>;
 //=> ["dog", "cat", "snake"]
 ```

 @category Array
 */

export type UnionToUnsortedTuple<Tuple> = UnionToIntersection<
Tuple extends never ? never : (_: Tuple) => Tuple
> extends (_: never) => infer LastTupleElement
	? [...UnionToUnsortedTuple<Exclude<Tuple, LastTupleElement>>, LastTupleElement]
	: [];

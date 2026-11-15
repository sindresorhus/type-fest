import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Pair the elements at matching positions in two arrays.

Use-case: Keep the relationship between parallel tuples, such as field names and their types.

Fixed tuples stop at the shorter input. Arrays and rest tuples produce an array of pairs. Optional tuple elements are unsupported and give `never`. If either input is readonly, the result and its pairs are readonly; otherwise both are mutable.

Tuple intersections with brands or extra properties are unsupported.

Distributes over unions of either input. Returns `any` if either input is `any`; otherwise returns `never` if either input is `never`.

@example
```
import type {ArrayZip} from 'type-fest';

type Fields = ArrayZip<['name', 'age'], [string, number]>;
//=> [['name', string], ['age', number]]

type Shorter = ArrayZip<[1, 2, 3], ['a', 'b']>;
//=> [[1, 'a'], [2, 'b']]
```

The shorter tuple supplies the result's positions, with each position pairing elements at the same index.

@category Array
*/
export type ArrayZip<First extends UnknownArray, Second extends UnknownArray> = IfNotAnyOrNever<First | Second, {
	ifNot: First extends unknown
		? Second extends unknown
			? [First, Second] extends [Required<First>, Required<Second>]
				? Zip<First, Second> extends infer Result extends UnknownArray
					? [First, Second] extends [unknown[], unknown[]] ? Result : ReadonlyPairs<Result>
					: never
				: never
			: never
		: never;
}>;

/**
Makes the outer array and each generated pair readonly without changing the elements themselves.
*/
type ReadonlyPairs<Pairs extends UnknownArray> = Readonly<{[Index in keyof Pairs]: Readonly<Pairs[Index]>}>;

/**
Pairs fixed positions and widens inputs of unknown length.

The first tuple is shorter when the second has an element at the first tuple's length. Mapping the shorter tuple avoids repeated tail inference and accumulator copies.
*/
type Zip<First extends UnknownArray, Second extends UnknownArray, Shorter extends UnknownArray = `${First['length']}` extends keyof Second ? First : Second> = First extends readonly []
	? []
	: Second extends readonly []
		? []
		: number extends First['length'] | Second['length']
			? Array<[First[number], Second[number]]>
			: {-readonly [Index in keyof Shorter]: Index extends keyof First & keyof Second ? [First[Index], Second[Index]] : never};

export {};

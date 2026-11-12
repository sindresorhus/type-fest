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

The tuples are consumed together, appending one pair at a time.

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
*/
type Zip<First extends UnknownArray, Second extends UnknownArray, Result extends unknown[] = []> = First extends readonly []
	? Result
	: Second extends readonly []
		? Result
		: number extends First['length'] | Second['length']
			? Array<[First[number], Second[number]]>
			: First extends readonly [infer FirstItem, ...infer FirstRest]
				? Second extends readonly [infer SecondItem, ...infer SecondRest]
					? Zip<FirstRest, SecondRest, [...Result, [FirstItem, SecondItem]]>
					: never
				: never;

export {};

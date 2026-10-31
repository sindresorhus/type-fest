import type {If} from './if.d.ts';
import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {IsArrayReadonly} from './internal/array.d.ts';
import type {TupleOf} from './tuple-of.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {ArrayIndices} from './array-indices.d.ts'; // For `@link`

/**
Create a tuple type of the indices of a constant array or tuple.

Use-cases:
- Type a value that lists every index of a tuple.
- Pair each element of a dense tuple with its literal index in a mapped type.

@example
```
import type {IndexTuple} from 'type-fest';

type FruitIndices = IndexTuple<['apple', 'banana', 'plum']>;
//=> [0, 1, 2]

type FruitIndex = FruitIndices[number];
//=> 0 | 1 | 2
```

@example
```
import type {IndexTuple} from 'type-fest';

const values = ['a', 'b', 'c'] as const;

const positions: IndexTuple<typeof values> = [0, 1, 2];
```

@example
```
import type {IndexTuple, UnknownArray} from 'type-fest';

type Positioned<Tuple extends UnknownArray> = {
	[Index in keyof Tuple]: [IndexTuple<Tuple>[Index & keyof IndexTuple<Tuple>], Tuple[Index]];
};

type FruitPositions = Positioned<['apple', 'banana', 'plum']>;
//=> [[0, 'apple'], [1, 'banana'], [2, 'plum']]
```

Note: The `Positioned` pattern above is only valid for a dense tuple. A tuple with optional elements gives a union of tuples, and indexing that union can pair an element with an index where it cannot appear.

Note: A variable-length array has no fixed length, so the result is `number[]` (or `readonly number[]`).

@example
```
import type {IndexTuple} from 'type-fest';

type AnyIndices = IndexTuple<string[]>;
//=> number[]
```

Note: A tuple with optional elements and no rest element gives a union of tuples, one per possible length.

@example
```
import type {IndexTuple} from 'type-fest';

type PartialIndices = IndexTuple<[string, number?]>;
//=> [0] | [0, 1]
```

Note: When the tuple's length is the non-literal `number` type (for example, it contains `...number[]`), the result is `number[]` instead of a tuple.

@example
```
import type {IndexTuple} from 'type-fest';

type RestIndices = IndexTuple<[string, ...number[]]>;
//=> number[]
```

Note: A readonly tuple or array gives a readonly result. A type that is not assignable to a mutable array, such as `FixedLengthArray`, also gives a readonly result.

@example
```
import type {IndexTuple} from 'type-fest';

type ReadonlyIndices = IndexTuple<readonly ['a', 'b']>;
//=> readonly [0, 1]
```

`IndexTuple` builds a tuple with `Element['length']` positions using `{@link TupleOf}`, then maps each position to its numeric index. A non-literal `number` length gives an array, and a union length gives a union of tuples.

@see {@link ArrayIndices} for the union of valid indices

@category Array
*/
export type IndexTuple<Element extends UnknownArray> = IfNotAnyOrNever<Element, {
	ifNot: Element extends unknown // For distributing `Element`
		? IndicesOfTuple<TupleOf<Element['length']>> extends infer Result
			? If<IsArrayReadonly<Element>, Readonly<Result>, Result>
			: never // Should never happen
		: never; // Should never happen
	ifAny: number[];
}>;

/**
Maps each key of a tuple to its numeric literal index, and an array's numeric index to `number`, so the result keeps the input's shape.
*/
type IndicesOfTuple<Tuple extends UnknownArray> = {
	[Key in keyof Tuple]: Key extends `${infer Index extends number}` ? Index : number;
};

export {};

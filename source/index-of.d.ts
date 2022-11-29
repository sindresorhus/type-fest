import type {Indices} from '../index';

/**
Create an index union from an array or tuple type.

@example
```
type FruitIndices = IndexOf<['apple', 'banana', 'plum']> // 0 | 1 | 2
```

@category Array
@category Utility
*/
export type IndexOf<Tuple extends unknown[] | readonly unknown[]> =
	Indices<Tuple> extends infer IndicesTuple extends number[]
		? IndicesTuple[number]
		: never;

import type {UnknownArray} from './unknown-array.d.ts';

type ConditionalReadonly<
	ArrayLike extends UnknownArray,
	IsReadonly extends boolean,
> = IsReadonly extends true ? Readonly<ArrayLike> : ArrayLike;

type ExcludeFromArray<ArrayLike extends UnknownArray, ExcludeConditions> =
	ArrayLike extends Array<infer Union>
		? Array<Exclude<Union, ExcludeConditions>>
		: never;
/**
Exclude types from the source array based on the supplied exclude conditions.
The source array can be an ordinary array, a readonly array or a tuple.

@example
```
import type {ArrayExclude} from 'type-fest';

type OrdinaryArray = ArrayExclude<Array<string | number | boolean>, string | boolean>;
//=> number[]

type ReadonlyArray = ArrayExclude<readonly ['literalValue', 1, 2, 3, {readonly prop: 'prop'}, true], string | 2 | Record<string, unknown>>;
//=> readonly [1, 3, true]

type Tuple = ArrayExclude<['literalValue', 1, 2, 3, {prop: 'prop'}, true], string | 2 | Record<string, unknown>>;
//=> [1, 3, true]
```
Notes:
	- If the provided conditions filter out all elements from the source array, a `never[]` type is returned.
	- If `never` is provided as the exclude condition, then the original type will be returned.
	- If a tuple or readonly array has elements that are defined as `boolean`
	(i.e. not narrowed as `true` or `false`) this will result in a discriminative
	union return. For example, an `ArrayExclude<[number, boolean], number>` will result in
	a `[true]|[false]` type.

@category Array
 */
export type ArrayExclude<
	ArrayLike extends UnknownArray,
	ExcludeConditions,
	FilteredTuple extends UnknownArray = [],
	IsReadonly extends boolean = ArrayLike extends unknown[] ? false : true,
> = ArrayLike extends
| Readonly<[infer First, ...infer Rest]>
| [infer First, ...infer Rest]
	? Rest extends []
		? ConditionalReadonly<
			First extends ExcludeConditions
				? FilteredTuple extends [] ? never[] : FilteredTuple
				: [...FilteredTuple, First],
			IsReadonly
		>
		:
		ArrayExclude<Rest, ExcludeConditions, First extends ExcludeConditions ? FilteredTuple : [...FilteredTuple, First], IsReadonly>

	: ExcludeFromArray<ArrayLike, ExcludeConditions>;
export { };

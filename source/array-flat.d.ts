import type {If} from './if.d.ts';
import type {IfNotAnyOrNever, IsExactOptionalPropertyTypesEnabled} from './internal/type.d.ts';
import type {LessThan} from './less-than.d.ts';
import type {SplitOnRestElement} from './split-on-rest-element.d.ts';
import type {Subtract} from './subtract.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Flatten an array type to the given depth, like [`Array#flat()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat).

Unlike the built-in `FlatArray` type, which only gives the element type, this keeps the position of each element of a tuple. Elements that can repeat or be absent, which are those of a rest element or of an optional element, are merged into a single rest element. The result is mutable, like the array `Array#flat()` returns.

Use-case: Type the result of `array.flat()` on a tuple.

@example
```
import type {ArrayFlat, PositiveInfinity} from 'type-fest';

type A = ArrayFlat<[[1, 2], [3, [4]]]>;
//=> [1, 2, 3, [4]]

type B = ArrayFlat<[[1, 2], [3, [4]]], 2>;
//=> [1, 2, 3, 4]

type C = ArrayFlat<[1, [2, [3, [4]]]], PositiveInfinity>;
//=> [1, 2, 3, 4]

type D = ArrayFlat<['a', number[], 'b']>;
//=> ['a', ...number[], 'b']

type E = ArrayFlat<Array<[number, string]>>;
//=> (string | number)[]
```

Note: The depth must be an integer. A depth below 1, like `0` or `-1`, does not flatten, just like `Array#flat()`. A depth of type `number` gives the same type as the built-in `Array#flat()`. Flattening more than about 20 levels of nesting is not supported.

Note: An `object` or `{}` element is kept as one element even though it could be an array, like the built-in `Array#flat()` does. An `any` or `unknown` element becomes a rest element.

@category Array
*/
export type ArrayFlat<Array_ extends UnknownArray, Depth extends number = 1> = IfNotAnyOrNever<Array_, {
	ifNot: Array_ extends unknown // For distributing `Array_`
		? number extends Depth
			? Array<FlatArray<Array_, Depth>>
			: Depth extends unknown // For distributing `Depth`
				? LessThan<Depth, 1> extends true
					? [...Array_]
					// Inferring the result with an array constraint lets TypeScript use that constraint for a generic `Array_`, instead of expanding the recursion without end.
					: SpreadElements<Array_, Subtract<Depth, 1>> extends infer Result extends unknown[]
						? Result
						: never // Should never happen
				: never // Should never happen
		: never; // Should never happen
}>;

/**
The elements of the given array, with each element that is an array spread into its own elements. `Depth` is the number of levels to flatten after that: `0` spreads the elements once, and a negative depth keeps them as they are.

The elements before and after the rest element keep their positions. The rest element is flattened into a single rest element. When a flattened element has a rest element of its own, TypeScript merges it with any later rest element, so the elements in between keep their types but lose their positions.
*/
type SpreadElements<Array_ extends UnknownArray, Depth extends number> =
	SplitOnRestElement<Array_> extends readonly [infer BeforeRest extends UnknownArray, infer Rest extends UnknownArray, infer AfterRest extends UnknownArray]
		// The recursive results are inferred before they are spread, because spreading them directly makes TypeScript expand the recursion without end when checking this type.
		? [
			SpreadTupleElements<BeforeRest, Depth>,
			Rest extends readonly []
				? []
				: FlattenElement<Rest[number], Depth> extends infer RestElements extends UnknownArray
					? Array<RestElements[number]>
					: never, // Should never happen
			SpreadTupleElements<AfterRest, Depth>,
		] extends [infer Before extends UnknownArray, infer RestElements extends UnknownArray, infer After extends UnknownArray]
			? [...Before, ...RestElements, ...After]
			: never // Should never happen
		: never; // Should never happen

/**
The elements of the given tuple without a rest element, each one flattened to the given depth.
*/
type SpreadTupleElements<Tuple extends UnknownArray, Depth extends number, Accumulator extends UnknownArray = []> =
	Tuple extends readonly []
		? Accumulator
		: Tuple extends readonly [(infer First)?, ...infer Rest]
			? (
				Tuple extends readonly [unknown, ...unknown[]]
					? FlattenElement<First, Depth>
					// An optional element can be absent, so it becomes a rest element. Keeping it optional would be wrong when a required element follows it in the result, because TypeScript would then make the optional element required.
					: FlattenElement<First | If<IsExactOptionalPropertyTypesEnabled, never, undefined>, Depth> extends infer OptionalElements extends UnknownArray
						? Array<OptionalElements[number]>
						: never // Should never happen
			) extends infer Elements extends UnknownArray
				? SpreadTupleElements<Rest, Depth, [...Accumulator, ...Elements]>
				: never // Should never happen
			: never; // Should never happen

/**
A single element as a tuple: an array is spread into its elements if `Depth` is not negative, and anything else is kept as it is.
*/
type FlattenElement<Element, Depth extends number> =
	// `never` would remove the whole result, so it is kept as it is.
	[Element] extends [never]
		? [Element]
		: LessThan<Depth, 0> extends true
			? [Element]
			// `any` and `unknown` can be an array of any length, so they become a rest element.
			: unknown extends Element
				? Element[]
				// The members that are not arrays are kept together, so that a union such as `boolean` does not split the result into one tuple per member.
				: ([Exclude<Element, UnknownArray>] extends [never] ? never : [Exclude<Element, UnknownArray>])
					| (Element extends UnknownArray // For distributing the arrays in `Element`
						? SpreadElements<Element, Subtract<Depth, 1>>
						: never);

export {};

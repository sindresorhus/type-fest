import type {TupleOf} from './tuple-of.d.ts';

/**
Methods to exclude.
*/
type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift';

/**
Create a type that represents an array of the given type and length. The `Array` prototype methods that manipulate its length are excluded from the resulting type.

The problem with the built-in tuple type is that it allows mutating methods like `push`, `pop` etc, which can cause issues, like in the following example:

@example
```
const color: [number, number, number] = [255, 128, 64];

function toHex([r, g, b]: readonly [number, number, number]) {
	return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
}

color.pop(); // Allowed

console.log(toHex(color)); // Compiles fine, but fails at runtime since index `2` no longer contains a `number`.
```

`ArrayLengthMutationKeys` solves this problem by excluding methods like `push`, `pop` etc from the resulting type.

@example
```
import type {FixedLengthArray} from 'type-fest';

const color: FixedLengthArray<number, 3> = [255, 128, 64];

// @ts-expect-error
color.pop();
// Error: Property 'pop' does not exist on type 'FixedLengthArray<number, 3>'.
```

Use-cases:
- Declaring fixed-length tuples or arrays with a large number of items.
- Creating an array of coordinates with a static length, for example, length of 3 for a 3D vector.

@example
```
import type {FixedLengthArray} from 'type-fest';

let color: FixedLengthArray<number, 3> = [255, 128, 64];

const red = color[0];
//=> number
const green = color[1];
//=> number
const blue = color[2];
//=> number

// @ts-expect-error
const alpha = color[3];
// Error: Property '3' does not exist on type 'FixedLengthArray<number, 3>'.

// You can write to valid indices.
color[0] = 128;
color[1] = 64;
color[2] = 32;

// But you cannot write to out-of-bounds indices.
// @ts-expect-error
color[3] = 0.5;
// Error: Property '3' does not exist on type 'FixedLengthArray<number, 3>'.

// @ts-expect-error
color.push(0.5);
// Error: Property 'push' does not exist on type 'FixedLengthArray<number, 3>'.

// @ts-expect-error
color = [0, 128, 255, 0.5];
// Error: Type '[number, number, number, number]' is not assignable to type 'FixedLengthArray<number, 3>'. Types of property 'length' are incompatible.

// @ts-expect-error
color.length = 4;
// Error: Cannot assign to 'length' because it is a read-only property.

function toHex([r, g, b]: readonly [number, number, number]) {
	return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
}

console.log(toHex(color)); // `FixedLengthArray<number, 3>` is assignable to `readonly [number, number, number]`.
```

Note: A non-literal length, such as `number` or `any`, gives `never`, because the length is not known and so the array is not fixed. A `never` length is an exception and gives an empty tuple.

@example
```
import type {FixedLengthArray} from 'type-fest';

type NotFixed = FixedLengthArray<string, number>;
//=> never
```

Note: TypeScript cannot infer a literal `Length` from a `FixedLengthArray` value, so a generic helper must specify `Length` explicitly.

@example
```
import type {FixedLengthArray} from 'type-fest';

declare function getFirstItem<Item, Length extends number>(values: FixedLengthArray<Item, Length>): Item;

const rgb: FixedLengthArray<number, 3> = [255, 128, 64];

// @ts-expect-error `Length` is inferred as `number`, which is not a literal.
getFirstItem(rgb);

const red = getFirstItem<number, 3>(rgb);
//=> number
```

Note: Indexing with a non-literal `number` is not allowed, since the index could be out of bounds. Use `for...of`, `.entries()`, or another array method to go through the items.

@example
```
import type {FixedLengthArray} from 'type-fest';

const color: FixedLengthArray<number, 3> = [255, 128, 64];

declare const randomIndex: number;

// @ts-expect-error
const item = color[randomIndex];
// Error: Element implicitly has an 'any' type because expression of type 'number' can't be used to index type 'FixedLengthArray<number, 3>'.

for (const [index, value] of color.entries()) {
	console.log(index, value);
}
```

Note: Spreading the array into an array literal results in `any[]`. TypeScript reads the element type from the `number` index signature, which the type does not have. Use `Array.from()` or `.slice()` to copy it instead.

@example
```
import type {FixedLengthArray} from 'type-fest';

const color: FixedLengthArray<number, 3> = [255, 128, 64];

const copy = [...color];
//=> any[]
```

@category Array
*/
export type FixedLengthArray<Element, Length extends number> = _FixedLengthArray<TupleOf<Length, Element>>;

type _FixedLengthArray<Tuple extends unknown[]> = Tuple extends unknown // Keep each tuple's indices paired with its length so that checking `length` narrows a union.
	// `TupleOf` gives a plain array for a non-literal length, also when a brand is unwrapped, so only a real tuple describes a fixed length.
	? number extends Tuple['length']
		? never
		// Read the length back off the built tuple so it stays consistent with the actual elements. `TupleOf` ignores a decimal part and turns a negative length into an empty tuple.
		: Omit<Tuple, ArrayLengthMutationKeys | number | 'length'>
			& {readonly length: Tuple['length']}
	: never; // Should never happen

export {};

import type {Except} from './except.d.ts';
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
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/MYewdgzgLgBKA2IBOAuGBtMBXAtgIwFMkAaGbfI08wpAXRgF4MAmAVldIEZmAOUgNgAstANwAoMQDMsYYFACW4GFBAAJAgA8AFOhIwA5qTy00SAgEMAJuHgBPDNUplcNKi6K0AlDADeYgJBmUFhIYDAABgDEACQ+SAB0KgDKUEjyYPpanPyeAL6x+okgKWkZWTn5PnhFJemZ2Xnh4rkSCMjxAA4gHVqeIjAA9AMwAILwiADuBJat4BAg8ATxiJkq6tptSJ59g8MAwiA4HfKLEDCS6QRGWLCS5idn5rBIMgo4BDAQ6cAf6ZaaEWY4TIIBgiAyRDg4Cg90gMHMEUcSHC8SAA)

`ArrayLengthMutationKeys` solves this problem by excluding methods like `push`, `pop` etc from the resulting type.

@example
```
import type {FixedLengthArray} from 'type-fest';

const color: FixedLengthArray<number, 3> = [255, 128, 64];

// @ts-expect-error
color.pop();
//=> Error: Property 'pop' does not exist on type 'FixedLengthArray<number, 3>'.
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gMWADxQEwBkUA7AcxgAsBBKKAQ0QF84AzKCEOAciVQFpWKAM4xuAbgBQkgMYQSouHIA20AFxxseIqQo06jADwkAriABGKKABo4AZgB8cALxwA2gCYArF9sBGDwAOWwA2ABYAXSlJAHoYuAABGGF+FBxUGRhUumhZCFUoADpIMAAKAEopOOcnAFEcqA0ABQ5UWEQeEu44fAgROBIIeDTgRXkEZDRuLQJicipaBkRjM0sbewduQqA)

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
//=> Error: Property '3' does not exist on type 'FixedLengthArray<number, 3>'.

// You can write to valid indices.
color[0] = 128;
color[1] = 64;
color[2] = 32;

// But you cannot write to out-of-bounds indices.
// @ts-expect-error
color[3] = 0.5;
//=> Error: Property '3' does not exist on type 'FixedLengthArray<number, 3>'.

// @ts-expect-error
color.push(0.5);
//=> Error: Property 'push' does not exist on type 'FixedLengthArray<number, 3>'.

// @ts-expect-error
color = [0, 128, 255, 0.5];
//=> Error: Type '[number, number, number, number]' is not assignable to type 'FixedLengthArray<number, 3>'. Types of property 'length' are incompatible.

// @ts-expect-error
color.length = 4;
//=> Error: Cannot assign to 'length' because it is a read-only property.

function toHex([r, g, b]: readonly [number, number, number]) {
	return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
}

console.log(toHex(color)); // `FixedLengthArray<number, 3>` is assignable to `readonly [number, number, number]`.
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gMWADxQEwBkUA7AcxgAsBBKKAQ0QF84AzKCEOAciVQFpWKAM4xuAbgBQkgDYp4AYwgzoALjjY8RUhRp1GAHhIBXEACMUUADRwAzAD44AXjgBtAEwBWTzYCM7gA4bADYAFgBdKUklElE4KAJnOCUVKFcABkjJAHpsp0cTc0toiFj4MgTSJJToV18s3Py4QosoErK4MxljNBcatPcGvILTVulcuAABGGF+FBxUBRg5umh2uPoZMEp6auVa2yGmgFFVqHUABQ5UWEQeW244fAgRZoh4eeA40oRkNG5NARiOQqLQGIgjKNLDYHNwAHTjbJwACaEGMyXoJDgAHcoMAYGgYBA4AA3TbAfBwYAkfDABQiBH9DLhJL+AJSJn1JJhDn7AYsly2dxRCYAIWM8EQaIxJBI7xxeIJCGJaOWEFY-DMaJpwipNLpDJySOms3mi2Wlg4bSZhyS6ThnikjUcpytl2uliQ90ez1eco+OC+8B+fH+gO0IL04MhRWsdns8MRUxmcwWKCWKytJVScLAxmElAAFPbPABKJ3DOCutRwK4QG5e7h5gs+l66-1wT7fLGhnjh4G6MGGFrQ+OJo3J01pjOWtb9JIZPyBGxeHxwEtHF1ndQAFT+PFcI7jR5sJ+aUKg4UeXze8HowmEwDIJHoXUJxN7ANwQJ0oP0ELPWE4TgPdUF1dU4DAD1bh4ORI0eegEj1JRwHoGBgDfBEJxNVNzUzOc+ThODdCSUIKxObc4AAYUxDt70fZ9lVg39KEeCwFHofM0HxKldV2BJ6HwfhShkO4oPrT1ECw1hjBIJZgBDCAAAl5kLVw4zIGwzHCdQBOeEhRLcM9jIvcJSwwSQAEgEhgYwoCxAADABiAASdAoDhIkAGUYDxchC18YJSyYNyyE8iAfL8sgAqCkL0DMcLIupaLAuChypCYaQYmEZQUCIiBoqJFScELfpS3LOAJgc-sWKHACLxhewHN4uB6KfF83yYhy9JEu5Dwa89Y1PUyHLhIA)

@category Array
*/
export type FixedLengthArray<Element, Length extends number> =
	Except<TupleOf<Length, Element>, ArrayLengthMutationKeys | number | 'length'>
	& {readonly length: Length}
	& (number extends Length ? {[n: number]: Element} : {}); // Add `number` index signature only for non-tuple arrays.

export {};

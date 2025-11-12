/**
Tries to find the type of a global with the given name.

Limitations: Due to peculiarities with the behavior of `globalThis`, "globally defined" only includes `var` declarations in `declare global` blocks, not `let` or `const` declarations.

@example
```
import type {FindGlobalType} from 'type-fest';

declare global {
	const foo: number; // let and const don't work
	var bar: string;   // var works
}

type FooType = FindGlobalType<'foo'>     //=> never (let/const don't work)
type BarType = FindGlobalType<'bar'>     //=> string
type OtherType = FindGlobalType<'other'> //=> never (no global named 'other')
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gMWAOwCYDiANhAEYCGRAKsigL5wBmUEIcA5EqgLSMoDOMdgG4AUKLwoAxkXJQ0AcxIUiGUQEgpEHIKYQIALjg4AriFIoowuAHobcIinjl8cLTvh5tnOAHdoANYaAG5ycBRQRoJQuArWcLb2oVB+gfyidOJcaJj6NKhwALxw2PjEZJT5KAA87Iz67AB8CS12hc04KMGWcAAUjjA27rpeOD7+UAEAlKLZcABCclVFJbiEypW0tRFNLQltzdGxs7RwAPIwABaWy8Wl6xXUW+wQV5a7B8ZdPb04EHBKR7GcggFB4Diva5QdhTIA)

@category Utilities
*/
export type FindGlobalType<Name extends string> = typeof globalThis extends Record<Name, infer T> ? T : never;

/**
Tries to find one or more types from their globally-defined constructors.

Use-case: Conditionally referencing DOM types only when the DOM library present.

*Limitations:* Due to peculiarities with the behavior of `globalThis`, "globally defined" has a narrow definition in this case. Declaring a class in a `declare global` block won't work, instead you must declare its type using an interface and declare its constructor as a `var` (*not* `let`/`const`) inside the `declare global` block.

@example
```
import type {FindGlobalInstanceType} from 'type-fest';

class Point {
	constructor(public x: number, public y: number) {}
}

type PointLike = Point | FindGlobalInstanceType<'DOMPoint'>;
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gMWAOwCYDiANhAEYCGRAkjgM4zk4DGKAKsigL5wBmUEIOAHIkqALQ8U9IQG4AUHKZFytWnAAKEXPHRyAkEwh0YUAK5MY0ABRhTpIsCZwAHgC44OUyFIooAGjhbe0c4RHdPb18ASgxOOTi5UTRNbQAZYABrNABeDS0ceAAfOGx8YjJKGnpGFnZUAB4hABEAeQBZFIKhAD4ZIA)

@example
```
import type {FindGlobalInstanceType} from 'type-fest';

declare global {
	// Class syntax won't add the key to `globalThis`
	class Foo {}

	// interface + constructor style works
	interface Bar {}
	var Bar: new () => Bar; // Not let or const
}

type FindFoo = FindGlobalInstanceType<'Foo'>; // Doesn't work
type FindBar = FindGlobalInstanceType<'Bar'>; // Works
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gMWAOwCYDiANhAEYCGRAkjgM4zk4DGKAKsigL5wBmUEIOAHIkqALQ8U9IQG4AUHLwomRclDQBzEhSIY5ASAD0huAGFVtWnFqIcDAB5wA7hBwi45PHgQALNAGsURAQIOAADLTJKVh9gWjCDFXJLOEwIUPROBSMTXBgUKB5yFjgAajgmV3ooAFcmGGhrJCI0Fyh-WgM8gqKSgCE1DCz9ADdBgagALjgcFCc4AAoASjgAXgA+OAmZOGM4ADkIeBb4Rsq6GDksuVE0bHw00NXU3EJtShp6RhZ2VAAeISPITrHZ7AAiECkbngbX8Nw4L3wEzWiLeUWoF2+bA4AImwNBJgA6tAOkA)

@category Utilities
*/
export type FindGlobalInstanceType<Name extends string> =
	Name extends string
		? typeof globalThis extends Record<Name, abstract new (...arguments_: any[]) => infer T> ? T : never
		: never;

export {};

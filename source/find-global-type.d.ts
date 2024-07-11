/**
Tries to find one or more types from their globally-defined constructors.

Use-case: Conditionally referencing DOM types only when the DOM library present.

*Note:* Globally-defined has a narrow definition in this case due to peculiarities with the behavior of `globalThis`.
Merely declaring a class in a `declare global` block won't work, instead you must declare its constructor as a `var`
(not `let`/`const`) inside the `declare global` block. This typically is done using a combination of interface +
constructor style, rather than the es6 class syntax.

@example
```
import type {FindGlobalType} from 'type-fest';

class Point {
	constructor(public x: number, public y: number) {
	}
}

type PointLike = Point | FindGlobalType<'DOMPoint'>;

function doSomething(point: PointLike): number {
	// ...
}
```

@example
```
import type {FindGlobalType} from 'type-fest';

declare global {
	// ES6 class syntax won't add the key to `globalThis`
	class Foo {}

	// interface + constructor style works
	interface Bar {}
	interface BarConstructor {
		new (): Bar;
	}
	var Bar: BarConstructor; // not let or const
}

type FindFoo = FindGlobalType<'Foo'>; // doesn't work
type FindBar = FindGlobalType<'Bar'>; // works
```

@category Utilities
*/
export type FindGlobalType<Name extends string> =
	Name extends string
		? typeof globalThis extends Record<Name, new (...arguments: any[]) => infer T> ? T : never
		: never;

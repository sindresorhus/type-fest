/**
Matches any non-empty string.

This is useful when you need a string that is not empty, for example, as a function parameter.

NOTE:
- This returns `never` not just when instantiated with an empty string, but also when an empty string is a subtype of the instantiated type, like `string` or `Uppercase<string>`.

@example
```
import type {NonEmptyString} from 'type-fest';

declare function foo<T extends string>(string: NonEmptyString<T>): void;

foo('a');
//=> OK

// @ts-expect-error
foo('');
//=> Error: Argument of type '""' is not assignable to parameter of type 'never'.

declare const someString: string
// @ts-expect-error
foo(someString);
//=> Error: Argument of type 'string' is not assignable to parameter of type 'never'.
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gOQgOwKLhIDKMUwOA5gL5wBmUEIcA5EqgLS0oDOMzA3AChBAExQBjADYBDKGloBXHOJjBcdCBAA8AFTgoAHjBQ4R3OLzKUAfAApL5CgC442fIUQkrFXdYCULgBuEMAiQoK0mrbM0sx+QgD0CQC81nAA8gDSwklwAAIw3OyGqCrFUAxQEVHMcYkpaXgV0C4AglAUCiAm8BC0CMhozABEw8xwwOY4EPDS3NzAFDjSAEaSaDAQcGCy0t3GUHB9A6gsOCiBKFDMAHTCYlKyaOK4vBaMKF6OLg6UgrkFIolCQwcqVaoQewfL6UeL-BpwJqVNodLo9I79NhDX4UcaTODTWbzRbLNYbLY7KB7FAHDEnIbnS7XG5AA)

@category String
*/
export type NonEmptyString<T extends string> = '' extends T ? never : T;

export {};

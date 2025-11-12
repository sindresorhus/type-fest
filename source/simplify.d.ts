/**
Useful to flatten the type output to improve type hints shown in editors. And also to transform an interface into a type to aide with assignability.

@example
```
import type {Simplify} from 'type-fest';

type PositionProps = {
	top: number;
	left: number;
};

type SizeProps = {
	width: number;
	height: number;
};

// In your editor, hovering over `Props` will show a flattened object with all the properties.
type Props = Simplify<PositionProps & SizeProps>;
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gZVGANsAM0QF84CoIQ4ByJVAWgJQGcZqBuAKE7rQAUIzYDGAQAdnwphmcALwZOASBgQwALjhiAriABGKKF0W4UBGBu16DXYlx7I02AF4pJqmfPRKA7sAAmMAAWFjr6hkqBKMAA5oHmmqHWnLbcAPSpcACSYnCIEFpQcCh+wtAANHCBEABuBsBi0XA1BnAABm7SrXC+uLhwzFXecACGZLjDMDAoYsVNugBWKADG8L5BI70IkXBgUgYiLAB09qhwHR5w2OD4RAA8AkIi4udwAGSXwC7nAHzsQA)

Sometimes it is desired to pass a value as a function argument that has a different type. At first inspection it may seem assignable, and then you discover it is not because the `value`'s type definition was defined as an interface. In the following example, `fn` requires an argument of type `Record<string, unknown>`. If the value is defined as a literal, then it is assignable. And if the `value` is defined as type using the `Simplify` utility the value is assignable.  But if the `value` is defined as an interface, it is not assignable because the interface is not sealed and elsewhere a non-string property could be added to the interface.

If the type definition must be an interface (perhaps it was defined in a third-party npm package), then the `value` can be defined as `const value: Simplify<SomeInterface> = ...`. Then `value` will be assignable to the `fn` argument.  Or the `value` can be cast as `Simplify<SomeInterface>` if you can't re-declare the `value`.

@example
```
import type {Simplify} from 'type-fest';

interface SomeInterface {
	foo: number;
	bar?: string;
	baz: number | undefined;
}

type SomeType = {
	foo: number;
	bar?: string;
	baz: number | undefined;
};

const literal = {foo: 123, bar: 'hello', baz: 456};
const someType: SomeType = literal;
const someInterface: SomeInterface = literal;

declare function fn(object: Record<string, unknown>): void;

fn(literal); // Good: literal object type is sealed
fn(someType); // Good: type is sealed
// @ts-expect-error
fn(someInterface); // Error: Index signature for type 'string' is missing in type 'someInterface'. Because `interface` can be re-opened
fn(someInterface as Simplify<SomeInterface>); // Good: transform an `interface` into a `type`
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gZVGANsAM0QF84CoIQ4ByJVAWgJQGcZqBuAKE+ADsYUUAgEMAxmkyUUASX6CR4jJwCQBCBABccXgFcQAI0Fdl+4VAD8W1lD4BzY6YBeW3QcFwAPnB28AJigI+FF8uYm46CSkAFWQ0AF4lVXUXPUMoBzNLOGs7DOdtVPcvH39A3mDQrk5RCF5WOHwBKGFcOAT0NU04AEYAJgBmABo4UygtagALFFxcCGphpy0AFgBWADZiLhq6+GZo2K1JEBQY1DaG4CaWrdr6vePZJoUUQ6lH+TF4i6vcKv9RXBmNAEHyiGDAWpkXgACgg+gAVigwVoAEpI6C+AA8OV4tmGPgA1rwIAB3XgAPgAlFoAG4QYAhbgEGGNQQtSnsOAAei5cAA4upfFpWc1WnDEWCELE4MBmNkUC1gpxmdD7idYhzubyBRAhVKzrL5YrfJweXAAAIwZj0FAAD1QYJtUAoUGVMLV7yEn01ZoAos7oFpZP5bdlgLZeMIYDooMDoPq0NQcbZqDK5SBZcw7DLeAmaB65F7xNQAHRwABCSOEOmYaAABnwnp863BRMJc4Y4LH6BBUOUTSqC03FMI5dhwPgiJijjJC88qZyzTq9TBmnU1FAqO24A2582czAIHBhDuInWgA)

@link https://github.com/microsoft/TypeScript/issues/15300
@see {@link SimplifyDeep}
@category Object
*/
export type Simplify<T> = {[KeyType in keyof T]: T[KeyType]} & {};

export {};

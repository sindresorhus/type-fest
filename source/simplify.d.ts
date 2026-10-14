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

A function or a class constructor is returned as is, because its call and construct signatures cannot be flattened into an object. A union that includes one is also returned as is, so its other members are not flattened. To get only the properties of a function, use `Simplify<Omit<Type, never>>`.

@example
```
import type {Simplify} from 'type-fest';

type Format = (value: string) => string;

type A = Simplify<Format>;
//=> (value: string) => string

type B = Simplify<Format & {description: string}>;
//=> Format & {description: string}

// `Omit` drops the call signature, so this gives only the properties.
type C = Simplify<Omit<Format & {description: string}, never>>;
//=> {description: string}
```

@see https://github.com/microsoft/TypeScript/issues/15300
@see {@link SimplifyDeep}
@category Object
*/
// Internal types use `SimplifyObject` instead, which leaves out the function check. See its comment for why.
export type Simplify<T> =
	// The check is not distributive, so that a generic `T` stays assignable to `Simplify<T>`, because it is assignable to both branches.
	[Extract<T, ((...arguments_: never) => unknown) | (abstract new (...arguments_: never) => unknown)>] extends [never]
		? {[KeyType in keyof T]: T[KeyType]} & {}
		: T;

export {};

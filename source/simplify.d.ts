import type {Primitive} from './primitive.d.ts';
import type {SimplifyDeep} from './simplify-deep.d.ts'; // For `@link`

/**
Useful to flatten the type output to improve type hints shown in editors. And also to transform an interface into a type to aid with assignability.

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

Only the top level is flattened. Property values are kept as is, and so are the elements of an array or a tuple, which keeps its shape. Use {@link SimplifyDeep} to flatten them too.

@example
```
import type {Simplify} from 'type-fest';

type Point = {x: number} & {y: number};

type A = Simplify<{start: Point} & {end: Point}>;
//=> {start: Point; end: Point}

type B = Simplify<[label: string, point?: Point]>;
//=> [label: string, point?: Point]
```

A function or a class constructor is returned as is, because its call and construct signatures cannot be flattened into an object. To get only the properties of a function, use `Simplify<Omit<Type, never>>`.

A primitive is also returned as is. A branded primitive like `Tagged<string, 'UserId'>` or `string & {}` is returned as is too, because flattening it would turn it into an object and remove the primitive. A union that includes a function, a class constructor, or a branded primitive is returned as is, so its other members are not flattened. A plain primitive in a union does not stop its other members from being flattened.

TypeScript does not resolve a mapped type over a template literal type intersected with `{}`, so ``Simplify<`on${string}` & {}>`` stays unresolved and is not assignable to `string`. Use `Record<never, never>` instead of `{}`, like `LiteralUnion` does.

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

type UserId = string & {brand: 'UserId'};

type D = Simplify<UserId>;
//=> string & {brand: 'UserId'}

// A plain primitive does not stop the other members from being flattened.
type E = Simplify<'auto' | ({width: number} & {height: number})>;
//=> 'auto' | {width: number; height: number}

// A branded primitive does, so the union is returned as is.
type F = Simplify<UserId | ({width: number} & {height: number})>;
//=> UserId | ({width: number} & {height: number})
```

A built-in object like `Date`, `Map`, or `Promise`, and an array or a tuple with extra properties like `string[] & {total: number}`, is flattened into an object of all its members. The result is still assignable to and from the original type, but it makes type hints long, so do not wrap these types in `Simplify`.

@see https://github.com/microsoft/TypeScript/issues/15300
@see {@link SimplifyDeep}
@category Object
*/
// Internal types use `SimplifyObject` instead, which leaves out the check for functions, class constructors, and branded primitives. See its comment for why.
export type Simplify<T> =
	// The check is not distributive, so that a generic `T` stays assignable to `Simplify<T>`, because it is assignable to both branches.
	[BrandedPrimitive<T> | Extract<T, ((...arguments_: never) => unknown) | (abstract new (...arguments_: never) => unknown)>] extends [never]
		? {[KeyType in keyof T]: T[KeyType]} & {}
		: T;

// The members of `Type` that are a primitive intersected with an object type, like `Tagged<string, 'UserId'>` or `string & {}`. A homomorphic mapped type, like the one in `Simplify`, returns a plain primitive as is, but turns a branded primitive into an object of all its members, which removes the primitive.
type BrandedPrimitive<Type> = Type extends Primitive
	? {[KeyType in keyof Type]: Type[KeyType]} extends Primitive ? never : Type
	: never;

export {};

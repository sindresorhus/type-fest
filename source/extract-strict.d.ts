import type {Exact} from './exact';

/**
Extract members of a union type `Type` based on the
fields in the given union type `Union`, where each
union member of `Union` is only allowed to be a subset
of some union member of `Type`.

Constraint: ∀ U ∈ Union, U ⊆ T, where T ∈ Type

@example
```
type Foo = {
	kind: 'foo';
	a: string;
	b: string;
};

type Bar = {
	kind: 'bar';
	a: string;
	b: number;
	c: boolean;
};

type Foobar = Foo | Bar;

type FoobarByA = ExtractStrict<Foobar, {a: string}>;
// => Foobar

type OnlyFooByKind = ExtractStrict<Foobar, {kind: 'foo'}>;
// => Foo

type OnlyFooByB = ExtractStrict<Foobar, {b: string}>;
// => Foo

type OnlyBarByC = ExtractStrict<Foobar, {c: boolean}>;
// => Bar

type InvalidUnionForType = ExtractStrict<Foobar, {d: string}>;
// => Error:
//	  Types of property 'd' are incompatible.
//	  Type 'string' is not assignable to type 'never'.
```
@category Improved Builtin
*/
export type ExtractStrict<
	Type,
	/**
	 * Only allow keys that are in some union member
	 * of `Type`. Thus, each union member of `Union`
	 * is only allowed to be a subset of some union
	 * member of `Type`.
	 */
	Union extends Partial<Exact<Type, Union>>,
> = Extract<Type, Union>;

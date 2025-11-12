/**
Simplifies a type while including and/or excluding certain types from being simplified.

Useful to improve type hints shown in editors. And also to transform an `interface` into a `type` to aid with assignability.

@example
```
import type {ConditionalSimplify} from 'type-fest';

type TypeA = {
	a: string;
};

type TypeB = {
	b: string;
};

type TypeAB = TypeA & TypeB;
//=> TypeA & TypeB

type SimplifyTypeAB = ConditionalSimplify<TypeAB, never, object>;
//=> {a: string; b: string}
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gYQgOwCbAzC4CGANgMqhhnABmiAvnHVBCHAORKoC0dKAM4xOAbgBQ4nmgAqyFAEE4AXgziAkCQBccYVGA4A5hMYSp8uHNQAhFWvUAjHXoPHxpydMvyFt1VcU4ADJvGwkAenDlAD5QwJCA608LKnBaBgDfO2x8QmIcclSaekQAHkzrABo4HBQANxQoaogHACsUAGMYaIio2PRtXRh9I1E4JyGRw0YgA)

@example
```
import type {ConditionalSimplify} from 'type-fest';

type Simplify<T> = ConditionalSimplify<T, Set<unknown> | Map<unknown, unknown> | unknown[], object>;

type A = Simplify<Set<number> & Set<string>>;
//=> Set<number> & Set<string>

type B = Simplify<Map<number, number> & Map<string, string>>;
//=> Map<number, number> & Map<string, string>

type C = Simplify<{a: number} & {b: string}>;
//=> {a: number; b: string}
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gYQgOwCbAzC4CGANgMqhhnABmiAvnHVBCHAORKoC0dKAM4xOAbgBQ4nmirhaDADwAVAHxwAvHGz5CxHOVk16iZQBo4FFDAUBXHAGscEAO441AHzgBZEmFsOnV3M7Rxc3OE8QwJwAbQBdcwgAIwArFABjGBUJKWQ0AEENC2p5E0trHBsQJJQoNQAyCysFYShgHABzFWzxAHpe9TVyhUrq2oam61b2rslpOAAhIsNShR8-UZqoc03xuEb1lpg2zvNpzu6JfsHvXxGqrZ2HvYO7846z45mVObytZZKxgU6BIAC44LsoMxGugkuD3owetc1CDwZDRHA4XAEUA)

@see {@link ConditionalSimplifyDeep}
@category Object
*/
export type ConditionalSimplify<Type, ExcludeType = never, IncludeType = unknown> = Type extends ExcludeType
	? Type
	: Type extends IncludeType
		? {[TypeKey in keyof Type]: Type[TypeKey]}
		: Type;

export {};

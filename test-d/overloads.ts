import {expectTypeOf} from 'nz';
import type {IsEqual, Overloads, UnknownArray} from '../index.d.ts';

/*
Neither `expectTypeOf().toBe()` nor `IsEqual` can distinguish implicit `this` from explicit `this: unknown`:

```ts
expectTypeOf(x as (this: unknown) => void).toBe<() => void>(); // no error
type _ = IsEqual<() => void, (this: unknown) => void>; // => true
```

`IsEqualStrict` resolves this by also comparing the extracted `this` parameter via a sentinel type. It accepts tuples of functions and compares them element-wise.
*/
declare const isEqualStrictNothing: unique symbol;
type IsEqualStrictNothing = typeof isEqualStrictNothing;
type FunctionToTuple<Function_ extends (...arguments_: any) => any> =
	Function_ extends (...arguments_: infer Parameters_ extends UnknownArray) => infer Return
		? [ThisParameterType<((this: IsEqualStrictNothing, ...arguments_: Parameters_) => Return) & Function_>, Parameters_, Return]
		: never;
type IsEqualStrict<
	FunctionTuple1 extends ReadonlyArray<(...arguments_: never) => unknown>,
	FunctionTuple2 extends ReadonlyArray<(...arguments_: never) => unknown>,
> = IsEqual<
	[FunctionTuple1, {[Index in keyof FunctionTuple1]: FunctionToTuple<FunctionTuple1[Index]>}],
	[FunctionTuple2, {[Index in keyof FunctionTuple2]: FunctionToTuple<FunctionTuple2[Index]>}]
>;

type Function1 = (foo: string, bar: number) => object;
type Function2 = (foo: bigint, ...bar: any[]) => void;

// `IsEqualStrict` must tell implicit `this` from explicit `this: unknown`.
expectTypeOf<IsEqualStrict<[Function1], [(this: unknown, foo: string, bar: number) => object]>>().toBe<false>();

// Single function (no overload)
declare const normalFunction: Overloads<Function1>;
expectTypeOf(normalFunction).toBe<[Function1]>();

// Two overloads via intersection
declare const twoOverloads: Overloads<Function1 & Function2>;
expectTypeOf(twoOverloads).toBe<[Function1, Function2]>();

// Two overloads via interface syntax
declare const twoOverloadsInterface: Overloads<{
	(foo: string, bar: number): object;
	(foo: bigint, ...bar: any[]): void;
}>;
expectTypeOf(twoOverloadsInterface).toBe<[Function1, Function2]>();

// Identical overloads collapse
declare const twoIdenticalOverloads: Overloads<{
	(foo: string, bar: number): object;
	(foo: string, bar: number): object;
}>;
expectTypeOf(twoIdenticalOverloads).toBe<[Function1]>();

type Function3 = (foo: string, bar: number, baz?: boolean) => object;

// Two overloads with assignable but distinct signatures
declare const twoOverloadsWithAssignableSignature: Overloads<Function1 & Function3>;
expectTypeOf(twoOverloadsWithAssignableSignature).toBe<[Function1, Function3]>();

// Three overloads, declaration order preserved
declare const threeOverloads: Overloads<Function1 & Function2 & Function3>;
expectTypeOf(threeOverloads).toBe<[Function1, Function2, Function3]>();

type Function4 = (...foo: any[]) => void;
type Function5 = (...foo: readonly any[]) => void;

// Rest parameter overloads
declare const normalFunctionWithOnlyRestWritableParameter: Overloads<Function4>;
expectTypeOf(normalFunctionWithOnlyRestWritableParameter).toBe<[Function4]>();

declare const normalFunctionWithOnlyRestReadonlyParameter: Overloads<Function5>;
expectTypeOf(normalFunctionWithOnlyRestReadonlyParameter).toBe<[Function5]>();

// The compiler ignores subsequent identical-up-to-readonly overloads
declare const twoOverloadsWithDifferentRestParameterReadonliness: Overloads<Function4 & Function5>;
expectTypeOf(twoOverloadsWithDifferentRestParameterReadonliness).toBe<[Function4]>();

declare const twoOverloadsWithDifferentRestParameterReadonlinessReversed: Overloads<Function5 & Function4>;
expectTypeOf(twoOverloadsWithDifferentRestParameterReadonlinessReversed).toBe<[Function5]>();

type Function6 = (foo: string, ...bar: any[]) => void;
type Function7 = (foo: string, ...bar: readonly any[]) => void;

declare const normalFunctionWithNormalAndRestWritableParameter: Overloads<Function6>;
expectTypeOf(normalFunctionWithNormalAndRestWritableParameter).toBe<[Function6]>();

// Readonly rest parameter cannot be represented with tuples
declare const normalFunctionWithNormalAndRestReadonlyParameter: Overloads<Function7>;
expectTypeOf(normalFunctionWithNormalAndRestReadonlyParameter).toBe<[(foo: string, ...bar: any[]) => void]>();

type Function8 = () => never;

declare const normalFunctionNoParameters: Overloads<Function8>;
expectTypeOf(normalFunctionNoParameters).toBe<[Function8]>();

declare const twoOverloadsWithNoAndPresentParameters: Overloads<Function8 & Function6>;
expectTypeOf(twoOverloadsWithNoAndPresentParameters).toBe<[Function8, Function6]>();

type Function9 = (event: 'event9', argument: string) => void;
type Function10 = (event: 'event10', argument: number) => string;
type Function11 = (event: 'event11', argument: boolean) => never;
type Function12 = (event: 'event12', argument: bigint) => object;

// Many overloads, order preserved
declare const manyOverloads: Overloads<
	Function1
	& Function2
	& Function3
	& Function4
	& Function5
	& Function6
	& Function7
	& Function8
	& Function9
	& Function10
	& Function11
	& Function12
>;
expectTypeOf(manyOverloads).toBe<[
	Function1,
	Function2,
	Function3,
	Function4,
	Function6,
	Function8,
	Function9,
	Function10,
	Function11,
	Function12,
]>();

declare const anyOverload: Overloads<any>;
expectTypeOf(anyOverload).toBe<any>();

declare const neverOverload: Overloads<never>;
expectTypeOf(neverOverload).toBe<never>();

// `declare function` overloads
declare function declaredOverload(input: string): {kind: 'string'};
declare function declaredOverload(input: number, flag: boolean): {kind: 'number'};

declare const declaredOverloadResult: Overloads<typeof declaredOverload>;
expectTypeOf(declaredOverloadResult).toBe<[(input: string) => {kind: 'string'}, (input: number, flag: boolean) => {kind: 'number'}]>();

// Overloads with explicit `this` parameters
type ThisOverload1 = (this: Date, foo: string) => void;
type ThisOverload2 = (this: URL, foo: number) => void;

declare const thisOverloads: Overloads<ThisOverload1 & ThisOverload2>;
// Verify `this` is preserved
expectTypeOf(thisOverloads).toBe<[ThisOverload1, ThisOverload2]>();

// Same parameters, different return types
type SameParametersDifferentReturn1 = (foo: string) => string;
type SameParametersDifferentReturn2 = (foo: string) => number;

declare const sameParametersDifferentReturn: Overloads<SameParametersDifferentReturn1 & SameParametersDifferentReturn2>;
expectTypeOf(sameParametersDifferentReturn).toBe<[SameParametersDifferentReturn1, SameParametersDifferentReturn2]>();

// Generic overloads: generic parameters become `unknown`
declare function genericOverload<T>(input: T): T;
declare function genericOverload(input: string): string;

declare const genericOverloadResult: Overloads<typeof genericOverload>;
expectTypeOf(genericOverloadResult).toBe<[(input: unknown) => unknown, (input: string) => string]>();

// Interface-style overload
type InterfaceOverload = {
	(input: string): 1;
	(input: number): 2;
};

declare const interfaceOverload: Overloads<InterfaceOverload>;
expectTypeOf(interfaceOverload).toBe<[(input: string) => 1, (input: number) => 2]>();

// Same parameters, different `this` types
type SameParametersDifferentThis1 = (this: Date, foo: string) => number;
type SameParametersDifferentThis2 = (this: URL, foo: string) => number;

declare const sameParametersDifferentThis: Overloads<SameParametersDifferentThis1 & SameParametersDifferentThis2>;
expectTypeOf(sameParametersDifferentThis).toBe<[SameParametersDifferentThis1, SameParametersDifferentThis2]>();
declare const sameParametersDifferentThis2: Overloads<SameParametersDifferentThis2 & SameParametersDifferentThis1>;
expectTypeOf(sameParametersDifferentThis2).toBe<[SameParametersDifferentThis2, SameParametersDifferentThis1]>();

// Duplicate overloads in interface are collapsed
declare const duplicateOverloads: Overloads<{
	(foo: string, bar: number): object;
	(): string;
	(): string;
}>;
expectTypeOf(duplicateOverloads).toBe<[Function1, () => string]>();

// Generic overload at intersection level: overloads preceding the generic are extracted by moving on to the next overload from the end
declare const genericIntersectionOverload: Overloads<((this: string) => string) & (<T>(this: T, argument: T) => T)>;
expectTypeOf(genericIntersectionOverload).toBe<[(this: string) => string, (this: unknown, argument: unknown) => unknown]>();

// Verify that explicit `this: unknown` is preserved while implicit `this` is omitted.
// `IsEqualStrict` is needed here because neither `expectTypeOf().toBe()` nor `IsEqual` can distinguish the two.

type Function1WithThis<This> = (this: This, foo: string, bar: number) => object;
type Function2WithThis<This> = (this: This, foo: bigint, ...bar: any[]) => void;

// Single overload with explicit `this: unknown`
declare const singleOverloadWithExplicitThisUnknown: Overloads<Function1WithThis<unknown>>;
expectTypeOf<IsEqualStrict<typeof singleOverloadWithExplicitThisUnknown, [Function1WithThis<unknown>]>>().toBe<true>();

// Single overload with implicit `this`
expectTypeOf<IsEqualStrict<typeof normalFunction, [Function1]>>().toBe<true>();

// Mixed explicit `this: unknown` and implicit `this` overloads
declare const mixedExplicitImplicitThis: Overloads<Function1WithThis<unknown> & Function2>;
expectTypeOf<IsEqualStrict<typeof mixedExplicitImplicitThis, [Function1WithThis<unknown>, Function2]>>().toBe<true>();

// Multiple explicit and implicit `this` overloads
declare const multipleExplicitImplicitThis: Overloads<{
	(this: unknown, foo: string, bar: number): object;
	(this: unknown, foo: bigint, ...bar: any[]): void;
	(foo: string, bar: number, baz?: boolean): object;
	(...foo: any[]): void;
}>;
expectTypeOf<IsEqualStrict<
	typeof multipleExplicitImplicitThis,
	[Function1WithThis<unknown>, Function2WithThis<unknown>, Function3, Function4]
>>().toBe<true>();

declare const aliasingGenericOverloads1: Overloads<{
	(foo: string, bar: number): object;
	(this: unknown, l: unknown, r: unknown): [unknown, unknown];
	// <T, U>(l: T, r: U): [U, T];
	<T, U>(l: T, r: U): [T, U];
	<T>(l: T, r: T): [T, T];
	(this: unknown, foo: bigint, ...bar: any[]): void;
}>;
expectTypeOf<IsEqualStrict<typeof aliasingGenericOverloads1, [
	Function1,
	(this: unknown, l: unknown, r: unknown) => [unknown, unknown],
	(this: unknown, l: unknown, r: unknown) => [unknown, unknown],
	(this: unknown, l: unknown, r: unknown) => [unknown, unknown],
	Function2WithThis<unknown>,
]>>().toBe<true>();
declare const aliasingGenericOverloads2: Overloads<{
	(foo: string, bar: number): object;
	<T, U>(l: T, r: U): [T, U];
	<T>(l: T, r: T): [T, T];
	(this: unknown, foo: bigint, ...bar: any[]): void;
}>;
expectTypeOf<IsEqualStrict<typeof aliasingGenericOverloads2, [
	Function1,
	(this: unknown, l: unknown, r: unknown) => [unknown, unknown],
	(this: unknown, l: unknown, r: unknown) => [unknown, unknown],
	Function2WithThis<unknown>,
]>>().toBe<true>();

// When implicit `this` and explicit `this: unknown` overloads share same params/return, implicit may be lost
declare const implicitThenExplicitThis1: Overloads<Function1 & Function1WithThis<1>>;
expectTypeOf<IsEqualStrict<typeof implicitThenExplicitThis1, [Function1]>>().toBe<true>();
// When the explicit `this` overload comes first, the implicit `this` overload may be absorbed
declare const explicitThenImplicitThis1: Overloads<Function1WithThis<1> & Function1>;
expectTypeOf<IsEqualStrict<typeof explicitThenImplicitThis1, [Function1WithThis<1>]>>().toBe<true>();
declare const explicitImplicitExplicitThis: Overloads<Function1WithThis<1> & Function1 & Function1WithThis<2>>;
expectTypeOf<IsEqualStrict<typeof explicitImplicitExplicitThis, [Function1WithThis<1>, Function1WithThis<2>]>>().toBe<true>();
// With `this: unknown` specifically, implicit `this` is always absorbed
declare const implicitThenExplicitThisUnknown: Overloads<Function1 & Function1WithThis<unknown>>;
expectTypeOf<IsEqualStrict<typeof implicitThenExplicitThisUnknown, [Function1]>>().toBe<true>();
declare const explicitThisUnknownThenImplicit: Overloads<Function1WithThis<unknown> & Function1>;
expectTypeOf<IsEqualStrict<typeof explicitThisUnknownThenImplicit, [Function1WithThis<unknown>]>>().toBe<true>();

// A union of function types is handled member by member.
expectTypeOf<Overloads<Function1 | (Function2 & Function3)>>().toBe<[Function1] | [Function2, Function3]>();

// @ts-expect-error
type UnknownOverloads = Overloads<unknown>;

// Known limitation: Type predicates and assertion signatures are lost, because `infer` cannot capture them. Like generic overloads, they also get an explicit `this: unknown`.
expectTypeOf<IsEqualStrict<Overloads<typeof Array.isArray>, [(this: unknown, argument: any) => boolean]>>().toBe<true>();
declare function assertString(value: unknown): asserts value is string;
expectTypeOf<IsEqualStrict<Overloads<typeof assertString>, [(this: unknown, value: unknown) => void]>>().toBe<true>();

// Known limitation: With 4 or more generic overloads, the overloads before the 4th-from-last generic overload are omitted.
declare const fourGenericOverloads: Overloads<{
	(input: string): 0;
	<Value>(value: Value, index: 1): Value;
	<Value>(value: Value, index: 2): Value;
	<Value>(value: Value, index: 3): Value;
	<Value>(value: Value, index: 4): Value;
}>;
expectTypeOf<IsEqualStrict<typeof fourGenericOverloads, [
	(this: unknown, value: unknown, index: 1) => unknown,
	(this: unknown, value: unknown, index: 2) => unknown,
	(this: unknown, value: unknown, index: 3) => unknown,
	(this: unknown, value: unknown, index: 4) => unknown,
]>>().toBe<true>();

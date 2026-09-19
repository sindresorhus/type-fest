import {expectType} from 'tsd';
import type {IsEqual, Overloads, UnknownArray} from '../index.d.ts';

/*
Neither `expectType` nor `IsEqual` can distinguish implicit `this` from explicit `this: unknown`:

```ts
expectType<() => void>(x as (this: unknown) => void); // no error
type _ = IsEqual<() => void, (this: unknown) => void>; // => true
```

`IsEqualStrict` resolves this by also comparing the extracted `this` parameter via a sentinel type.
It accepts tuples of functions and compares them element-wise.
*/
declare const isEqualStrictNothing: unique symbol;
type IsEqualStrictNothing = typeof isEqualStrictNothing;
type FuncToTuple<Function_ extends (...arguments_: any) => any> =
	Function_ extends (...arguments_: infer Parameters_ extends UnknownArray) => infer Return
		? [ThisParameterType<((this: IsEqualStrictNothing, ...arguments_: Parameters_) => Return) & Function_>, Parameters_, Return]
		: never;
type IsEqualStrict<
	FunctionTuple1 extends ReadonlyArray<(...arguments_: never) => unknown>,
	FunctionTuple2 extends ReadonlyArray<(...arguments_: never) => unknown>,
> = IsEqual<
	[FunctionTuple1, {[K in keyof FunctionTuple1]: FuncToTuple<FunctionTuple1[K]>}],
	[FunctionTuple2, {[K in keyof FunctionTuple2]: FuncToTuple<FunctionTuple2[K]>}]
>;

type Function1 = (foo: string, bar: number) => object;
type Function2 = (foo: bigint, ...bar: any[]) => void;

// Single function (no overload)
declare const normalFunction: Overloads<Function1>;
expectType<[Function1]>(normalFunction);

// Two overloads via intersection
declare const twoOverloads: Overloads<Function1 & Function2>;
expectType<[Function1, Function2]>(twoOverloads);

// Two overloads via interface syntax
declare const twoOverloadsInterface: Overloads<{
	(foo: string, bar: number): object;
	(foo: bigint, ...bar: any[]): void;
}>;
expectType<[Function1, Function2]>(twoOverloadsInterface);

// Identical overloads collapse
declare const twoIdenticalOverloads: Overloads<{
	(foo: string, bar: number): object;
	(foo: string, bar: number): object;
}>;
expectType<[Function1]>(twoIdenticalOverloads);

type Function3 = (foo: string, bar: number, baz?: boolean) => object;

// Two overloads with assignable but distinct signatures
declare const twoOverloadsWithAssignableSignature: Overloads<Function1 & Function3>;
expectType<[Function1, Function3]>(twoOverloadsWithAssignableSignature);

// Three overloads - declaration order preserved
declare const threeOverloads: Overloads<Function1 & Function2 & Function3>;
expectType<[Function1, Function2, Function3]>(threeOverloads);

type Function4 = (...foo: any[]) => void;
type Function5 = (...foo: readonly any[]) => void;

// Rest parameter overloads
declare const normalFunctionWithOnlyRestWritableParameter: Overloads<Function4>;
expectType<[Function4]>(normalFunctionWithOnlyRestWritableParameter);

declare const normalFunctionWithOnlyRestReadonlyParameter: Overloads<Function5>;
expectType<[Function5]>(normalFunctionWithOnlyRestReadonlyParameter);

// The compiler ignores subsequent identical-up-to-readonly overloads
declare const twoOverloadsWithDifferentRestParameterReadonliness: Overloads<Function4 & Function5>;
expectType<[Function4]>(twoOverloadsWithDifferentRestParameterReadonliness);

declare const twoOverloadsWithDifferentRestParameterReadonlinessReversed: Overloads<Function5 & Function4>;
expectType<[Function5]>(twoOverloadsWithDifferentRestParameterReadonlinessReversed);

type Function6 = (foo: string, ...bar: any[]) => void;
type Function7 = (foo: string, ...bar: readonly any[]) => void;

declare const normalFunctionWithNormalAndRestWritableParameter: Overloads<Function6>;
expectType<[Function6]>(normalFunctionWithNormalAndRestWritableParameter);

// Readonly rest parameter cannot be represented with tuples
declare const normalFunctionWithNormalAndRestReadonlyParameter: Overloads<Function7>;
expectType<[(foo: string, ...bar: any[]) => void]>(normalFunctionWithNormalAndRestReadonlyParameter);

type Function8 = () => never;

declare const normalFunctionNoParameters: Overloads<Function8>;
expectType<[Function8]>(normalFunctionNoParameters);

declare const twoOverloadsWithNoAndPresentParameters: Overloads<Function8 & Function6>;
expectType<[Function8, Function6]>(twoOverloadsWithNoAndPresentParameters);

type Function9 = (event: 'event9', argument: string) => void;
type Function10 = (event: 'event10', argument: number) => string;
type Function11 = (event: 'event11', argument: boolean) => never;
type Function12 = (event: 'event12', argument: bigint) => object;

// Many overloads - order preserved
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
expectType<[
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
]>(manyOverloads);

declare const anyOverload: Overloads<any>;
expectType<any>(anyOverload);

declare const neverOverload: Overloads<never>;
expectType<never>(neverOverload);

// `declare function` overloads
declare function declaredOverload(input: string): {kind: 'string'};
declare function declaredOverload(input: number, flag: boolean): {kind: 'number'};

declare const declaredOverloadResult: Overloads<typeof declaredOverload>;
expectType<[(input: string) => {kind: 'string'}, (input: number, flag: boolean) => {kind: 'number'}]>(declaredOverloadResult);

// Overloads with explicit `this` parameters
type ThisOverload1 = (this: Date, foo: string) => void;
type ThisOverload2 = (this: URL, foo: number) => void;

declare const thisOverloads: Overloads<ThisOverload1 & ThisOverload2>;
// Verify `this` is preserved
expectType<[ThisOverload1, ThisOverload2]>(thisOverloads);

// Same parameters, different return types
type SameParametersDifferentReturn1 = (foo: string) => string;
type SameParametersDifferentReturn2 = (foo: string) => number;

declare const sameParametersDifferentReturn: Overloads<SameParametersDifferentReturn1 & SameParametersDifferentReturn2>;
expectType<[SameParametersDifferentReturn1, SameParametersDifferentReturn2]>(sameParametersDifferentReturn);

// Generic overloads - generic parameters become `unknown`
declare function genericOverload<T>(input: T): T;
declare function genericOverload(input: string): string;

declare const genericOverloadResult: Overloads<typeof genericOverload>;
expectType<[(input: unknown) => unknown, (input: string) => string]>(genericOverloadResult);

// Interface-style overload
type InterfaceOverload = {
	(input: string): 1;
	(input: number): 2;
};

declare const interfaceOverload: Overloads<InterfaceOverload>;
expectType<[(input: string) => 1, (input: number) => 2]>(interfaceOverload);

// Same parameters, different `this` types
type SameParametersDifferentThis1 = (this: Date, foo: string) => number;
type SameParametersDifferentThis2 = (this: URL, foo: string) => number;

declare const sameParametersDifferentThis: Overloads<SameParametersDifferentThis1 & SameParametersDifferentThis2>;
expectType<[SameParametersDifferentThis1, SameParametersDifferentThis2]>(sameParametersDifferentThis);
declare const sameParametersDifferentThis2: Overloads<SameParametersDifferentThis2 & SameParametersDifferentThis1>;
expectType<[SameParametersDifferentThis2, SameParametersDifferentThis1]>(sameParametersDifferentThis2);

// Duplicate overloads in interface are collapsed
declare const duplicateOverloads: Overloads<{
	(foo: string, bar: number): object;
	(): string;
	(): string;
}>;
expectType<[Function1, () => string]>(duplicateOverloads);

// Generic overload at intersection level - overloads preceding the generic are now extracted via N-advancement
declare const genericIntersectionOverload: Overloads<((this: string) => string) & (<T>(this: T, argument: T) => T)>;
expectType<[(this: string) => string, (this: unknown, argument: unknown) => unknown]>(genericIntersectionOverload);

// Verify that explicit `this: unknown` is preserved while implicit `this` is omitted.
// `IsEqualStrict` is needed here because neither `expectType` nor `IsEqual` can distinguish the two.

type Function1WithThis<This> = (this: This, foo: string, bar: number) => object;
type Function2WithThis<This> = (this: This, foo: bigint, ...bar: any[]) => void;

// Single overload with explicit `this: unknown`
declare const singleOverloadWithExplicitThisUnknown: Overloads<Function1WithThis<unknown>>;
expectType<IsEqualStrict<typeof singleOverloadWithExplicitThisUnknown, [Function1WithThis<unknown>]>>(true);

// Single overload with implicit `this`
expectType<IsEqualStrict<typeof normalFunction, [Function1]>>(true);

// Mixed explicit `this: unknown` and implicit `this` overloads
declare const mixedExplicitImplicitThis: Overloads<Function1WithThis<unknown> & Function2>;
expectType<IsEqualStrict<typeof mixedExplicitImplicitThis, [Function1WithThis<unknown>, Function2]>>(true);

// Multiple explicit and implicit `this` overloads
declare const multipleExplicitImplicitThis: Overloads<{
	(this: unknown, foo: string, bar: number): object;
	(this: unknown, foo: bigint, ...bar: any[]): void;
	(foo: string, bar: number, baz?: boolean): object;
	(...foo: any[]): void;
}>;
expectType<IsEqualStrict<
	typeof multipleExplicitImplicitThis,
	[Function1WithThis<unknown>, Function2WithThis<unknown>, Function3, Function4]
>>(true);

declare const aliasingGenericOverloads1: Overloads<{
	(foo: string, bar: number): object;
	(this: unknown, l: unknown, r: unknown): [unknown, unknown];
	// <T, U>(l: T, r: U): [U, T];
	<T, U>(l: T, r: U): [T, U];
	<T>(l: T, r: T): [T, T];
	(this: unknown, foo: bigint, ...bar: any[]): void;
}>;
expectType<IsEqualStrict<typeof aliasingGenericOverloads1, [
	Function1,
	(this: unknown, l: unknown, r: unknown) => [unknown, unknown],
	(this: unknown, l: unknown, r: unknown) => [unknown, unknown],
	(this: unknown, l: unknown, r: unknown) => [unknown, unknown],
	Function2WithThis<unknown>,
]>>(true);
declare const aliasingGenericOverloads2: Overloads<{
	(foo: string, bar: number): object;
	<T, U>(l: T, r: U): [T, U];
	<T>(l: T, r: T): [T, T];
	(this: unknown, foo: bigint, ...bar: any[]): void;
}>;
expectType<IsEqualStrict<typeof aliasingGenericOverloads2, [
	Function1,
	(this: unknown, l: unknown, r: unknown) => [unknown, unknown],
	(this: unknown, l: unknown, r: unknown) => [unknown, unknown],
	Function2WithThis<unknown>,
]>>(true);

// When implicit `this` and explicit `this: unknown` overloads share same params/return, implicit may be lost
declare const implicitThenExplicitThis1: Overloads<Function1 & Function1WithThis<1>>;
expectType<IsEqualStrict<typeof implicitThenExplicitThis1, [Function1]>>(true);
// When the explicit `this` overload comes first, the implicit `this` overload may be absorbed
declare const explicitThenImplicitThis1: Overloads<Function1WithThis<1> & Function1>;
expectType<IsEqualStrict<typeof explicitThenImplicitThis1, [Function1WithThis<1>]>>(true);
declare const explicitImplicitExplicitThis: Overloads<Function1WithThis<1> & Function1 & Function1WithThis<2>>;
expectType<IsEqualStrict<typeof explicitImplicitExplicitThis, [Function1WithThis<1>, Function1WithThis<2>]>>(true);
// With `this: unknown` specifically, implicit `this` is always absorbed
declare const implicitThenExplicitThisUnknown: Overloads<Function1 & Function1WithThis<unknown>>;
expectType<IsEqualStrict<typeof implicitThenExplicitThisUnknown, [Function1]>>(true);
declare const explicitThisUnknownThenImplicit: Overloads<Function1WithThis<unknown> & Function1>;
expectType<IsEqualStrict<typeof explicitThisUnknownThenImplicit, [Function1WithThis<unknown>]>>(true);

import {expectType} from 'tsd';
import type {FunctionOverloads} from '../source/function-overloads.d.ts';

type Function1 = (foo: string, bar: number) => object;
type Function2 = (foo: bigint, ...bar: any[]) => void;

declare const normalFunction: FunctionOverloads<Function1>;
expectType<Function1>(normalFunction);

// Note: function overload is equivalent to intersecting its signatures

declare const twoOverloads: FunctionOverloads<Function1 & Function2>;
expectType<Function1 | Function2>(twoOverloads);

declare const twoIdenticalOverloads: FunctionOverloads<Function1>;
expectType<Function1>(twoIdenticalOverloads);

type Function3 = (foo: string, bar: number, baz?: boolean) => object;

declare const twoOverloadWithAssignableSignature: FunctionOverloads<Function1 & Function3>;
expectType<Function1 | Function3>(twoOverloadWithAssignableSignature);

declare const threeOverloads: FunctionOverloads<Function1 & Function2 & Function3>;
expectType<Function1 | Function2 | Function3>(threeOverloads);

type Function4 = (...foo: any[]) => void;
type Function5 = (...foo: readonly any[]) => void;

declare const normalFunctionWithOnlyRestWritableParameter: FunctionOverloads<Function4>;
expectType<Function4>(normalFunctionWithOnlyRestWritableParameter);

declare const normalFunctionWithOnlyRestReadonlyParameter: FunctionOverloads<Function5>;
expectType<Function5>(normalFunctionWithOnlyRestReadonlyParameter);

declare const twoOverloadsWithDifferentRestParameterReadonliness: FunctionOverloads<
	Function4 & Function5
>;
// Expected: it seems like the compiler ignores subsequent identical up to `readonly` modifier overloads
expectType<Function4>(twoOverloadsWithDifferentRestParameterReadonliness);

declare const twoOverloadsWithDifferentRestParameterReadonlinessReversed: FunctionOverloads<
	Function5 & Function4
>;
// Expected: it seems like the compiler ignores subsequent identical up to `readonly` modifier overloads
expectType<Function5>(twoOverloadsWithDifferentRestParameterReadonlinessReversed);

type Function6 = (foo: string, ...bar: any[]) => void;
type Function7 = (foo: string, ...bar: readonly any[]) => void;

declare const normalFunctionWithNormalAndRestWritableParameter: FunctionOverloads<Function6>;
expectType<Function6>(normalFunctionWithNormalAndRestWritableParameter);

declare const normalFunctionWithNormalAndRestReadonlyParameter: FunctionOverloads<Function7>;
// Expected: readonly rest parameter cannot be represented with tuples
expectType<(foo: string, ...bar: any[]) => void>(normalFunctionWithNormalAndRestReadonlyParameter);

type Function8 = () => never;

declare const normalFunctionNoParameters: FunctionOverloads<Function8>;
expectType<Function8>(normalFunctionNoParameters);

declare const twoOverloadsWithNoAndPresentParameters: FunctionOverloads<Function8 & Function6>;
expectType<Function8 | Function6>(twoOverloadsWithNoAndPresentParameters);

type Function9 = (event: 'event9', arg: string) => void;
type Function10 = (event: 'event10', arg: number) => string;
type Function11 = (event: 'event11', arg: boolean) => never;
type Function12 = (event: 'event12', arg: bigint) => object;

declare const manyOverloads: FunctionOverloads<
	Function1 &
	Function2 &
	Function3 &
	Function4 &
	Function5 &
	Function6 &
	Function7 &
	Function8 &
	Function9 &
	Function10 &
	Function11 &
	Function12
>;
expectType<
	| Function1
	| Function2
	| Function3
	| Function4
	| Function5
	| Function6
	| Function7
	| Function8
	| Function9
	| Function10
	| Function11
	| Function12
>(manyOverloads);

declare const noOveloads: FunctionOverloads<{}>;
expectType<never>(noOveloads);

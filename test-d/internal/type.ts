import {expectTypeOf} from 'nz';
import type {Falsy, IsEqual, Merge, MergeAll, PartialDeep, ReadonlyDeep, RequiredDeep, SetOptional, SetReadonly, SetRequired, WritableDeep} from '../../index.d.ts';
import type {CallSignatureOf, FunctionParameters, IsAnyOrNever, IsBothExtends, IsTruthy} from '../../source/internal/index.d.ts';

expectTypeOf<IsEqual<IsAnyOrNever<any>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsAnyOrNever<never>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsAnyOrNever<1>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsAnyOrNever<unknown>, false>>().toBe<true>();

expectTypeOf<IsEqual<IsBothExtends<number, 1, 2>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsBothExtends<number, 1, 'a'>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsBothExtends<number, 'a', 2>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsBothExtends<number, 'a', 'b'>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsBothExtends<string | number, 1, 'a'>, true>>().toBe<true>();
// A union base accepts a union of its own members on both sides.
expectTypeOf<IsEqual<IsBothExtends<string | number, 1 | 'a', 2 | 'b'>, true>>().toBe<true>();

// `CallSignatureOf` rebuilds the call signature with its `this` parameter, which `Parameters` leaves out. `IsEqual` cannot see `this`, so it is checked through `ThisParameterType` and a call with the wrong receiver.
expectTypeOf<IsEqual<ThisParameterType<CallSignatureOf<(this: Date, a: string) => void>>, Date>>().toBe<true>();
declare const callSignatureWithThis: CallSignatureOf<(this: Date, a: string) => void>;
// @ts-expect-error
callSignatureWithThis.call({}, 'a');
expectTypeOf<IsEqual<CallSignatureOf<(a?: string) => number>, (a?: string) => number>>().toBe<true>();

// A function that declares no `this` is rebuilt without one, rather than with `this: unknown`, so a function that declares a `this` is still assignable to it, as it is to the original.
declare const functionWithThis: (this: Date, a: string) => void;
expectTypeOf(functionWithThis).toBeAssignableTo<CallSignatureOf<(a: string) => void>>();

// A type that is not callable, including the `Function` interface, gives `unknown`, so it can be intersected with anything.
expectTypeOf<IsEqual<CallSignatureOf<{a: 1}>, unknown>>().toBe<true>();
expectTypeOf<IsEqual<CallSignatureOf<Function>, unknown>>().toBe<true>();

// An overloaded function keeps only its last signature, and a generic one loses its type parameters.
expectTypeOf<IsEqual<CallSignatureOf<{(a: string): 1; (a: number): 2}>, (a: number) => 2>>().toBe<true>();
expectTypeOf<IsEqual<CallSignatureOf<<Value>(value: Value) => Value>, (value: unknown) => unknown>>().toBe<true>();

// `IsTruthy`
expectTypeOf<IsEqual<IsTruthy<0>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsTruthy<''>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsTruthy<null>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsTruthy<Falsy>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsTruthy<never>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsTruthy<void>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsTruthy<1>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsTruthy<{}>, true>>().toBe<true>();
// Wide types cannot be checked, so they give `true`, the same as `Truthy<number>` is `number`.
expectTypeOf<IsEqual<IsTruthy<number>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsTruthy<string>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsTruthy<unknown>, true>>().toBe<true>();
// A union with both falsy and truthy members gives `boolean`.
expectTypeOf<IsEqual<IsTruthy<boolean>, boolean>>().toBe<true>();
expectTypeOf<IsEqual<IsTruthy<0 | 1>, boolean>>().toBe<true>();
expectTypeOf<IsEqual<IsTruthy<string | void>, boolean>>().toBe<true>();
// `any` matches both branches of the conditional type.
expectTypeOf<IsEqual<IsTruthy<any>, boolean>>().toBe<true>();

// A readonly rest parameter remains callable when an object transformation preserves its call signature.
type ReadonlyRestHandler = ((...values: readonly number[]) => string) & {config: {label: string}};
declare const readonlyRestSignature: CallSignatureOf<ReadonlyRestHandler>;
expectTypeOf(readonlyRestSignature(1, 2)).toBe<string>();

declare const readonlyRestDeep: ReadonlyDeep<ReadonlyRestHandler>;
declare const partialRestDeep: PartialDeep<ReadonlyRestHandler>;
declare const requiredRestDeep: RequiredDeep<ReadonlyRestHandler>;
declare const writableRestDeep: WritableDeep<ReadonlyRestHandler>;
declare const requiredRestProperty: SetRequired<ReadonlyRestHandler, 'config'>;
declare const optionalRestProperty: SetOptional<ReadonlyRestHandler, 'config'>;
declare const readonlyRestProperty: SetReadonly<ReadonlyRestHandler, 'config'>;
expectTypeOf(readonlyRestDeep(1, 2)).toBe<string>();
expectTypeOf(partialRestDeep(1, 2)).toBe<string>();
expectTypeOf(requiredRestDeep(1, 2)).toBe<string>();
expectTypeOf(writableRestDeep(1, 2)).toBe<string>();
expectTypeOf(requiredRestProperty(1, 2)).toBe<string>();
expectTypeOf(optionalRestProperty(1, 2)).toBe<string>();
expectTypeOf(readonlyRestProperty(1, 2)).toBe<string>();

// Rebuilding preserves readonly argument arrays, tuple slots and the explicit receiver independently.
expectTypeOf<FunctionParameters<CallSignatureOf<ReadonlyRestHandler>>>().toBe<readonly number[]>();
expectTypeOf<FunctionParameters<CallSignatureOf<(...values: readonly [string, number?]) => void>>>().toBe<[string, number?]>();
declare const readonlyRestWithThis: CallSignatureOf<(this: Date, ...values: readonly number[]) => string>;
expectTypeOf<ThisParameterType<typeof readonlyRestWithThis>>().toBe<Date>();
expectTypeOf(readonlyRestWithThis.call(new Date(), 1, 2)).toBe<string>();
// @ts-expect-error The receiver still has to be a Date.
readonlyRestWithThis.call({}, 1);
// @ts-expect-error A readonly rest array still rejects the wrong element type.
readonlyRestSignature('invalid');

// Merging retains the selected call signature while overriding the ordinary object fields.
declare const mergedRestHandler: Merge<ReadonlyRestHandler, {config: {enabled: boolean}}>;
expectTypeOf(mergedRestHandler(1, 2)).toBe<string>();
expectTypeOf(mergedRestHandler.config).toBe<{enabled: boolean}>();
declare const mergedRestSource: Merge<{config: null}, ReadonlyRestHandler>;
expectTypeOf(mergedRestSource(1, 2)).toBe<string>();
expectTypeOf(mergedRestSource.config).toBe<{label: string}>();
declare const layeredRestHandler: MergeAll<[ReadonlyRestHandler, {config: {enabled: boolean}}, {id: string}]>;
expectTypeOf(layeredRestHandler(1, 2)).toBe<string>();
expectTypeOf(layeredRestHandler.id).toBe<string>();

expectTypeOf<CallSignatureOf<any>>().toBe<unknown>();
expectTypeOf<CallSignatureOf<never>>().toBe<never>();
expectTypeOf<CallSignatureOf<unknown>>().toBe<unknown>();

// Sentinel detection considers the value itself rather than nested sentinel fields.
expectTypeOf<IsAnyOrNever<{value: any}>>().toBe<false>();
expectTypeOf<IsAnyOrNever<{value: never}>>().toBe<false>();
expectTypeOf<IsAnyOrNever<readonly never[]>>().toBe<false>();
expectTypeOf<IsAnyOrNever<string | never>>().toBe<false>();
expectTypeOf<IsAnyOrNever<string | any>>().toBe<true>();

function _readSentinelFlag<Value>(flag: IsAnyOrNever<Value>): boolean {
	return flag;
}

// Rebuilding each member preserves its receiver, readonly arguments and return value together.
type CallbackAlternatives = ((this: Date, ...values: readonly number[]) => Promise<string>) | ((this: RegExp, name?: string) => boolean);
expectTypeOf<CallSignatureOf<CallbackAlternatives>>().toBe<CallbackAlternatives>();
expectTypeOf<CallSignatureOf<(this: undefined, ...values: readonly number[]) => any>>().toBe<(this: undefined, ...values: readonly number[]) => any>();
expectTypeOf<CallSignatureOf<(this: any, value: unknown) => never>>().toBe<(value: unknown) => never>();
expectTypeOf<CallSignatureOf<() => unknown>>().toBe<() => unknown>();

function _constructCallSignature<Receiver, Arguments extends readonly unknown[], Result>(
	callback: (this: Receiver, ...arguments_: Arguments) => Result,
): CallSignatureOf<(this: Receiver, ...arguments_: Arguments) => Result> {
	return callback;
}

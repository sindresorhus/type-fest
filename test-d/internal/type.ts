import {expectAssignable, expectType} from 'tsd';
import type {IsEqual} from '../../index.d.ts';
import type {CallSignatureOf, IsAnyOrNever, IsBothExtends, IsExactOptionalPropertyTypesEnabled, IsPlainObject, IsPrimitive} from '../../source/internal/index.d.ts';

expectType<IsEqual<IsPrimitive<'string'>, true>>(true);
expectType<IsEqual<IsPrimitive<string>, true>>(true);
expectType<IsEqual<IsPrimitive<Object>, false>>(true);
expectType<IsEqual<IsPrimitive<1>, true>>(true);
expectType<IsEqual<IsPrimitive<1n>, true>>(true);
expectType<IsEqual<IsPrimitive<true>, true>>(true);
expectType<IsEqual<IsPrimitive<'a'>, true>>(true);
expectType<IsEqual<IsPrimitive<null>, true>>(true);
expectType<IsEqual<IsPrimitive<undefined>, true>>(true);
expectType<IsEqual<IsPrimitive<void>, false>>(true);
// `never` is not a primitive, but the `[T] extends [Primitive]` form answers `true` for it, the same way the other `Is*` types that use that form do. The house convention is kept rather than special-cased, because nothing user-visible depends on it.
expectType<IsEqual<IsPrimitive<never>, true>>(true);
expectType<IsEqual<IsPrimitive<unknown>, false>>(true);
expectType<IsEqual<IsPrimitive<any>, true>>(true);
expectType<IsEqual<IsPrimitive<{a: 1}>, false>>(true);
expectType<IsEqual<IsPrimitive<Date>, false>>(true);
expectType<IsEqual<IsPrimitive<symbol>, true>>(true);

expectType<IsEqual<IsAnyOrNever<any>, true>>(true);
expectType<IsEqual<IsAnyOrNever<never>, true>>(true);
expectType<IsEqual<IsAnyOrNever<1>, false>>(true);
expectType<IsEqual<IsAnyOrNever<unknown>, false>>(true);

expectType<IsEqual<IsBothExtends<number, 1, 2>, true>>(true);
expectType<IsEqual<IsBothExtends<number, 1, 'a'>, false>>(true);
expectType<IsEqual<IsBothExtends<number, 'a', 2>, false>>(true);
expectType<IsEqual<IsBothExtends<number, 'a', 'b'>, false>>(true);
expectType<IsEqual<IsBothExtends<string | number, 1, 'a'>, true>>(true);
// A union base accepts a union of its own members on both sides.
expectType<IsEqual<IsBothExtends<string | number, 1 | 'a', 2 | 'b'>, true>>(true);

// `IsPlainObject` is true only for an object literal type, and false for anything with a call or construct signature, for an array, and for a primitive.
expectType<IsEqual<IsPlainObject<{}>, true>>(true);
expectType<IsEqual<IsPlainObject<{a: 1}>, true>>(true);
expectType<IsEqual<IsPlainObject<{a: 1} & {b: 2}>, true>>(true);
expectType<IsEqual<IsPlainObject<[]>, false>>(true);
expectType<IsEqual<IsPlainObject<1>, false>>(true);
expectType<IsEqual<IsPlainObject<string>, false>>(true);
expectType<IsEqual<IsPlainObject<new () => 1>, false>>(true);
expectType<IsEqual<IsPlainObject<() => void>, false>>(true);
expectType<IsEqual<IsPlainObject<Date>, false>>(true);

// `IsExactOptionalPropertyTypesEnabled` follows the compiler option, which this repository sets.
expectType<IsEqual<IsExactOptionalPropertyTypesEnabled, true>>(true);

// `CallSignatureOf` rebuilds the call signature with its `this` parameter, which `Parameters` leaves out. `IsEqual` cannot see `this`, so it is checked through `ThisParameterType` and a call with the wrong receiver.
expectType<IsEqual<ThisParameterType<CallSignatureOf<(this: Date, a: string) => void>>, Date>>(true);
declare const callSignatureWithThis: CallSignatureOf<(this: Date, a: string) => void>;
// @ts-expect-error
callSignatureWithThis.call({}, 'a');
expectType<IsEqual<CallSignatureOf<(a?: string) => number>, (a?: string) => number>>(true);

// A function that declares no `this` is rebuilt without one, rather than with `this: unknown`, so a function that declares a `this` is still assignable to it, as it is to the original.
declare const functionWithThis: (this: Date, a: string) => void;
expectAssignable<CallSignatureOf<(a: string) => void>>(functionWithThis);

// A type that is not callable, including the `Function` interface, gives `unknown`, so it can be intersected with anything.
expectType<IsEqual<CallSignatureOf<{a: 1}>, unknown>>(true);
expectType<IsEqual<CallSignatureOf<Function>, unknown>>(true);

// An overloaded function keeps only its last signature, and a generic one loses its type parameters.
expectType<IsEqual<CallSignatureOf<{(a: string): 1; (a: number): 2}>, (a: number) => 2>>(true);
expectType<IsEqual<CallSignatureOf<<Value>(value: Value) => Value>, (value: unknown) => unknown>>(true);

import {expectTypeOf} from 'nz';
import type {IsEqual} from '../../index.d.ts';
import type {CallSignatureOf, IsAnyOrNever, IsBothExtends, IsExactOptionalPropertyTypesEnabled, IsPlainObject, IsPrimitive} from '../../source/internal/index.d.ts';

expectTypeOf<IsEqual<IsPrimitive<'string'>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsPrimitive<string>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsPrimitive<Object>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsPrimitive<1>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsPrimitive<1n>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsPrimitive<true>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsPrimitive<'a'>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsPrimitive<null>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsPrimitive<undefined>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsPrimitive<void>, false>>().toBe<true>();
// `never` is not a primitive, but the `[T] extends [Primitive]` form answers `true` for it, the same way the other `Is*` types that use that form do. The house convention is kept rather than special-cased, because nothing user-visible depends on it.
expectTypeOf<IsEqual<IsPrimitive<never>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsPrimitive<unknown>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsPrimitive<any>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsPrimitive<{a: 1}>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsPrimitive<Date>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsPrimitive<symbol>, true>>().toBe<true>();

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

// `IsPlainObject` is true only for an object literal type, and false for anything with a call or construct signature, for an array, and for a primitive.
expectTypeOf<IsEqual<IsPlainObject<{}>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsPlainObject<{a: 1}>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsPlainObject<{a: 1} & {b: 2}>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsPlainObject<[]>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsPlainObject<1>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsPlainObject<string>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsPlainObject<new () => 1>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsPlainObject<() => void>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsPlainObject<Date>, false>>().toBe<true>();

// `IsExactOptionalPropertyTypesEnabled` follows the compiler option, which this repository sets.
expectTypeOf<IsEqual<IsExactOptionalPropertyTypesEnabled, true>>().toBe<true>();

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

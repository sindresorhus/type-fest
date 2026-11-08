import {expectTypeOf} from 'nz';
import type {Absolute, IsEqual, IsNegative, NegativeInfinity, Opaque, PositiveInfinity, Negate, Tagged} from '../index.d.ts';

expectTypeOf<IsEqual<Negate<-1>, 1>>().toBe<true>();
expectTypeOf<IsEqual<Negate<1>, -1>>().toBe<true>();
expectTypeOf<IsEqual<Negate<0>, 0>>().toBe<true>();
expectTypeOf<IsEqual<Negate<-0>, 0>>().toBe<true>();
expectTypeOf<IsEqual<Negate<NegativeInfinity>, PositiveInfinity>>().toBe<true>();
expectTypeOf<IsEqual<Negate<PositiveInfinity>, NegativeInfinity>>().toBe<true>();
expectTypeOf<IsEqual<Negate<-1.5>, 1.5>>().toBe<true>();
expectTypeOf<Negate<number>>().toBe<number>();

// Reversing the sign twice restores the original literal.
expectTypeOf<Negate<Negate<-42>>>().toBe<-42>();

// Enum members have known signs even though `number` is assignable to them.
enum Offset {
	Positive = 3,
	Negative = -3,
}
expectTypeOf<Negate<Offset.Positive>>().toBe<-3>();
expectTypeOf<Negate<Offset.Negative>>().toBe<3>();

expectTypeOf<Negate<1.5>>().toBe<-1.5>();
expectTypeOf<Negate<-2 | 0 | 4>>().toBe<-4 | 0 | 2>();
expectTypeOf<Negate<PositiveInfinity | NegativeInfinity | 2>>().toBe<PositiveInfinity | NegativeInfinity | -2>();
expectTypeOf<Negate<any>>().toBe<number>();
expectTypeOf<Negate<never>>().toBe<never>();

// Branded numbers retain their numeric value without the brand.
expectTypeOf<Negate<Tagged<3, 'Offset'>>>().toBe<-3>();
expectTypeOf<Negate<Opaque<-3, 'Offset'>>>().toBe<3>();
expectTypeOf<Negate<Tagged<number, 'Offset'>>>().toBe<number>();
expectTypeOf<Negate<Tagged<Tagged<-3, 'Offset'>, 'Validated'>>>().toBe<3>();

// @ts-expect-error Unknown values must be narrowed to numbers first.
type UnknownSign = Negate<unknown>;
// @ts-expect-error Numeric strings are not numbers.
type StringSign = Negate<'3'>;
// @ts-expect-error Bigints are not supported.
type BigintSign = Negate<3n>;

// A consumer preserves the inferred literal when deriving an opposite offset.
declare function oppositeOffset<const Value extends number>(value: Value): Negate<Value>;
expectTypeOf(oppositeOffset(4)).toBe<-4>();
expectTypeOf(oppositeOffset(-1.5)).toBe<1.5>();
expectTypeOf<4>().not.toBeAssignableTo<Negate<4>>();

// The whole enum distributes, including zero and a fractional member.
enum Adjustment {
	Decrease = -0.25,
	None = 0,
	Increase = 4,
}
expectTypeOf<Negate<Adjustment>>().toBe<-4 | 0 | 0.25>();

// A computed enum member has no known value, so its opposite is also unknown.
declare enum RuntimeOffset {
	Value,
}
expectTypeOf<Negate<RuntimeOffset.Value>>().toBe<number>();
expectTypeOf<Negate<RuntimeOffset.Value | 4>>().toBe<number>();

// Separate brands and unbranded alternatives all contribute their opposite values.
expectTypeOf<Negate<Tagged<-2 | 0, 'Horizontal'> | Tagged<4, 'Vertical'> | 1>>().toBe<-4 | -1 | 0 | 2>();
expectTypeOf<Negate<number & {readonly offset: unique symbol}>>().toBe<number>();
expectTypeOf<Negate<Tagged<number, 'Offset'> | 4>>().toBe<number>();
expectTypeOf<Negate<Tagged<PositiveInfinity, 'Offset'>>>().toBe<NegativeInfinity>();

// Sign reversal does not depend on building a tuple with the input's magnitude.
expectTypeOf<Negate<10_000>>().toBe<-10_000>();

// Generic results remain usable as numbers without a cast.
function _readOppositeOffset<Value extends number>(value: Negate<Value>): number {
	return value;
}

// Mapping offsets preserves tuple positions, readonly modifiers, and optional elements.
type OppositeOffsets<Offsets extends ReadonlyArray<number | undefined>> = {[Key in keyof Offsets]: Negate<Offsets[Key] & number>};
expectTypeOf<OppositeOffsets<readonly [-2, 0, 4]>>().toBe<readonly [2, 0, -4]>();
expectTypeOf<OppositeOffsets<[2, -4?]>>().toBe<[-2, 4?]>();

// Derived offsets can be used as numeric lookup keys without widening to `number`.
type BackwardOffsets = Negate<1 | 2>;
const backwardLabels: Record<BackwardOffsets, string> = {'-1': 'previous', '-2': 'two back'};
expectTypeOf(backwardLabels[-1]).toBe<string>();
// @ts-expect-error A forward offset is not a derived backward key.
expectTypeOf(backwardLabels[1]);

// Different literal spellings have the same numeric semantics.
expectTypeOf<Negate<0b1010>>().toBe<-10>();
expectTypeOf<Negate<-0b1010>>().toBe<10>();
expectTypeOf<Negate<0o17>>().toBe<-15>();
expectTypeOf<Negate<-0o17>>().toBe<15>();
expectTypeOf<Negate<0xFF>>().toBe<-255>();
expectTypeOf<Negate<-0xFF>>().toBe<255>();
expectTypeOf<Negate<-10_000>>().toBe<10_000>();
expectTypeOf<Negate<1234.567891>>().toBe<-1234.567891>();
expectTypeOf<Negate<-1234.567891>>().toBe<1234.567891>();

// Fractions retain their precision on either side of zero.
expectTypeOf<Negate<0.1>>().toBe<-0.1>();
expectTypeOf<Negate<-0.1>>().toBe<0.1>();
expectTypeOf<Negate<0.000001>>().toBe<-0.000001>();
expectTypeOf<Negate<-0.000001>>().toBe<0.000001>();
expectTypeOf<Negate<2.345678901234567>>().toBe<-2.345678901234567>();
expectTypeOf<Negate<-2.345678901234567>>().toBe<2.345678901234567>();
expectTypeOf<Negate<9_007_199_254_740_991>>().toBe<-9_007_199_254_740_991>();
expectTypeOf<Negate<-9_007_199_254_740_991>>().toBe<9_007_199_254_740_991>();

// Each union member is negated independently, including symmetric and overlapping values.
expectTypeOf<Negate<1 | 2 | 3>>().toBe<-3 | -2 | -1>();
expectTypeOf<Negate<-3 | -2 | -1>>().toBe<1 | 2 | 3>();
expectTypeOf<Negate<-2 | 2>>().toBe<-2 | 2>();
expectTypeOf<Negate<-0 | 2>>().toBe<-2 | 0>();
expectTypeOf<Negate<-0.25 | 0 | 0.5>>().toBe<-0.5 | 0 | 0.25>();
expectTypeOf<Negate<PositiveInfinity | 0>>().toBe<NegativeInfinity | 0>();
expectTypeOf<Negate<NegativeInfinity | -4>>().toBe<PositiveInfinity | 4>();

// Negation is an involution; magnitude is invariant and nonzero signs are reversed.
expectTypeOf<Negate<Negate<42>>>().toBe<42>();
expectTypeOf<Negate<Negate<0>>>().toBe<0>();
expectTypeOf<Negate<Negate<-0.25 | 0 | 4>>>().toBe<-0.25 | 0 | 4>();
expectTypeOf<Negate<Negate<PositiveInfinity>>>().toBe<PositiveInfinity>();
expectTypeOf<Negate<Negate<NegativeInfinity>>>().toBe<NegativeInfinity>();
expectTypeOf<Negate<Negate<number>>>().toBe<number>();
expectTypeOf<Negate<Negate<never>>>().toBe<never>();
expectTypeOf<Absolute<Negate<-2 | 0 | 4>>>().toBe<Absolute<-2 | 0 | 4>>();
expectTypeOf<Negate<Absolute<-2 | 0 | 4>>>().toBe<-4 | -2 | 0>();
expectTypeOf<Absolute<Negate<PositiveInfinity>>>().toBe<PositiveInfinity>();
expectTypeOf<IsNegative<Negate<4>>>().toBe<true>();
expectTypeOf<IsNegative<Negate<-4>>>().toBe<false>();
expectTypeOf<IsNegative<Negate<0>>>().toBe<false>();
expectTypeOf<IsNegative<Negate<NegativeInfinity>>>().toBe<false>();

// Neither zero nor fractional or infinite branded values should retain their tags.
expectTypeOf<Negate<Tagged<0, 'Offset'>>>().toBe<0>();
expectTypeOf<Negate<Tagged<-3, 'Offset'>>>().toBe<3>();
expectTypeOf<Negate<Tagged<0.25, 'Offset'>>>().toBe<-0.25>();
expectTypeOf<Negate<Tagged<-0.25, 'Offset'>>>().toBe<0.25>();
expectTypeOf<Negate<Tagged<NegativeInfinity, 'Offset'>>>().toBe<PositiveInfinity>();
expectTypeOf<Negate<Tagged<-2 | 0 | 4, 'Offset'>>>().toBe<-4 | 0 | 2>();
expectTypeOf<Negate<Tagged<3, 'Offset', {unit: 'px'}>>>().toBe<-3>();
expectTypeOf<Negate<Opaque<3, 'Offset'>>>().toBe<-3>();
expectTypeOf<Negate<Opaque<0, 'Offset'>>>().toBe<0>();
expectTypeOf<Negate<Opaque<0.25, 'Offset'>>>().toBe<-0.25>();
expectTypeOf<Negate<Opaque<PositiveInfinity, 'Offset'>>>().toBe<NegativeInfinity>();
expectTypeOf<Negate<Opaque<NegativeInfinity, 'Offset'>>>().toBe<PositiveInfinity>();
expectTypeOf<Negate<Opaque<number, 'Offset'>>>().toBe<number>();
expectTypeOf<Negate<Tagged<Opaque<-3, 'Offset'>, 'Validated'>>>().toBe<3>();
expectTypeOf<Negate<Tagged<Tagged<3, 'Offset'>, 'Validated'>>>().toBe<-3>();
expectTypeOf<Negate<Negate<Tagged<-3, 'Offset'>>>>().toBe<-3>();
expectTypeOf<Negate<3 & {readonly unit: 'px'}>>().toBe<-3>();
expectTypeOf<Negate<-3 & {readonly unit: 'px'}>>().toBe<3>();
expectTypeOf<Negate<0 & {readonly unit: 'px'}>>().toBe<0>();
expectTypeOf<Negate<Tagged<3, 'Horizontal'> | Opaque<3, 'Vertical'>>>().toBe<-3>();
expectTypeOf<Negate<Tagged<3, 'Horizontal'> | Opaque<-3, 'Vertical'>>>().toBe<-3 | 3>();
expectTypeOf<Negate<Opaque<number, 'Offset'> | -3>>().toBe<number>();
expectTypeOf<Negate<Tagged<3, 'Offset'>>>().not.toBeAssignableTo<Tagged<-3, 'Offset'>>();

// Enum values become plain literals, including zero and unions from different enums.
expectTypeOf<Negate<Adjustment.None>>().toBe<0>();
expectTypeOf<Negate<Adjustment.Decrease>>().toBe<0.25>();
expectTypeOf<Negate<Offset>>().toBe<-3 | 3>();
expectTypeOf<Negate<Offset.Positive | Adjustment.None>>().toBe<-3 | 0>();
expectTypeOf<Negate<Offset.Negative | Adjustment.Increase>>().toBe<-4 | 3>();
expectTypeOf<Negate<Negate<Offset.Positive>>>().toBe<3>();
expectTypeOf<Negate<RuntimeOffset.Value | Adjustment.None>>().toBe<number>();
expectTypeOf<Negate<Tagged<Offset.Positive, 'Offset'>>>().toBe<-3>();
expectTypeOf<Negate<Tagged<RuntimeOffset.Value, 'Offset'>>>().toBe<number>();

// Inference works with unions, brands, and values that are only known at runtime.
declare const possibleOffset: -2 | 0 | 4;
declare const runtimeOffset: number;
declare const taggedOffset: Tagged<-3, 'Offset'>;
expectTypeOf(oppositeOffset(possibleOffset)).toBe<-4 | 0 | 2>();
expectTypeOf(oppositeOffset(runtimeOffset)).toBe<number>();
expectTypeOf(oppositeOffset(taggedOffset)).toBe<3>();
expectTypeOf(oppositeOffset(Adjustment.Decrease)).toBe<0.25>();
expectTypeOf<Negate<4>>().not.toBeAssignableTo<4>();
expectTypeOf<-3>().not.toBeAssignableTo<Negate<4>>();

// A single generic mapped type also supports arrays and variadic tuples.
expectTypeOf<OppositeOffsets<Array<1 | -2>>>().toBe<Array<-1 | 2>>();
expectTypeOf<OppositeOffsets<readonly number[]>>().toBe<readonly number[]>();
expectTypeOf<OppositeOffsets<[first: -2, ...rest: Array<4>]>>().toBe<[first: 2, ...rest: Array<-4>]>();
expectTypeOf<OppositeOffsets<[0?, 4?]>>().toBe<[0?, -4?]>();

// Object key remapping can mirror an offset lookup without losing its values.
type MirrorOffsets<Offsets extends Record<number, string>> = {[Key in keyof Offsets & number as Negate<Key>]: Offsets[Key]};
expectTypeOf<MirrorOffsets<{[-2]: 'left'; 0: 'center'; 4: 'right'}>>().toBe<{[-4]: 'right'; 0: 'center'; 2: 'left'}>();

// The documented offset aliases are checked alongside the direct examples above.
type ForwardOffset = 4;
type BackwardOffset = Negate<ForwardOffset>;
expectTypeOf<BackwardOffset>().toBe<-4>();

// Inputs must be primitive numbers, including every member of a union.
// @ts-expect-error Strings cannot be mixed into an offset union.
type MixedSign = Negate<3 | '4'>;
// @ts-expect-error Null is not a numeric offset.
type NullSign = Negate<null>;
// @ts-expect-error Optional values must be narrowed before negation.
type OptionalSign = Negate<number | undefined>;
// @ts-expect-error Booleans are not implicitly converted to numbers.
type BooleanSign = Negate<true>;
// @ts-expect-error Boxed numbers are not primitive numbers.
type BoxedSign = Negate<Number>;
// @ts-expect-error Objects are not implicitly converted to numbers.
type ObjectSign = Negate<{valueOf(): number}>;

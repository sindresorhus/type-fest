import {expectTypeOf} from 'nz';
import type {ArrayAt, Opaque, PositiveInfinity, NegativeInfinity, Tagged, TupleOf} from '../index.d.ts';

expectTypeOf<ArrayAt<[string], 0>>().toBe<string>();
expectTypeOf<ArrayAt<[string], -1>>().toBe<string>();

expectTypeOf<ArrayAt<[], 0>>().toBe<undefined>();
expectTypeOf<ArrayAt<[], -1>>().toBe<undefined>();

expectTypeOf<ArrayAt<[number, boolean], 0>>().toBe<number>();
expectTypeOf<ArrayAt<[number, boolean], 1>>().toBe<boolean>();
expectTypeOf<ArrayAt<[number, boolean], 2>>().toBe<undefined>();
expectTypeOf<ArrayAt<[number, boolean], 99>>().toBe<undefined>();
expectTypeOf<ArrayAt<[number, boolean], -1>>().toBe<boolean>();
expectTypeOf<ArrayAt<[number, boolean], -2>>().toBe<number>();
expectTypeOf<ArrayAt<[number, boolean], -3>>().toBe<undefined>();
expectTypeOf<ArrayAt<[number, boolean], -99>>().toBe<undefined>();

expectTypeOf<ArrayAt<[number, boolean?], 0>>().toBe<number>();
expectTypeOf<ArrayAt<[number, boolean?], 1>>().toBe<boolean | undefined>();
expectTypeOf<ArrayAt<[number, boolean?], 2>>().toBe<undefined>();
expectTypeOf<ArrayAt<[number, boolean?], 99>>().toBe<undefined>();
expectTypeOf<ArrayAt<[number, boolean?], -1>>().toBe<number | boolean>();
expectTypeOf<ArrayAt<[number, boolean?], -2>>().toBe<number | undefined>();
expectTypeOf<ArrayAt<[number, boolean?], -3>>().toBe<undefined>();
expectTypeOf<ArrayAt<[number, boolean?], -99>>().toBe<undefined>();

type StaticArray = [object, number, boolean?, string?];
expectTypeOf<ArrayAt<StaticArray, 0>>().toBe<object>();
expectTypeOf<ArrayAt<StaticArray, 1>>().toBe<number>();
expectTypeOf<ArrayAt<StaticArray, 2>>().toBe<boolean | undefined>();
expectTypeOf<ArrayAt<StaticArray, 3>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<StaticArray, -1>>().toBe<string | boolean | number>();
expectTypeOf<ArrayAt<StaticArray, -2>>().toBe<boolean | number | object>();
expectTypeOf<ArrayAt<StaticArray, -3>>().toBe<number | object | undefined>();
expectTypeOf<ArrayAt<StaticArray, -4>>().toBe<object | undefined>();
expectTypeOf<ArrayAt<StaticArray, -5>>().toBe<undefined>();
expectTypeOf<ArrayAt<StaticArray, -99>>().toBe<undefined>();

type LeadingSpreadArray = [...string[], number, boolean];
expectTypeOf<ArrayAt<LeadingSpreadArray, 0>>().toBe<string | number>();
expectTypeOf<ArrayAt<LeadingSpreadArray, 1>>().toBe<string | number | boolean>();
expectTypeOf<ArrayAt<LeadingSpreadArray, 2>>().toBe<string | number | boolean | undefined>();
expectTypeOf<ArrayAt<LeadingSpreadArray, 3>>().toBe<string | number | boolean | undefined>();
expectTypeOf<ArrayAt<LeadingSpreadArray, -1>>().toBe<boolean>();
expectTypeOf<ArrayAt<LeadingSpreadArray, -2>>().toBe<number>();
expectTypeOf<ArrayAt<LeadingSpreadArray, -3>>().toBe<string | undefined>();

type TrailingSpreadArray = [number, boolean, ...string[]];
expectTypeOf<ArrayAt<TrailingSpreadArray, 0>>().toBe<number>();
expectTypeOf<ArrayAt<TrailingSpreadArray, 1>>().toBe<boolean>();
expectTypeOf<ArrayAt<TrailingSpreadArray, 2>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<TrailingSpreadArray, 3>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<TrailingSpreadArray, -1>>().toBe<string | boolean>();
expectTypeOf<ArrayAt<TrailingSpreadArray, -2>>().toBe<boolean | string | number>();
expectTypeOf<ArrayAt<TrailingSpreadArray, -3>>().toBe<boolean | string | number | undefined>();

type TrailingSpreadArray2 = [object, number, boolean?, ...string[]];
expectTypeOf<ArrayAt<TrailingSpreadArray2, 0>>().toBe<object>();
expectTypeOf<ArrayAt<TrailingSpreadArray2, 1>>().toBe<number>();
expectTypeOf<ArrayAt<TrailingSpreadArray2, 2>>().toBe<boolean | undefined>();
expectTypeOf<ArrayAt<TrailingSpreadArray2, 3>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<TrailingSpreadArray2, -1>>().toBe<string | number | boolean>();
expectTypeOf<ArrayAt<TrailingSpreadArray2, -2>>().toBe<string | number | boolean | object>();
expectTypeOf<ArrayAt<TrailingSpreadArray2, -3>>().toBe<string | number | boolean | object | undefined>();

type MiddleSpreadArray = [number, ...string[], boolean];
expectTypeOf<ArrayAt<MiddleSpreadArray, 0>>().toBe<number>();
expectTypeOf<ArrayAt<MiddleSpreadArray, 1>>().toBe<string | boolean>();
expectTypeOf<ArrayAt<MiddleSpreadArray, 2>>().toBe<string | boolean | undefined>();
expectTypeOf<ArrayAt<MiddleSpreadArray, 3>>().toBe<string | boolean | undefined>();
expectTypeOf<ArrayAt<MiddleSpreadArray, -1>>().toBe<boolean>();
expectTypeOf<ArrayAt<MiddleSpreadArray, -2>>().toBe<string | number>();
expectTypeOf<ArrayAt<MiddleSpreadArray, -3>>().toBe<string | number | undefined>();

type UnionArray = [string, number] | [boolean, string?];
expectTypeOf<ArrayAt<UnionArray, 0>>().toBe<string | boolean>();
expectTypeOf<ArrayAt<UnionArray, 1>>().toBe<number | string | undefined>();
expectTypeOf<ArrayAt<UnionArray, -1>>().toBe<number | string | boolean>();
expectTypeOf<ArrayAt<UnionArray, -2>>().toBe<undefined | string | boolean>();

expectTypeOf<ArrayAt<string[], 0>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<string[], 1>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<string[], 2>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<string[], -1>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<string[], -2>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<string[], -3>>().toBe<string | undefined>();

expectTypeOf<ArrayAt<readonly string[], 0>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<readonly string[], 1>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<readonly string[], 2>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<readonly string[], -1>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<readonly string[], -2>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<readonly string[], -3>>().toBe<string | undefined>();

expectTypeOf<ArrayAt<readonly [string, number], 0>>().toBe<string>();
expectTypeOf<ArrayAt<readonly [string, number], 1>>().toBe<number>();
expectTypeOf<ArrayAt<readonly [string, number], 2>>().toBe<undefined>();
expectTypeOf<ArrayAt<readonly [string, number], -1>>().toBe<number>();

// Test unknown index
expectTypeOf<ArrayAt<[1, 2, 3], number>>().toBe<1 | 2 | 3 | undefined>();
expectTypeOf<ArrayAt<string[], number>>().toBe<string | undefined>();

// Union of indices, including mixed signs
expectTypeOf<ArrayAt<[string, number], 0 | -1>>().toBe<string | number>();
expectTypeOf<ArrayAt<[1, 2, 3], 0 | 2>>().toBe<1 | 3>();

// An optional element only adds itself at its own position
expectTypeOf<ArrayAt<[boolean, number?, {symbolic: true}?, ...string[]], 1>>().toBe<number | undefined>();

// Leading rest element
expectTypeOf<ArrayAt<[...string[], 1, 2], 0>>().toBe<string | 1>();
expectTypeOf<ArrayAt<[...string[], 1, 2], -3>>().toBe<string | undefined>();

// Only optional elements
expectTypeOf<ArrayAt<[1?, 2?], 0>>().toBe<1 | undefined>();
expectTypeOf<ArrayAt<[1?, 2?], -1>>().toBe<1 | 2 | undefined>();

// Large indices
expectTypeOf<ArrayAt<[1, 2], 999>>().toBe<undefined>();
expectTypeOf<ArrayAt<[1, 2], -999>>().toBe<undefined>();
expectTypeOf<ArrayAt<[1, ...string[], 2], 500>>().toBe<string | 2 | undefined>();
expectTypeOf<ArrayAt<[1, ...string[], 2], -500>>().toBe<string | 1 | undefined>();

// Edge cases
expectTypeOf<ArrayAt<any, 0>>().toBe<any>();
expectTypeOf<ArrayAt<never, 0>>().toBe<never>();
expectTypeOf<ArrayAt<unknown[], 0>>().toBe<unknown>();
expectTypeOf<ArrayAt<[1, 2], never>>().toBe<never>();
expectTypeOf<ArrayAt<[1, 2], any>>().toBe<1 | 2 | undefined>();
expectTypeOf<ArrayAt<any[], 0>>().toBe<any>();
expectTypeOf<ArrayAt<never[], 0>>().toBe<undefined>();

// A large positive index does not build a large union of indices
expectTypeOf<ArrayAt<[1, 2], 5000>>().toBe<undefined>();
expectTypeOf<ArrayAt<string[], 5000>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<[...string[], 1], 5000>>().toBe<string | 1 | undefined>();

// An index past the elements after the rest element can land on any of them
type MiddleRest = ['a', ...number[], 'y', 'z'];
expectTypeOf<ArrayAt<MiddleRest, 1>>().toBe<number | 'y'>();
expectTypeOf<ArrayAt<MiddleRest, 2>>().toBe<number | 'y' | 'z'>();
expectTypeOf<ArrayAt<MiddleRest, 3>>().toBe<number | 'y' | 'z' | undefined>();

// A known position in a fixed tuple does not require walking all the other elements.
expectTypeOf<ArrayAt<[1, ...TupleOf<1100>], 0>>().toBe<1>();
expectTypeOf<ArrayAt<readonly [1, ...TupleOf<1100>], 0>>().toBe<1>();
expectTypeOf<ArrayAt<[...TupleOf<1100>, 2], 1100>>().toBe<2>();
expectTypeOf<ArrayAt<readonly [...TupleOf<1100>, 2?], 1100>>().toBe<2 | undefined>();
expectTypeOf<ArrayAt<[...TupleOf<1100>, 2, ...string[]], 1100>>().toBe<2>();

// Declared tuple positions preserve explicitly allowed `undefined` as well as required values.
expectTypeOf<ArrayAt<[string | undefined, ...number[]], 0>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<readonly [undefined, 1], 0>>().toBe<undefined>();
expectTypeOf<ArrayAt<[never, ...TupleOf<1100>], 0>>().toBe<never>();
expectTypeOf<ArrayAt<[any, ...TupleOf<1100>], 0>>().toBe<any>();
expectTypeOf<ArrayAt<[unknown, ...TupleOf<1100>], 0>>().toBe<unknown>();

// A numeric length refinement does not declare any tuple positions.
expectTypeOf<ArrayAt<string[] & {length: 3}, 0>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<readonly string[] & {readonly length: 3}, 0>>().toBe<string | undefined>();

// A constant numeric enum index identifies the same element as its numeric value.
enum AtPosition {
	BeforeEnd = -1,
	Start = 0,
	Middle = 1,
	End = 2,
	PastEnd = 4,
}
expectTypeOf<ArrayAt<[1, 2, 3], AtPosition.Middle>>().toBe<2>();
expectTypeOf<ArrayAt<[1, 2, 3], AtPosition.BeforeEnd>>().toBe<3>();

declare enum RuntimeAtPosition {
	Value,
}
expectTypeOf<ArrayAt<readonly [1, 2, 3], AtPosition.Middle>>().toBe<2>();
expectTypeOf<ArrayAt<[1, 2, 3], AtPosition.Start>>().toBe<1>();
expectTypeOf<ArrayAt<[1, 2, 3], AtPosition.Middle | AtPosition.End>>().toBe<2 | 3>();
expectTypeOf<ArrayAt<[1, 2, 3], AtPosition.BeforeEnd | AtPosition.Start>>().toBe<1 | 3>();
expectTypeOf<ArrayAt<[1, 2, 3], AtPosition>>().toBe<1 | 2 | 3 | undefined>();
expectTypeOf<ArrayAt<[1, 2?, 3?], AtPosition.Middle>>().toBe<2 | undefined>();
expectTypeOf<ArrayAt<[1, 2, 3], AtPosition.PastEnd>>().toBe<undefined>();
expectTypeOf<ArrayAt<[1, ...string[], 2], AtPosition.Middle>>().toBe<string | 2>();
expectTypeOf<ArrayAt<[...string[], 1, 2], AtPosition.BeforeEnd>>().toBe<2>();
expectTypeOf<ArrayAt<[1, 2, 3] | readonly ['a', 'b'], AtPosition.Middle>>().toBe<2 | 'b'>();
expectTypeOf<ArrayAt<[1, 2, 3], RuntimeAtPosition.Value>>().toBe<1 | 2 | 3 | undefined>();
expectTypeOf<ArrayAt<readonly [1, 2, 3], number>>().toBe<1 | 2 | 3 | undefined>();
expectTypeOf<ArrayAt<[1, 2, 3], any>>().toBe<1 | 2 | 3 | undefined>();
expectTypeOf<ArrayAt<[1, 2, 3], never>>().toBe<never>();
expectTypeOf<ArrayAt<[undefined, any, never, unknown], AtPosition.Start>>().toBe<undefined>();
expectTypeOf<ArrayAt<[undefined, any, never, unknown], AtPosition.Middle>>().toBe<any>();
expectTypeOf<ArrayAt<[undefined, any, never, unknown], AtPosition.End>>().toBe<never>();
expectTypeOf<ArrayAt<[undefined, any, never, unknown], AtPosition.BeforeEnd>>().toBe<unknown>();
expectTypeOf<ArrayAt<never, AtPosition.Middle>>().toBe<never>();
// @ts-expect-error
expectTypeOf<ArrayAt<[1, 2, 3], unknown>>();

// Increasing the length creates a sparse slot that reads as `undefined` and still occupies an index.
const sparseOptionalTail: [1, never?] = [1];
sparseOptionalTail.length = 2;
const sparseLast: ArrayAt<typeof sparseOptionalTail, -1> = sparseOptionalTail.at(-1);
const sparsePrevious: ArrayAt<typeof sparseOptionalTail, -2> = sparseOptionalTail.at(-2);
expectTypeOf(sparseLast).toBe<1 | undefined>();
expectTypeOf(sparsePrevious).toBe<1 | undefined>();
expectTypeOf<ArrayAt<readonly [1, never?, never?], -2>>().toBe<1 | undefined>();

const sparseInterior: [1, never?, 2?] = [1];
sparseInterior.length = 3;
sparseInterior[2] = 2;
expectTypeOf<ArrayAt<typeof sparseInterior, -1>>().toBe<1 | 2 | undefined>();
expectTypeOf<ArrayAt<typeof sparseInterior, -2>>().toBe<1 | undefined>();
expectTypeOf<ArrayAt<typeof sparseInterior, -3>>().toBe<1 | undefined>();

// A numeric brand does not widen a known array index or narrow an unknown one.
expectTypeOf<ArrayAt<[1, 2, 3], Tagged<1, 'Index'>>>().toBe<2>();
expectTypeOf<ArrayAt<[1, 2, 3], Tagged<number, 'Index'>>>().toBe<1 | 2 | 3 | undefined>();

expectTypeOf<ArrayAt<readonly [1, 2, 3], Tagged<1, 'Index'>>>().toBe<2>();
expectTypeOf<ArrayAt<[1, 2, 3], Tagged<0, 'Index'>>>().toBe<1>();
expectTypeOf<ArrayAt<[1, 2, 3], Tagged<-1, 'Index'>>>().toBe<3>();
expectTypeOf<ArrayAt<[1, 2, 3], Tagged<-2, 'Index'>>>().toBe<2>();
expectTypeOf<ArrayAt<[1, 2, 3], Tagged<3, 'Index'>>>().toBe<undefined>();
expectTypeOf<ArrayAt<[1, 2, 3], Tagged<-4, 'Index'>>>().toBe<undefined>();
expectTypeOf<ArrayAt<[1, 2, 3], Tagged<PositiveInfinity, 'Index'>>>().toBe<undefined>();
expectTypeOf<ArrayAt<[1, 2, 3], Tagged<NegativeInfinity, 'Index'>>>().toBe<undefined>();
expectTypeOf<ArrayAt<[1, 2?, 3?], Tagged<1, 'Index'>>>().toBe<2 | undefined>();
expectTypeOf<ArrayAt<readonly [1, 2?, 3?], Tagged<-2, 'Index'>>>().toBe<1 | 2 | undefined>();
expectTypeOf<ArrayAt<[1, never?], Tagged<1, 'Index'>>>().toBe<undefined>();
expectTypeOf<ArrayAt<[1, never?], Tagged<-1, 'Index'>>>().toBe<1 | undefined>();
expectTypeOf<ArrayAt<[Tagged<'value', 'Element'>], Tagged<0, 'Index'>>>().toBe<Tagged<'value', 'Element'>>();

expectTypeOf<ArrayAt<[1, 2, 3], Opaque<1, 'Index'>>>().toBe<2>();
expectTypeOf<ArrayAt<[1, 2, 3], Tagged<Tagged<1, 'Index'>, 'Validated'>>>().toBe<2>();
expectTypeOf<ArrayAt<[1, 2, 3], 1 & {readonly __brand: unique symbol}>>().toBe<2>();
expectTypeOf<ArrayAt<[1, 2, 3], Tagged<AtPosition.Middle, 'Index'>>>().toBe<2>();
expectTypeOf<ArrayAt<[1, 2, 3], Tagged<1 | -1, 'Index'>>>().toBe<2 | 3>();
expectTypeOf<ArrayAt<[1, 2, 3] | readonly ['a', 'b'], Tagged<1, 'Index'>>>().toBe<2 | 'b'>();

// Static positions and the broad-array fallback remain available without scanning a long prefix.
expectTypeOf<ArrayAt<readonly [...TupleOf<1100>, 'last'], Tagged<1100, 'Index'>>>().toBe<'last'>();
expectTypeOf<ArrayAt<[1, ...string[], 2], Tagged<1, 'Index'>>>().toBe<string | 2>();
expectTypeOf<ArrayAt<[...string[], 1, 2], Tagged<-1, 'Index'>>>().toBe<2>();
expectTypeOf<ArrayAt<readonly string[], Tagged<1, 'Index'>>>().toBe<string | undefined>();
expectTypeOf<ArrayAt<readonly [1, 2, 3], Tagged<number, 'Index'>>>().toBe<1 | 2 | 3 | undefined>();
expectTypeOf<ArrayAt<[undefined, any, never, unknown], Tagged<0, 'Index'>>>().toBe<undefined>();
expectTypeOf<ArrayAt<[undefined, any, never, unknown], Tagged<1, 'Index'>>>().toBe<any>();
expectTypeOf<ArrayAt<[undefined, any, never, unknown], Tagged<2, 'Index'>>>().toBe<never>();
expectTypeOf<ArrayAt<[undefined, any, never, unknown], Tagged<3, 'Index'>>>().toBe<unknown>();
expectTypeOf<ArrayAt<any, Tagged<1, 'Index'>>>().toBe<any>();
expectTypeOf<ArrayAt<never, Tagged<1, 'Index'>>>().toBe<never>();
expectTypeOf<ArrayAt<unknown[], Tagged<1, 'Index'>>>().toBe<unknown>();

// Large integer offsets remain out of bounds even when their printed form uses an exponent.
expectTypeOf<ArrayAt<[], 1e21>>().toBe<undefined>();
expectTypeOf<ArrayAt<[1, 2], 1e21>>().toBe<undefined>();
expectTypeOf<ArrayAt<string[], 1e21>>().toBe<undefined>();
expectTypeOf<ArrayAt<[1, ...string[], 2], 1e21>>().toBe<undefined>();
const absentAtLargeOffset: ArrayAt<string[], 1e21> = undefined;

// Large negative offsets can miss the whole array, including a tuple with a rest element.
expectTypeOf<ArrayAt<[1, 2], -1e21>>().toBe<undefined>();
expectTypeOf<ArrayAt<[1, ...string[]], -1e21>>().toBe<undefined>();
expectTypeOf<ArrayAt<[1, ...string[], 2], -1e21>>().toBe<undefined>();
expectTypeOf<ArrayAt<[...string[], 2], -1e21>>().toBe<undefined>();

// `at()` clamps array-like lengths to `Number.MAX_SAFE_INTEGER`, regardless of their element types.
expectTypeOf<ArrayAt<readonly string[], 9_007_199_254_740_992>>().toBe<undefined>();
expectTypeOf<ArrayAt<readonly string[], -9_007_199_254_740_992>>().toBe<undefined>();
expectTypeOf<ArrayAt<readonly [1, ...string[], 2], PositiveInfinity>>().toBe<undefined>();
expectTypeOf<ArrayAt<readonly [1, ...string[], 2], NegativeInfinity>>().toBe<undefined>();
expectTypeOf<ArrayAt<any[], 1e21>>().toBe<undefined>();
expectTypeOf<ArrayAt<unknown[], -1e21>>().toBe<undefined>();
expectTypeOf<ArrayAt<never[], 1e21>>().toBe<undefined>();
expectTypeOf<ArrayAt<any, 1e21>>().toBe<any>();

// A distant bound does not require scanning a long tuple for a nearby negative position.
expectTypeOf<ArrayAt<readonly [...TupleOf<1100>, 'last'], -1>>().toBe<'last'>();
expectTypeOf<ArrayAt<readonly [...TupleOf<1100>, ...number[], 'first', 'last'], -2>>().toBe<'first'>();

declare function elementAt<const Values extends readonly unknown[], const Index extends number>(values: Values, index: Index): ArrayAt<Values, Index>;
expectTypeOf(elementAt(['first', 2], -1)).toBe<2>();
const missingElement = elementAt(['first', 2], -1e21);
expectTypeOf(missingElement).toBe<undefined>();
// @ts-expect-error An out-of-bounds result cannot be one of the array's elements.
const missingString: string = missingElement;

import {expectTypeOf} from 'nz';
import type {MinimumN, Tagged} from '../index.d.ts';

expectTypeOf<[string, string, ...string[]]>().toBe<MinimumN<string, 2>>();
expectTypeOf<[number, number, number, ...number[]]>().toBe<MinimumN<number, 3>>();
expectTypeOf<[0 | 1, 0 | 1, ...Array<0 | 1>]>().toBe<MinimumN<0 | 1, 2>>();

// Minimum of 1 is a non-empty array
expectTypeOf<[string, ...string[]]>().toBe<MinimumN<string, 1>>();

// Minimum of 0 is a plain array
expectTypeOf<string[]>().toBe<MinimumN<string, 0>>();

// Union of lengths
expectTypeOf<[string, ...string[]] | [string, string, string, ...string[]]>().toBe<MinimumN<string, 1 | 3>>();

// Union of lengths where one member is 0
expectTypeOf<[string, string, ...string[]] | string[]>().toBe<MinimumN<string, 0 | 2>>();

// Element edge cases
expectTypeOf<[any, any, ...any[]]>().toBe<MinimumN<any, 2>>();
expectTypeOf<[never, never, ...never[]]>().toBe<MinimumN<never, 2>>();
expectTypeOf<[unknown, unknown, ...unknown[]]>().toBe<MinimumN<unknown, 2>>();

// Length edge cases, same as `TupleOf`
expectTypeOf<string[]>().toBe<MinimumN<string, number>>();
expectTypeOf<string[]>().toBe<MinimumN<string, any>>();
expectTypeOf<string[]>().toBe<MinimumN<string, never>>();
expectTypeOf<string[]>().toBe<MinimumN<string, -2>>();
expectTypeOf<[string, string, ...string[]]>().toBe<MinimumN<string, 2.5>>();

// Multi-digit minimum
expectTypeOf<[string, string, string, string, string, string, string, string, string, string, string, ...string[]]>().toBe<MinimumN<string, 11>>();

// Known enum lengths produce a minimum just like their numeric values.
enum MinimumLength {
	One = 1,
	Two = 2,
}
expectTypeOf<[string, string, ...string[]]>().toBe<MinimumN<string, MinimumLength.Two>>();
expectTypeOf<[string, ...string[]] | [string, string, ...string[]]>().toBe<MinimumN<string, MinimumLength.One | MinimumLength.Two>>();

// A runtime enum value is not a literal number, so the result is a plain array.
declare enum RuntimeMinimum {
	Value,
}
expectTypeOf<string[]>().toBe<MinimumN<string, RuntimeMinimum.Value>>();

// Branded lengths produce a minimum just like their numeric values.
expectTypeOf<[string, string, ...string[]]>().toBe<MinimumN<string, Tagged<2, 'Length'>>>();

// The `length` of the variadic tuple is `number`, since any length at or above the minimum is allowed
expectTypeOf<MinimumN<number, 100>['length']>().toBe<number>();

// @ts-expect-error
type StringLength = MinimumN<string, '2'>;

// @ts-expect-error
type UnknownLength = MinimumN<string, unknown>;

declare const empty: [];
declare const oneString: [string];
declare const twoStrings: [string, string];
declare const threeStrings: [string, string, string];
declare const stringArray: string[];

expectTypeOf(twoStrings).toBeAssignableTo<MinimumN<string, 2>>();
expectTypeOf(threeStrings).toBeAssignableTo<MinimumN<string, 2>>();
expectTypeOf(threeStrings).toBeAssignableTo<MinimumN<string, 3>>();
expectTypeOf(empty).not.toBeAssignableTo<MinimumN<string, 2>>();
expectTypeOf(oneString).not.toBeAssignableTo<MinimumN<string, 2>>();
expectTypeOf(twoStrings).not.toBeAssignableTo<MinimumN<string, 3>>();
expectTypeOf(stringArray).not.toBeAssignableTo<MinimumN<string, 2>>();

expectTypeOf(empty).not.toBeAssignableTo<MinimumN<string, 1>>();
expectTypeOf(oneString).toBeAssignableTo<MinimumN<string, 1>>();
expectTypeOf(stringArray).not.toBeAssignableTo<MinimumN<string, 1>>();

expectTypeOf(empty).toBeAssignableTo<MinimumN<string, 0>>();
expectTypeOf(oneString).toBeAssignableTo<MinimumN<string, 0>>();
expectTypeOf(stringArray).toBeAssignableTo<MinimumN<string, 0>>();

// Union lengths accept an array matching any member
expectTypeOf(oneString).toBeAssignableTo<MinimumN<string, 1 | 3>>();
expectTypeOf(threeStrings).toBeAssignableTo<MinimumN<string, 1 | 3>>();

// Wrong element types
expectTypeOf<[string, number]>().not.toBeAssignableTo<MinimumN<string, 2>>();
expectTypeOf<[string, string, number]>().not.toBeAssignableTo<MinimumN<string, 2>>();

// Element outside the union is rejected
expectTypeOf<[string, string, boolean]>().not.toBeAssignableTo<MinimumN<string | number, 2>>();

// A readonly tuple is not assignable to a mutable minimum
expectTypeOf<readonly [string, string]>().not.toBeAssignableTo<MinimumN<string, 2>>();

// The documented way to get a readonly version
expectTypeOf<Readonly<MinimumN<string, 2>>>().toBe<readonly [string, string, ...string[]]>();

// A minimum tuple is assignable to a plain array
expectTypeOf<MinimumN<string, 2>>().toBeAssignableTo<string[]>();

// A higher minimum is a subtype of a lower one
expectTypeOf<MinimumN<string, 2>>().toBeAssignableTo<MinimumN<string, 1>>();
expectTypeOf<MinimumN<string, 1>>().not.toBeAssignableTo<MinimumN<string, 2>>();

// Rest parameter requires a minimum number of arguments
declare const sum: (...numbers: MinimumN<number, 2>) => number;

expectTypeOf(sum(1, 2)).toBe<number>();
expectTypeOf(sum(1, 2, 3)).toBe<number>();

// @ts-expect-error
sum(1);

// Spreading a plain array cannot guarantee the minimum
declare const plainNumbers: number[];

// @ts-expect-error
sum(...plainNumbers);

// Minimum of 0 accepts zero arguments
declare const sumOfZeroOrMore: (...numbers: MinimumN<number, 0>) => number;

expectTypeOf(sumOfZeroOrMore()).toBe<number>();

// Element type is inferred when the minimum is a literal
function firstOf<Value>(values: MinimumN<Value, 1>): Value {
	return values[0];
}

expectTypeOf(firstOf(['a', 'b', 'c'])).toBe<string>();

// Element type is inferred from rest parameters too
declare function join<Value>(...values: MinimumN<Value, 2>): Value;

expectTypeOf(join('a', 'b')).toBe<string>();
expectTypeOf(join(1, 2, 3)).toBe<number>();
expectTypeOf(join(true, false)).toBe<boolean>();

import {expectTypeOf} from 'nz';
import type {ArrayExclude} from '../index.d.ts';

// All required elements
expectTypeOf<ArrayExclude<[1, 2, 3, 4], 2>>().toBe<[1, 3, 4]>();

// All optional elements
expectTypeOf<ArrayExclude<[1?, 2?, 3?, 4?], 2>>().toBe<[1?, 3?, 4?]>();

// Mixed required and optional elements
expectTypeOf<ArrayExclude<[1, 2, 3?, 4?], 2>>().toBe<[1, 3?, 4?]>();
expectTypeOf<ArrayExclude<[1, 2?, 3?, 4?], 2>>().toBe<[1, 3?, 4?]>();

// Explicit undefined in optional elements
expectTypeOf<ArrayExclude<[1, (2 | undefined)?, 3?], 2>>().toBe<[1, undefined?, 3?]>();

// Union elements
expectTypeOf<ArrayExclude<[1, 2 | 3, 4 | 5], 2>>().toBe<[1, 3, 4 | 5]>();

// Excluding unions
expectTypeOf<ArrayExclude<[1, 2 | 3, 4 | 5], 2 | 4>>().toBe<[1, 3, 5]>();

// Required and rest element
// Trailing rest element
expectTypeOf<ArrayExclude<[1, 2, ...string[]], 1>>().toBe<[2, ...string[]]>();
expectTypeOf<ArrayExclude<[1, 2, ...string[]], 1 | 2>>().toBe<string[]>();
// Leading rest element
expectTypeOf<ArrayExclude<[...string[], 1, 2], 1>>().toBe<[...string[], 2]>();
expectTypeOf<ArrayExclude<[...string[], 1, 2], 1 | 2>>().toBe<string[]>();
// Rest element in the middle
expectTypeOf<ArrayExclude<[1, 2, ...string[], 3, 4], 2 | 4>>().toBe<[1, ...string[], 3]>();
expectTypeOf<ArrayExclude<[1, 2, ...string[], 3, 4], 1 | 2 | 3 | 4>>().toBe<string[]>();

// Optional and rest element
expectTypeOf<ArrayExclude<[1?, 2?, ...string[]], 2>>().toBe<[1?, ...string[]]>();
expectTypeOf<ArrayExclude<[1?, 2?, ...string[]], 1 | 2>>().toBe<string[]>();

// Required, optional, and rest element
expectTypeOf<ArrayExclude<[1, 2, 3?, 4?, ...string[]], 2 | 3>>().toBe<[1, 4?, ...string[]]>();

// Excluding rest element
// Trailing rest element
expectTypeOf<ArrayExclude<[1, 2, ...string[]], string>>().toBe<[1, 2]>();
expectTypeOf<ArrayExclude<[1?, 2?, ...string[]], string>>().toBe<[1?, 2?]>();
expectTypeOf<ArrayExclude<[1, 2, 3?, 4?, ...string[]], string>>().toBe<[1, 2, 3?, 4?]>();
expectTypeOf<ArrayExclude<[1, 2, ...Array<string | number>], string>>().toBe<[1, 2, ...number[]]>();
expectTypeOf<ArrayExclude<[1?, 2?, ...Array<string | number>], string>>().toBe<[1?, 2?, ...number[]]>();
expectTypeOf<ArrayExclude<[1, 2, 3?, 4?, ...Array<string | number>], string>>().toBe<[1, 2, 3?, 4?, ...number[]]>();
// Leading rest element
expectTypeOf<ArrayExclude<[...string[], 1, 2], string>>().toBe<[1, 2]>();
expectTypeOf<ArrayExclude<[...Array<string | number>, 1, 2], string>>().toBe<[...number[], 1, 2]>();
// Rest element in the middle
expectTypeOf<ArrayExclude<[1, ...string[], 2, 3], string>>().toBe<[1, 2, 3]>();
expectTypeOf<ArrayExclude<[1, ...Array<string | number>, 2, 3], string>>().toBe<[1, ...number[], 2, 3]>();

// Excluding both rest element and non-rest elements
expectTypeOf<ArrayExclude<[1, 2, 3?, (4 | 5)?, ...Array<string | number>], 2 | 4 | string>>().toBe<[1, 3?, 5?, ...number[]]>();

// All elements excluded
expectTypeOf<ArrayExclude<[1, 2, 3], 1 | 2 | 3>>().toBe<[]>();
expectTypeOf<ArrayExclude<[string, number], string | number>>().toBe<[]>();
expectTypeOf<ArrayExclude<[1, 2?, 3?, ...string[]], any>>().toBe<[]>();
expectTypeOf<ArrayExclude<[1, 2?, 3?, ...string[]], unknown>>().toBe<[]>();

// No elements excluded
expectTypeOf<ArrayExclude<[1, 2, 3], 4>>().toBe<[1, 2, 3]>();
expectTypeOf<ArrayExclude<[1, 2?, 3?, ...string[]], never>>().toBe<[1, 2?, 3?, ...string[]]>();

// Non-tuple arrays
expectTypeOf<ArrayExclude<Array<string | number>, number>>().toBe<string[]>();
// An array of unknown length whose element type is fully excluded is empty, like a tuple whose rest element is fully excluded.
expectTypeOf<ArrayExclude<Array<string | number>, string | number>>().toBe<[]>();
expectTypeOf<ArrayExclude<boolean[], true>>().toBe<Array<false>>();

// Readonly arrays
expectTypeOf<ArrayExclude<readonly [1, 2, 3], 2>>().toBe<readonly [1, 3]>();
expectTypeOf<ArrayExclude<readonly [1, 2?, ...string[]], 1 | string>>().toBe<readonly [2?]>();
expectTypeOf<ArrayExclude<readonly [...string[], 1], string>>().toBe<readonly [1]>();
expectTypeOf<ArrayExclude<ReadonlyArray<string | number>, number>>().toBe<readonly string[]>();
expectTypeOf<ArrayExclude<readonly string[], string>>().toBe<readonly []>();

// Empty arrays
expectTypeOf<ArrayExclude<[], 1>>().toBe<[]>();
expectTypeOf<ArrayExclude<readonly [], 1>>().toBe<readonly []>();

// Unions of arrays are handled separately
expectTypeOf<ArrayExclude<[1, 2] | readonly ['a', 'b'], 2 | 'a'>>().toBe<[1] | readonly ['b']>();
expectTypeOf<ArrayExclude<[1, 'a'] | string[], string>>().toBe<[1] | []>();

// A union element keeps its remaining members
expectTypeOf<ArrayExclude<[boolean, 1], true>>().toBe<[false, 1]>();
expectTypeOf<ArrayExclude<[1 | 'a', ...Array<2 | 'b'>, 3 | 'c'], string>>().toBe<[1, ...Array<2>, 3]>();

// Labels are dropped, since the positions change
expectTypeOf<ArrayExclude<[a: 1, b: 2, c: 3], 2>>().toBe<[1, 3]>();

// `any`, `unknown`, and `never` elements
expectTypeOf<ArrayExclude<[1, any, 2], 1>>().toBe<[any, 2]>();
expectTypeOf<ArrayExclude<[1, unknown, 2], 1>>().toBe<[unknown, 2]>();
expectTypeOf<ArrayExclude<[1, never, 2], 1>>().toBe<[2]>();
expectTypeOf<ArrayExclude<any[], 1>>().toBe<any[]>();
expectTypeOf<ArrayExclude<unknown[], 1>>().toBe<unknown[]>();

// Excluding `undefined` keeps the optional modifier
expectTypeOf<ArrayExclude<[1, (2 | undefined)?], undefined>>().toBe<[1, 2?]>();

// Edge cases
expectTypeOf<ArrayExclude<any, 1>>().toBe<any>();
expectTypeOf<ArrayExclude<never, 1>>().toBe<never>();
expectTypeOf<ArrayExclude<string[], unknown>>().toBe<[]>();

// Long tuples
type Range<Length extends number, Accumulator extends number[] = []> = Accumulator['length'] extends Length ? Accumulator : Range<Length, [...Accumulator, Accumulator['length']]>;
expectTypeOf<ArrayExclude<Range<500>, 0 | 1>['length']>().toBe<498>();

// Generic arrays
function _generic<ArrayType extends unknown[], ExcludeType>(array: ArrayExclude<ArrayType, ExcludeType>) {
	const result: readonly unknown[] = array;
	return [result, array.length];
}

// @ts-expect-error
type _NotArray = ArrayExclude<string, string>;

// The removed-element test distinguishes `never` from `any` and `unknown` at every position.
expectTypeOf<ArrayExclude<[any, unknown, never], never>>().toBe<[any, unknown]>();
expectTypeOf<ArrayExclude<[any, unknown, never], unknown>>().toBe<[]>();
expectTypeOf<ArrayExclude<[...any[], unknown, never], never>>().toBe<[...any[], unknown]>();
expectTypeOf<ArrayExclude<[1, ...unknown[], never], 1>>().toBe<unknown[]>();
expectTypeOf<ArrayExclude<readonly [...never[], 1, 2], 1>>().toBe<readonly [2]>();
expectTypeOf<ArrayExclude<[(1 | undefined)?], 1>>().toBe<[undefined?]>();
expectTypeOf<ArrayExclude<readonly [(1 | undefined)?, ...Array<2 | undefined>], undefined>>().toBe<readonly [1?, ...Array<2>]>();
expectTypeOf<ArrayExclude<readonly [1?, ...any[]], any>>().toBe<readonly []>();

// Excluded rest values and fixed values are tested independently.
expectTypeOf<ArrayExclude<readonly [1 | 'a', ...Array<2 | 'b'>, 3 | 'c'], string>>().toBe<readonly [1, ...Array<2>, 3]>();
expectTypeOf<ArrayExclude<[1 | 2, 3 | 4], 2 | 3>>().toBe<[1, 4]>();
expectTypeOf<ArrayExclude<readonly [undefined, void, null], undefined>>().toBe<readonly [void, null]>();
expectTypeOf<ArrayExclude<[] | readonly [1?, ...string[]] | [2, 3], number>>().toBe<[] | readonly string[]>();

// A kept value retains its nested readonly shape, and generic readonly inputs still yield arrays.
declare function excludeNumbers<const Array_ extends readonly unknown[]>(array: Array_): ArrayExclude<Array_, number>;
const remainingValues = excludeNumbers([0, {id: 1}, ['nested']] as const);
expectTypeOf(remainingValues).toBe<readonly [{readonly id: 1}, readonly ['nested']]>();
expectTypeOf(remainingValues[0].id).toBe<1>();
// @ts-expect-error A readonly input keeps its readonly result.
remainingValues[0] = {id: 1};

function _readonlyResult<Array_ extends readonly unknown[], Removed>(array: ArrayExclude<Array_, Removed>): readonly unknown[] {
	return array;
}

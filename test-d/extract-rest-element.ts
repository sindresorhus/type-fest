import {expectTypeOf} from 'nz';
import type {ExtractRestElement, Tagged, TupleOf} from '../index.d.ts';

// Leading rest element
expectTypeOf<string>().toBe<ExtractRestElement<[...string[], 1]>>();
expectTypeOf<number>().toBe<ExtractRestElement<[...number[], 'a', 'b']>>();
expectTypeOf<any>().toBe<ExtractRestElement<[...any[], true]>>();
expectTypeOf<never>().toBe<ExtractRestElement<[...never[], 'end']>>();
expectTypeOf<unknown>().toBe<ExtractRestElement<[...unknown[], 2, 3]>>();

// Middle rest element
expectTypeOf<string>().toBe<ExtractRestElement<['a', ...string[], 'z']>>();
expectTypeOf<boolean>().toBe<ExtractRestElement<['x', ...boolean[], true]>>();
expectTypeOf<any>().toBe<ExtractRestElement<['x', ...any[], 'y']>>();

// Trailing rest element
expectTypeOf<string>().toBe<ExtractRestElement<[1, 2, ...string[]]>>();
expectTypeOf<'bar'>().toBe<ExtractRestElement<['foo', ...Array<'bar'>]>>();
expectTypeOf<number>().toBe<ExtractRestElement<[number, ...number[]]>>();

// Rest element only
expectTypeOf<string>().toBe<ExtractRestElement<string[]>>();
expectTypeOf<number>().toBe<ExtractRestElement<readonly number[]>>();
expectTypeOf<boolean>().toBe<ExtractRestElement<readonly [...boolean[]]>>();
expectTypeOf<string>().toBe<ExtractRestElement<[...string[]]>>();

// Optional
expectTypeOf<number>().toBe<ExtractRestElement<[string?, boolean?, ...number[]]>>();
expectTypeOf<number>().toBe<ExtractRestElement<[number, boolean?, ...number[]]>>();
expectTypeOf<string>().toBe<ExtractRestElement<[1?, ...string[]]>>();

// No rest element
expectTypeOf<never>().toBe<ExtractRestElement<[1, 2, 3]>>();
expectTypeOf<never>().toBe<ExtractRestElement<readonly ['a', 'b']>>();
expectTypeOf<never>().toBe<ExtractRestElement<[]>>();

// Union
expectTypeOf<string | number>().toBe<ExtractRestElement<[1, ...string[]] | [2, ...number[]]>>();
expectTypeOf<boolean | string>().toBe<ExtractRestElement<[...boolean[], 'end'] | ['start', ...string[]]>>();

// Readonly
expectTypeOf<number>().toBe<ExtractRestElement<readonly [...number[], 'done']>>();
expectTypeOf<string>().toBe<ExtractRestElement<readonly [1, ...string[], 2]>>();

// Nested arrays
expectTypeOf<string>().toBe<ExtractRestElement<[[1, 2], ...string[], [3, 4]]>>();
expectTypeOf<boolean>().toBe<ExtractRestElement<[['a'], ...boolean[], ['z']]>>();

// Edge: `never` / `any`
expectTypeOf<any>().toBe<ExtractRestElement<any>>();
expectTypeOf<never>().toBe<ExtractRestElement<never>>();

// Long tuples
type FiftyZeroes = TupleOf<50, '0'>;
expectTypeOf<number>().toBe<ExtractRestElement<[...FiftyZeroes, ...number[]]>>();

type NineHundredNinetyNineZeroes = TupleOf<999, '0'>;
expectTypeOf<number>().toBe<ExtractRestElement<[...NineHundredNinetyNineZeroes, ...number[]]>>();

// Fixed optional positions are excluded without changing the rest element's value type.
expectTypeOf<ExtractRestElement<readonly [string?, boolean?, ...number[]]>>().toBe<number>();
expectTypeOf<ExtractRestElement<[never?, ...string[]]>>().toBe<string>();
expectTypeOf<ExtractRestElement<[(string | undefined)?, ...Array<number | undefined>]>>().toBe<number | undefined>();
expectTypeOf<ExtractRestElement<[unknown?, ...never[]]>>().toBe<never>();
expectTypeOf<ExtractRestElement<[any?, ...unknown[]]>>().toBe<unknown>();
expectTypeOf<ExtractRestElement<[string?, number?]>>().toBe<never>();
expectTypeOf<ExtractRestElement<readonly [never?]>>().toBe<never>();

// Prefix and suffix values cannot leak into the extracted element.
expectTypeOf<ExtractRestElement<readonly [unknown, ...string[], any]>>().toBe<string>();
expectTypeOf<ExtractRestElement<[any, ...never[], unknown]>>().toBe<never>();
expectTypeOf<ExtractRestElement<[...number[], void]>>().toBe<number>();
expectTypeOf<ExtractRestElement<readonly [Date, ...Array<readonly [1, 2]>, RegExp]>>().toBe<readonly [1, 2]>();
expectTypeOf<ExtractRestElement<[1, ...Array<Tagged<string, 'Element'>>, 2]>>().toBe<Tagged<string, 'Element'>>();

// Each member contributes only its own rest, regardless of readonly or optional prefixes.
expectTypeOf<ExtractRestElement<readonly [1?, ...string[]] | [2, ...number[], 3] | [4, 5]>>().toBe<string | number>();
expectTypeOf<ExtractRestElement<[] | readonly [1, 2?]>>().toBe<never>();
expectTypeOf<ExtractRestElement<readonly [...Array<{id: 1}>, true] | [false, ...Array<{name: 2}>]>>().toBe<{id: 1} | {name: 2}>();
expectTypeOf<ExtractRestElement<[never, ...Array<1 | 2>] | [...never[], 3]>>().toBe<1 | 2>();

// A fixed suffix of the same supported size is removed without contributing its values.
expectTypeOf<ExtractRestElement<readonly [...number[], ...NineHundredNinetyNineZeroes]>>().toBe<number>();

// Generic result constraints remain usable without resolving the concrete array shape.
function _extractString<Array_ extends string[]>(value: ExtractRestElement<Array_>): string {
	return value;
}

function _extractReadonlyNumber<Array_ extends readonly number[]>(value: ExtractRestElement<Array_>): number {
	return value;
}

function _extractElement<Element, Array_ extends readonly Element[]>(value: ExtractRestElement<Array_>): Element {
	return value;
}

function _extractAfterFixedPositions<Element>(value: ExtractRestElement<readonly [true, ...Element[], false]>): Element {
	return value;
}

// An unconstrained rest element stays unknown.
expectTypeOf<ExtractRestElement<unknown[]>>().toBe<unknown>();

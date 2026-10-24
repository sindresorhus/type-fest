import {expectTypeOf} from 'nz';
import type {LastArrayElement, TupleOf, FixedLengthArray} from '../index.d.ts';

// Empty array
expectTypeOf<LastArrayElement<[]>>().toBe<undefined>();
expectTypeOf<LastArrayElement<readonly []>>().toBe<undefined>();

// Only required elements
expectTypeOf<LastArrayElement<[number, string, boolean]>>().toBe<boolean>();
expectTypeOf<LastArrayElement<readonly [number, string, boolean]>>().toBe<boolean>();

// Required and optional elements
expectTypeOf<LastArrayElement<[1, 2, 3?]>>().toBe<2 | 3>();
expectTypeOf<LastArrayElement<readonly [1, 2?, 3?]>>().toBe<1 | 2 | 3>();
expectTypeOf<LastArrayElement<[null, string, bigint?, boolean?, number?]>>().toBe<number | boolean | bigint | string>();

// Required and rest element
expectTypeOf<LastArrayElement<readonly [1, 2, 3, ...string[]]>>().toBe<3 | string>(); // Rest element at the end
expectTypeOf<LastArrayElement<[1, 2, 3, ...boolean[], 'x', 'y', 'z']>>().toBe<'z'>(); // Rest element in the middle
expectTypeOf<LastArrayElement<readonly [...bigint[], string]>>().toBe<string>(); // Rest element at the start

// Only optional elements
expectTypeOf<LastArrayElement<['a'?]>>().toBe<'a' | undefined>();
expectTypeOf<LastArrayElement<readonly [{data: string[]}?]>>().toBe<{data: string[]} | undefined>();
expectTypeOf<LastArrayElement<[string?, boolean?, bigint?]>>().toBe<string | boolean | bigint | undefined>();

// Explicit `undefined` in optional elements
expectTypeOf<LastArrayElement<[0, 1, (2 | undefined)?]>>().toBe<1 | 2 | undefined>();
expectTypeOf<LastArrayElement<readonly [0, 1, (2 | undefined)?, ...string[]]>>().toBe<1 | 2 | undefined | string>();

// Required, optional, and rest element
expectTypeOf<LastArrayElement<[1, 2, 3?, ...string[]]>>().toBe<2 | 3 | string>();
expectTypeOf<LastArrayElement<readonly [number, string?, ...bigint[]]>>().toBe<number | string | bigint>();

// Optional and rest element
expectTypeOf<LastArrayElement<readonly [1?, ...string[]]>>().toBe<1 | string | undefined>();
expectTypeOf<LastArrayElement<[1?, 2?, 3?, ...bigint[]]>>().toBe<1 | 2 | 3 | bigint | undefined>();

// Labelled tuples
expectTypeOf<LastArrayElement<[x: number, y: number]>>().toBe<number>();
expectTypeOf<LastArrayElement<readonly [x: string, y?: number]>>().toBe<string | number>();
expectTypeOf<LastArrayElement<[x: string, ...rest: number[]]>>().toBe<string | number>();

// Union elements
expectTypeOf<LastArrayElement<['a' | 'b', 'c', 'd' | 'e']>>().toBe<'d' | 'e'>();
expectTypeOf<LastArrayElement<[1 | 'a', 2 | 'b', 3 | 'c', ('d' | 'e')?]>>().toBe<3 | 'c' | 'd' | 'e'>();
expectTypeOf<LastArrayElement<[bigint, boolean, ...Array<string | number>]>>().toBe<boolean | string | number>();

// Unions
expectTypeOf<LastArrayElement<[1, 2, 3] | [4, 5, ...string[], 6]>>().toBe<3 | 6>();
expectTypeOf<LastArrayElement<readonly [string, number] | bigint[]>>().toBe<number | bigint | undefined>();
expectTypeOf<LastArrayElement<readonly [1, 2?, 3?] | ['a'?, 'b'?] | ['c', 'd', ...Array<'e'>] | [...Array<'f'>, 'g']>>().toBe<1 | 2 | 3 | 'a' | 'b' | undefined | 'd' | 'e' | 'g'>();

// Non-tuple arrays
expectTypeOf<LastArrayElement<string[]>>().toBe<string | undefined>();
expectTypeOf<LastArrayElement<readonly number[]>>().toBe<number | undefined>();
expectTypeOf<LastArrayElement<ReadonlyArray<number | bigint>>>().toBe<number | bigint | undefined>();
expectTypeOf<LastArrayElement<any[]>>().toBe<any | undefined>();
expectTypeOf({} as any as LastArrayElement<never[]>).toBe<undefined>();

// Boundary cases
expectTypeOf<LastArrayElement<any>>().toBe<any>();
expectTypeOf<LastArrayElement<never>>().toBe<never>();

// The last required element is available without traversing every preceding element.
expectTypeOf<LastArrayElement<[...TupleOf<1100>, 'last']>>().toBe<'last'>();
expectTypeOf<LastArrayElement<readonly [...TupleOf<1100>, 'last']>>().toBe<'last'>();
expectTypeOf<LastArrayElement<[...TupleOf<1100, 1>, 2?, 3?]>>().toBe<1 | 2 | 3>();
expectTypeOf<LastArrayElement<readonly [...TupleOf<1100, 1>, (2 | undefined)?]>>().toBe<1 | 2 | undefined>();

// Required values keep an explicit `undefined`, independently of optional tuple elements.
expectTypeOf<LastArrayElement<readonly [string | undefined]>>().toBe<string | undefined>();
expectTypeOf<LastArrayElement<[1, undefined]>>().toBe<undefined>();
expectTypeOf<LastArrayElement<[1, (2 | undefined)]>>().toBe<2 | undefined>();

// Uninhabitable elements do not remove other possible endings or introduce a value of their own.
expectTypeOf<LastArrayElement<[never]>>().toBe<never>();
expectTypeOf<LastArrayElement<[never?]>>().toBe<undefined>();
expectTypeOf<LastArrayElement<[1, ...never[]]>>().toBe<1>();
expectTypeOf<LastArrayElement<[...never[], 2]>>().toBe<2>();
expectTypeOf<LastArrayElement<[] | readonly [2?] | [1, ...never[]]>>().toBe<1 | 2 | undefined>();
expectTypeOf<LastArrayElement<readonly [unknown]>>().toBe<unknown>();
expectTypeOf<LastArrayElement<readonly [any]>>().toBe<any>();

// A length refinement on an ordinary array does not create tuple elements.
expectTypeOf<LastArrayElement<string[] & {length: 3}>>().toBe<string | undefined>();
expectTypeOf<LastArrayElement<readonly string[] & {readonly length: 3}>>().toBe<string | undefined>();
expectTypeOf<LastArrayElement<never[] & {length: 3}>>().toBe<undefined>();
expectTypeOf<LastArrayElement<unknown[] & {length: 3}>>().toBe<unknown>();
expectTypeOf<LastArrayElement<any[] & {length: 3}>>().toBe<any>();

// Increasing the length creates a sparse slot that reads as `undefined`, even when its optional element type is `never`.
const sparseOptionalTail: [1, never?] = [1];
sparseOptionalTail.length = 2;
const sparseLast: LastArrayElement<typeof sparseOptionalTail> = sparseOptionalTail.at(-1);
expectTypeOf(sparseLast).toBe<1 | undefined>();
expectTypeOf<LastArrayElement<readonly [1, never?, never?]>>().toBe<1 | undefined>();

const sparseInterior: [1, never?, 2?] = [1];
sparseInterior.length = 3;
sparseInterior[2] = 2;
const sparseInteriorLast: LastArrayElement<typeof sparseInterior> = sparseInterior.at(-1);
expectTypeOf(sparseInteriorLast).toBe<1 | 2 | undefined>();

// Fixed-length arrays retain their declared tuple positions after removing mutating methods.
expectTypeOf<LastArrayElement<FixedLengthArray<number, 3>>>().toBe<number>();
expectTypeOf<LastArrayElement<FixedLengthArray<string, 2>>>().toBe<string>();

const labelledTuple = Object.assign([1, 2] as [1, 2], {label: 'row'});
expectTypeOf<LastArrayElement<typeof labelledTuple>>().toBe<2>();

// Indexing the declared last position works with readonly fixed arrays and an empty or uncertain length.
expectTypeOf<LastArrayElement<Readonly<FixedLengthArray<string, 3>>>>().toBe<string>();
expectTypeOf<LastArrayElement<FixedLengthArray<number, 0>>>().toBe<undefined>();
expectTypeOf<LastArrayElement<FixedLengthArray<'item', 0 | 3>>>().toBe<'item' | undefined>();
expectTypeOf<LastArrayElement<FixedLengthArray<unknown, 3>>>().toBe<unknown>();
expectTypeOf<LastArrayElement<FixedLengthArray<any, 3>>>().toBe<any>();
expectTypeOf<LastArrayElement<FixedLengthArray<never, 3>>>().toBe<never>();
expectTypeOf<LastArrayElement<FixedLengthArray<'item', 1101>>>().toBe<'item'>();

// Optional metadata does not make a required tuple element optional.
const optionalMetadataTuple: readonly ['first', 'last'] & {label?: string} = ['first', 'last'];
expectTypeOf<LastArrayElement<typeof optionalMetadataTuple>>().toBe<'last'>();

function lastFixedValue<const Value>(values: FixedLengthArray<Value, 3>): LastArrayElement<FixedLengthArray<Value, 3>> {
	return values[2];
}

function _readFixedLast<Value>(value: LastArrayElement<FixedLengthArray<Value, 3>>): Value {
	return value;
}

const inferredFixedLast = lastFixedValue([{id: 'row'}, {id: 'row'}, {id: 'row'}]);
expectTypeOf(inferredFixedLast).toBe<{readonly id: 'row'}>();
// @ts-expect-error A valid replacement still cannot change a readonly property of the element.
inferredFixedLast.id = 'row';
// @ts-expect-error The input must be an array.
type UnknownLastInput = LastArrayElement<unknown>;

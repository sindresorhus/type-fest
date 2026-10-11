import {expectTypeOf} from 'nz';
import type {ArrayLength, Primitive} from '../index.d.ts';

// Non-tuples
expectTypeOf<ArrayLength<unknown[]>>().toBe<number>();

// Tuples
expectTypeOf<ArrayLength<[]>>().toBe<0>();
expectTypeOf<ArrayLength<[never]>>().toBe<1>();
expectTypeOf<ArrayLength<['one', 2, true]>>().toBe<3>();
expectTypeOf<ArrayLength<[number, string, boolean?, boolean?]>>().toBe<2 | 3 | 4>();

expectTypeOf<ArrayLength<[1, 2, ...unknown[]]>>().toBe<number>();
expectTypeOf<ArrayLength<[1, 2?, ...unknown[]]>>().toBe<number>();
expectTypeOf<ArrayLength<[...unknown[], 1, 2]>>().toBe<number>();
expectTypeOf<ArrayLength<[0, ...unknown[], 1, 2]>>().toBe<number>();

// Read-only arrays
expectTypeOf<ArrayLength<readonly unknown[]>>().toBe<number>();
expectTypeOf<ArrayLength<readonly never[]>>().toBe<number>();
expectTypeOf<ArrayLength<readonly []>>().toBe<0>();
expectTypeOf<ArrayLength<readonly [never]>>().toBe<1>();
expectTypeOf<ArrayLength<readonly ['one', 2, true]>>().toBe<3>();
expectTypeOf<ArrayLength<readonly [number, string, boolean?, boolean?]>>().toBe<2 | 3 | 4>();

expectTypeOf<ArrayLength<readonly [1, 2, ...unknown[]]>>().toBe<number>();
expectTypeOf<ArrayLength<readonly [1, 2?, ...unknown[]]>>().toBe<number>();
expectTypeOf<ArrayLength<readonly [...unknown[], 1, 2]>>().toBe<number>();
expectTypeOf<ArrayLength<readonly [0, ...unknown[], 1, 2]>>().toBe<number>();

// Unions
expectTypeOf<ArrayLength<[] | [1, 2]>>().toBe<0 | 2>();
expectTypeOf<ArrayLength<readonly [] | readonly [1, 2]>>().toBe<0 | 2>();
expectTypeOf<ArrayLength<[] | readonly [1, 2]>>().toBe<0 | 2>();
expectTypeOf<ArrayLength<[1, 2?, 3?] | ['one', 'two', 'three', 'four']>>().toBe<1 | 2 | 3 | 4>();
expectTypeOf<ArrayLength<readonly [1] | [1, ...number[]]>>().toBe<number>();

// Edge cases and disallowed types
expectTypeOf<ArrayLength<never>>().toBe<never>();
expectTypeOf<ArrayLength<any>>().toBe<any>();

// @ts-expect-error
type DisallowedPrimitive = ArrayLength<string>;
// @ts-expect-error
type DisallowedPrimitives = ArrayLength<Primitive>;
// @ts-expect-error
type DisallowedObject = ArrayLength<{}>;
// @ts-expect-error
type DisallowedMap = ArrayLength<Map<string, number>>;
// @ts-expect-error
type DisallowedSet = ArrayLength<Set<number>>;
// @ts-expect-error
type DisallowedRecord = ArrayLength<Record<string, unknown>>;
// @ts-expect-error
type DisallowedObjectWithLength = ArrayLength<{length: number}>;

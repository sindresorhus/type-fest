import {expectType} from 'tsd';
import type {ArrayLength} from '../source/array-length.d.ts';
import type {Primitive} from '../source/primitive.d.ts';

// Non-tuples
expectType<number>({} as ArrayLength<unknown[]>);
expectType<0>({} as ArrayLength<[]>);

// Tuples
expectType<1>({} as ArrayLength<[never]>);
expectType<3>({} as ArrayLength<['one', 2, true]>);
expectType<2 | 3 | 4>({} as ArrayLength<[number, string, boolean?, boolean?]>);

expectType<number>({} as ArrayLength<[1, 2, ...unknown[]]>);
expectType<number>({} as ArrayLength<[...unknown[], 1, 2]>);
expectType<number>({} as ArrayLength<[0, ...unknown[], 1, 2]>);

// Read-only arrays
expectType<number>({} as ArrayLength<readonly unknown[]>);
expectType<number>({} as ArrayLength<readonly never[]>);
expectType<0>({} as ArrayLength<readonly []>);
expectType<1>({} as ArrayLength<readonly [never]>);
expectType<3>({} as ArrayLength<readonly ['one', 2, true]>);
expectType<2 | 3 | 4>({} as ArrayLength<readonly [number, string, boolean?, boolean?]>);

expectType<number>({} as ArrayLength<readonly [1, 2, ...unknown[]]>);
expectType<number>({} as ArrayLength<readonly [...unknown[], 1, 2]>);
expectType<number>({} as ArrayLength<readonly [0, ...unknown[], 1, 2]>);

// Edge cases and disallowed types
expectType<never>({} as never);

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
type DisallowedObject = ArrayLength<Record<string, unknown>>;
// @ts-expect-error
type DisallowedObjectWithLength = ArrayLength<{length: number}>;


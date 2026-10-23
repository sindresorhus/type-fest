import {expectTypeOf} from 'nz';
import type {HasWritableKeys} from '../index.d.ts';

type TestType1 = {
	a: string;
	readonly b: boolean;
};

type TestType2 = {
	readonly a: string;
	readonly b: boolean;
};

type TestType3 = {
	a: string;
	b: boolean;
};

type HasWritableKeys1 = HasWritableKeys<TestType1>;
type HasWritableKeys2 = HasWritableKeys<TestType2>;
type HasWritableKeys3 = HasWritableKeys<TestType3>;

declare const test1: HasWritableKeys1;
declare const test2: HasWritableKeys2;
declare const test3: HasWritableKeys3;

expectTypeOf(test1).toBe<true>();
expectTypeOf(test2).toBe<false>();
expectTypeOf(test3).toBe<true>();

// A readonly index signature must not swallow the writable named keys next to it
expectTypeOf<HasWritableKeys<{readonly [key: string]: unknown; id: number}>>().toBe<true>();
expectTypeOf<HasWritableKeys<{readonly [key: string]: unknown; readonly id: number}>>().toBe<false>();

expectTypeOf<HasWritableKeys<any>>().toBe<true>();

// Optionality and property values do not determine whether a field is writable.
declare const writableSymbol: unique symbol;
expectTypeOf<HasWritableKeys<{readonly [writableSymbol]?: unknown; 0: never}>>().toBe<true>();
expectTypeOf<HasWritableKeys<{readonly escaped: any; readonly uncertain?: unknown; readonly impossible: never}>>().toBe<false>();
expectTypeOf<HasWritableKeys<{value?: never}>>().toBe<true>();
expectTypeOf<HasWritableKeys<{readonly [key: number]: string}>>().toBe<false>();
expectTypeOf<HasWritableKeys<{[key: string]: unknown; readonly name?: string}>>().toBe<true>();
expectTypeOf<HasWritableKeys<{[key: symbol]: string}>>().toBe<true>();

// A matching key in any union member is sufficient, even when the union has no common keys.
expectTypeOf<HasWritableKeys<{readonly id: string} | {name: string}>>().toBe<true>();
expectTypeOf<HasWritableKeys<{id?: string} | {}>>().toBe<true>();
expectTypeOf<HasWritableKeys<{readonly id?: string} | {readonly name: number}>>().toBe<false>();
expectTypeOf<HasWritableKeys<{readonly id: string} & {name: string}>>().toBe<true>();
expectTypeOf<HasWritableKeys<(() => void) & {name: string}>>().toBe<true>();

// A readonly array still has writable method properties.
const readonlyContainer: readonly string[] = [];
readonlyContainer.map = () => [];
expectTypeOf<HasWritableKeys<typeof readonlyContainer>>().toBe<true>();
expectTypeOf<HasWritableKeys<readonly []>>().toBe<true>();
expectTypeOf<HasWritableKeys<{readonly data: string[]}>>().toBe<false>();
expectTypeOf<HasWritableKeys<{data: readonly string[]}>>().toBe<true>();
expectTypeOf<HasWritableKeys<{}>>().toBe<false>();
expectTypeOf<HasWritableKeys<object>>().toBe<false>();
expectTypeOf<HasWritableKeys<never>>().toBe<false>();
// @ts-expect-error An unknown value is not necessarily an object.
type UnknownWritableInput = HasWritableKeys<unknown>;

function _genericWritableFlag<Value extends object>(value: HasWritableKeys<Value>): boolean {
	return value;
}

function _knownWritableFlag<Value>(value: HasWritableKeys<{value: Value}>): true {
	return value;
}

declare function hasWritableFields<const Value extends object>(value: Value): HasWritableKeys<Value>;
expectTypeOf(hasWritableFields({id: 'id', settings: {enabled: true}})).toBe<false>();
declare const mixedWritableFields: {readonly id: string; name: string};
expectTypeOf(hasWritableFields(mixedWritableFields)).toBe<true>();
expectTypeOf(hasWritableFields({})).toBe<false>();

declare const immutableFields: {readonly id: string};
declare function writableMode<Value extends object>(value: Value, ...mode: HasWritableKeys<Value> extends true ? ['writable'] : []): Value;
expectTypeOf(writableMode(mixedWritableFields, 'writable')).toBe<typeof mixedWritableFields>();
writableMode(immutableFields);
writableMode({});
// @ts-expect-error A writable field requires the writable mode argument.
writableMode(mixedWritableFields);
// @ts-expect-error A wholly readonly object does not accept a writable mode argument.
writableMode(immutableFields, 'writable');

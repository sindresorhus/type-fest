import {expectTypeOf} from 'nz';
import type {HasReadonlyKeys} from '../index.d.ts';

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

type HasReadonlyKeys1 = HasReadonlyKeys<TestType1>;
type HasReadonlyKeys2 = HasReadonlyKeys<TestType2>;
type HasReadonlyKeys3 = HasReadonlyKeys<TestType3>;

declare const test1: HasReadonlyKeys1;
declare const test2: HasReadonlyKeys2;
declare const test3: HasReadonlyKeys3;

expectTypeOf(test1).toBe<true>();
expectTypeOf(test2).toBe<true>();
expectTypeOf(test3).toBe<false>();

// Optionality and property values do not determine whether a field is readonly.
declare const readonlySymbol: unique symbol;
expectTypeOf<HasReadonlyKeys<{readonly [readonlySymbol]?: unknown; 0: never}>>().toBe<true>();
expectTypeOf<HasReadonlyKeys<{escaped: any; uncertain?: unknown; impossible: never}>>().toBe<false>();
expectTypeOf<HasReadonlyKeys<{readonly value: never}>>().toBe<true>();
expectTypeOf<HasReadonlyKeys<{readonly [key: string]: unknown; name: string}>>().toBe<true>();
expectTypeOf<HasReadonlyKeys<{[key: string]: unknown; readonly name?: string}>>().toBe<true>();
expectTypeOf<HasReadonlyKeys<{readonly [key: number]: string}>>().toBe<true>();
expectTypeOf<HasReadonlyKeys<{[key: symbol]: string}>>().toBe<false>();

// A matching key in any union member is sufficient, even when the union has no common keys.
expectTypeOf<HasReadonlyKeys<{readonly id: string} | {name: string}>>().toBe<true>();
expectTypeOf<HasReadonlyKeys<{readonly id?: string} | {}>>().toBe<true>();
expectTypeOf<HasReadonlyKeys<{id?: string} | {name: number}>>().toBe<false>();
expectTypeOf<HasReadonlyKeys<{readonly id: string} & {name: string}>>().toBe<true>();
expectTypeOf<HasReadonlyKeys<(() => void) & {readonly name: string}>>().toBe<true>();

// Even mutable arrays have a readonly `Symbol.unscopables` property.
expectTypeOf<HasReadonlyKeys<string[]>>().toBe<true>();
expectTypeOf<HasReadonlyKeys<readonly string[]>>().toBe<true>();
expectTypeOf<HasReadonlyKeys<readonly []>>().toBe<true>();
expectTypeOf<HasReadonlyKeys<{readonly data: readonly string[]}>>().toBe<true>();
expectTypeOf<HasReadonlyKeys<{data: readonly string[]}>>().toBe<false>();
expectTypeOf<HasReadonlyKeys<{}>>().toBe<false>();
expectTypeOf<HasReadonlyKeys<object>>().toBe<false>();
expectTypeOf<HasReadonlyKeys<any>>().toBe<false>();
expectTypeOf<HasReadonlyKeys<never>>().toBe<false>();
// @ts-expect-error An unknown value is not necessarily an object.
type UnknownReadonlyInput = HasReadonlyKeys<unknown>;

function _genericReadonlyFlag<Value extends object>(value: HasReadonlyKeys<Value>): boolean {
	return value;
}

function _knownReadonlyFlag<Value>(value: HasReadonlyKeys<{readonly value: Value}>): true {
	return value;
}

declare function hasReadonlyFields<const Value extends object>(value: Value): HasReadonlyKeys<Value>;
expectTypeOf(hasReadonlyFields({id: 'id', settings: {enabled: true}})).toBe<true>();
declare const mixedReadonlyFields: {readonly id: string; name: string};
expectTypeOf(hasReadonlyFields(mixedReadonlyFields)).toBe<true>();
expectTypeOf(hasReadonlyFields({})).toBe<false>();

declare function readonlyMode<Value extends object>(value: Value, ...mode: HasReadonlyKeys<Value> extends true ? ['readonly'] : []): Value;
expectTypeOf(readonlyMode(mixedReadonlyFields, 'readonly')).toBe<typeof mixedReadonlyFields>();
readonlyMode({name: 'Ada'});
readonlyMode({});
// @ts-expect-error A readonly field requires the readonly mode argument.
readonlyMode(mixedReadonlyFields);
// @ts-expect-error A plain mutable object does not accept a readonly mode argument.
readonlyMode({name: 'Ada'}, 'readonly');

import {expectTypeOf} from 'nz';
import type {IsUnion} from '../index.d.ts';

expectTypeOf<IsUnion<1>>().toBe<false>();
expectTypeOf<IsUnion<true>>().toBe<false>();
expectTypeOf<IsUnion<'foo'>>().toBe<false>();
expectTypeOf<IsUnion<[]>>().toBe<false>();
expectTypeOf<IsUnion<{}>>().toBe<false>();
expectTypeOf<IsUnion<1 & {}>>().toBe<false>();
expectTypeOf<IsUnion<never>>().toBe<false>();
expectTypeOf<IsUnion<unknown>>().toBe<false>();
expectTypeOf<IsUnion<any>>().toBe<false>();

expectTypeOf<IsUnion<1 | 2>>().toBe<true>();
expectTypeOf<IsUnion<'foo' | 'bar'>>().toBe<true>();
expectTypeOf<IsUnion<'foo' | 'bar' | 1>>().toBe<true>();
expectTypeOf<IsUnion<'foo' | 1>>().toBe<true>();
expectTypeOf<IsUnion<[] | {}>>().toBe<true>();

type TestUnion =
	// Here, the entire union extends both the individual members:
	// So, `TestUnion` extends `{opt?: number; a: number; b: string}`, and
	// `TestUnion` extends `{a: number; b: string}`.
	| {opt?: number; a: number; b: string}
	| {a: number; b: string};

expectTypeOf<IsUnion<TestUnion>>().toBe<true>();

// Structural assignability does not make distinct union members identical.
expectTypeOf<IsUnion<{id: string} | {readonly id: string}>>().toBe<true>();
expectTypeOf<IsUnion<{id: string} | {id: string; name: string}>>().toBe<true>();
expectTypeOf<IsUnion<[string] | readonly [string]>>().toBe<true>();
expectTypeOf<IsUnion<(() => string) | (() => number)>>().toBe<true>();

// A union within a property or return type does not make its container a union.
expectTypeOf<IsUnion<{status: 'ready' | 'failed'}>>().toBe<false>();
expectTypeOf<IsUnion<() => string | number>>().toBe<false>();
expectTypeOf<IsUnion<Array<string | number>>>().toBe<false>();
expectTypeOf<IsUnion<boolean>>().toBe<true>();

// TypeScript absorbs these alternatives before the utility receives them.
expectTypeOf<IsUnion<string | 'ready'>>().toBe<false>();
expectTypeOf<IsUnion<unknown | {id: string}>>().toBe<false>();
expectTypeOf<IsUnion<any | {id: string}>>().toBe<false>();
expectTypeOf<IsUnion<never | {id: string}>>().toBe<false>();

function _unionResult<Value>(result: IsUnion<Value>): boolean {
	return result;
}

function _singletonResult<Value>(): IsUnion<{value: Value}> {
	return false;
}

declare function inspectUnion<Value>(value: Value): IsUnion<Value>;
expectTypeOf(inspectUnion({status: 'ready'})).toBe<false>();
expectTypeOf(inspectUnion('ready' as 'ready' | 'failed')).toBe<true>();
// @ts-expect-error A known union cannot be classified as a singleton.
const singleton: IsUnion<'ready' | 'failed'> = false;

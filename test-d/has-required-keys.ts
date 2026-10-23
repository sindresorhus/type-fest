import {expectTypeOf} from 'nz';
import type {HasRequiredKeys} from '../index.d.ts';

type TestType1 = {
	a: string;
	b?: boolean;
};

type TestType2 = {
	a?: string;
	b?: boolean;
};

type TestType3 = {
	a: string;
	b: boolean;
};

type HasRequiredKeys1 = HasRequiredKeys<TestType1>;
type HasRequiredKeys2 = HasRequiredKeys<TestType2>;
type HasRequiredKeys3 = HasRequiredKeys<TestType3>;

declare const test1: HasRequiredKeys1;
declare const test2: HasRequiredKeys2;
declare const test3: HasRequiredKeys3;

expectTypeOf(test1).toBe<true>();
expectTypeOf(test2).toBe<false>();
expectTypeOf(test3).toBe<true>();

expectTypeOf<HasRequiredKeys<{}>>().toBe<false>();
expectTypeOf<HasRequiredKeys<object>>().toBe<false>();
expectTypeOf<HasRequiredKeys<any>>().toBe<false>();
expectTypeOf<HasRequiredKeys<never>>().toBe<false>();

// @ts-expect-error
type Unknown = HasRequiredKeys<unknown>;

// Index signatures
expectTypeOf<HasRequiredKeys<Record<string, unknown>>>().toBe<false>();
expectTypeOf<HasRequiredKeys<{[key: number]: string}>>().toBe<false>();
expectTypeOf<HasRequiredKeys<{[key: string]: unknown; a?: string}>>().toBe<false>();
expectTypeOf<HasRequiredKeys<{[key: string]: unknown; a: string}>>().toBe<true>();

// Arrays
expectTypeOf<HasRequiredKeys<[]>>().toBe<false>();
expectTypeOf<HasRequiredKeys<[number?]>>().toBe<false>();
expectTypeOf<HasRequiredKeys<readonly string[]>>().toBe<false>();
expectTypeOf<HasRequiredKeys<[number, string?]>>().toBe<true>();
expectTypeOf<HasRequiredKeys<[string, ...number[]]>>().toBe<true>();
expectTypeOf<HasRequiredKeys<readonly [...number[], string]>>().toBe<true>();

// Unions
expectTypeOf<HasRequiredKeys<{a?: string} | {b: number}>>().toBe<true>();
expectTypeOf<HasRequiredKeys<[number?] | {a?: string}>>().toBe<false>();
expectTypeOf<HasRequiredKeys<[number] | {a?: string}>>().toBe<true>();

// Requiredness depends on whether a field may be absent, rather than on its value type.
expectTypeOf<HasRequiredKeys<{value: never}>>().toBe<true>();
expectTypeOf<HasRequiredKeys<{value?: never}>>().toBe<false>();
expectTypeOf<HasRequiredKeys<{value: undefined}>>().toBe<true>();
expectTypeOf<HasRequiredKeys<{value?: undefined}>>().toBe<false>();
expectTypeOf<HasRequiredKeys<{value: any}>>().toBe<true>();
expectTypeOf<HasRequiredKeys<{value?: any}>>().toBe<false>();
expectTypeOf<HasRequiredKeys<{readonly value: unknown}>>().toBe<true>();
expectTypeOf<HasRequiredKeys<{readonly value?: unknown}>>().toBe<false>();

declare const requiredKey: unique symbol;
expectTypeOf<HasRequiredKeys<{readonly [requiredKey]: number; 0?: string}>>().toBe<true>();
expectTypeOf<HasRequiredKeys<{readonly [requiredKey]?: number; 0?: string}>>().toBe<false>();
expectTypeOf<HasRequiredKeys<{[key: `data-${string}`]: number; label?: string}>>().toBe<false>();
expectTypeOf<HasRequiredKeys<{[key: `data-${string}`]: number; label: string}>>().toBe<true>();
expectTypeOf<HasRequiredKeys<(() => void) & {id: string}>>().toBe<true>();
expectTypeOf<HasRequiredKeys<(() => void) & {id?: string}>>().toBe<false>();

// A generic result is always a boolean, and inferred calls retain their specific answer.
function _requiredResult<Value extends object>(result: HasRequiredKeys<Value>): boolean {
	return result;
}

declare function hasRequiredFields<Value extends object>(value: Value): HasRequiredKeys<Value>;
expectTypeOf(hasRequiredFields({id: 1})).toBe<true>();
expectTypeOf(hasRequiredFields({} as {id?: number})).toBe<false>();
expectTypeOf(hasRequiredFields([] as readonly [string?])).toBe<false>();
expectTypeOf(hasRequiredFields(['first'] as const)).toBe<true>();

// An API can require its template argument only when a field must be supplied.
declare function configureTemplate<Template extends object>(...parameters: HasRequiredKeys<Template> extends true ? [template: Template] : [template?: Template]): Template;
expectTypeOf(configureTemplate<{path: string}>({path: 'output'})).toBe<{path: string}>();
expectTypeOf(configureTemplate<{path?: string}>()).toBe<{path?: string}>();
expectTypeOf(configureTemplate<Record<string, unknown>>()).toBe<Record<string, unknown>>();
// @ts-expect-error A template with a required field cannot be omitted.
configureTemplate<{path: string}>();
// @ts-expect-error A tuple with a required element also requires its template argument.
configureTemplate<readonly [string]>();

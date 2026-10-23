import {expectTypeOf} from 'nz';
import type {HasOptionalKeys, OptionalKeysOf} from '../index.d.ts';

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

type HasOptionalKeys1 = HasOptionalKeys<TestType1>;
type HasOptionalKeys2 = HasOptionalKeys<TestType2>;
type HasOptionalKeys3 = HasOptionalKeys<TestType3>;

declare const test1: HasOptionalKeys1;
declare const test2: HasOptionalKeys2;
declare const test3: HasOptionalKeys3;

expectTypeOf(test1).toBe<true>();
expectTypeOf(test2).toBe<true>();
expectTypeOf(test3).toBe<false>();

// The query tests whether any member has an optional property, including a property whose value is `never`.
expectTypeOf<HasOptionalKeys<{value?: never}>>().toBe<true>();
expectTypeOf<HasOptionalKeys<{value?: undefined}>>().toBe<true>();
expectTypeOf<HasOptionalKeys<{value: string | undefined}>>().toBe<false>();
expectTypeOf<HasOptionalKeys<{value: never}>>().toBe<false>();
expectTypeOf<HasOptionalKeys<{value: any}>>().toBe<false>();
expectTypeOf<HasOptionalKeys<{value?: any}>>().toBe<true>();
expectTypeOf<HasOptionalKeys<{value?: unknown}>>().toBe<true>();
expectTypeOf<HasOptionalKeys<{readonly value?: string}>>().toBe<true>();
expectTypeOf<HasOptionalKeys<{}>>().toBe<false>();
expectTypeOf<HasOptionalKeys<object>>().toBe<false>();
expectTypeOf<HasOptionalKeys<any>>().toBe<false>();
expectTypeOf<HasOptionalKeys<never>>().toBe<false>();
// @ts-expect-error - The query requires an object.
expectTypeOf<HasOptionalKeys<unknown>>();

expectTypeOf<HasOptionalKeys<{required: string} | {optional?: number}>>().toBe<true>();
expectTypeOf<HasOptionalKeys<{first: string} | {second: number}>>().toBe<false>();
expectTypeOf<HasOptionalKeys<{value: string} & {optional?: number}>>().toBe<true>();
expectTypeOf<HasOptionalKeys<{value?: string} & {value: string}>>().toBe<false>();

declare const optionalSymbol: unique symbol;
expectTypeOf<HasOptionalKeys<{[optionalSymbol]?: string}>>().toBe<true>();
expectTypeOf<HasOptionalKeys<{[key: string]: unknown; value?: string}>>().toBe<true>();
expectTypeOf<HasOptionalKeys<{[key: number]: string}>>().toBe<false>();
expectTypeOf<HasOptionalKeys<{[key: symbol]: unknown}>>().toBe<false>();
expectTypeOf<HasOptionalKeys<{[key: `data-${string}`]: unknown; value?: number}>>().toBe<true>();

// Tuple positions can be optional, but a rest element is not an optional property.
expectTypeOf<HasOptionalKeys<readonly [value?: string]>>().toBe<true>();
expectTypeOf<HasOptionalKeys<[value: string, next?: number, ...rest: boolean[]]>>().toBe<true>();
expectTypeOf<HasOptionalKeys<readonly [value: string, ...rest: number[]]>>().toBe<false>();
expectTypeOf<HasOptionalKeys<string[]>>().toBe<false>();
expectTypeOf<HasOptionalKeys<Array<string | undefined>>>().toBe<false>();
expectTypeOf<HasOptionalKeys<readonly [value: string | undefined]>>().toBe<false>();
expectTypeOf<HasOptionalKeys<readonly [value: string, ...rest: Array<number | undefined>]>>().toBe<false>();
expectTypeOf<HasOptionalKeys<readonly string[] & {label?: string}>>().toBe<true>();

type RecursiveOptions = {
	value: string;
	next?: RecursiveOptions;
};
expectTypeOf<HasOptionalKeys<RecursiveOptions>>().toBe<true>();
expectTypeOf<HasOptionalKeys<{nested: RecursiveOptions}>>().toBe<false>();
expectTypeOf<HasOptionalKeys<(() => void) & {label?: string}>>().toBe<true>();
expectTypeOf<HasOptionalKeys<Date>>().toBe<false>();

function _genericObject<Value extends object>(result: HasOptionalKeys<Value>): boolean {
	return result;
}

function _genericOptional<Value>(result: HasOptionalKeys<{value?: Value}>): true {
	return result;
}

function _genericRequired<Value>(result: HasOptionalKeys<{value: Value}>): false {
	return result;
}

// Generic consumers can use the boolean result to expose an operation only for optional fields.
declare function hasOptionalFields<const Options extends object>(options: Options): HasOptionalKeys<Options>;
expectTypeOf(hasOptionalFields({value: 'required'})).toBe<false>();
declare const optionalOptions: {required: string; optional?: number};
expectTypeOf(hasOptionalFields(optionalOptions)).toBe<true>();

declare function removeOptionalField<Options extends object>(options: Options, field: HasOptionalKeys<Options> extends true ? OptionalKeysOf<Options> : never): void;
removeOptionalField(optionalOptions, 'optional');
// @ts-expect-error A required property cannot be removed.
removeOptionalField(optionalOptions, 'required');
// @ts-expect-error This inferred object has no optional properties.
removeOptionalField({required: 'value'}, 'required');

expectTypeOf<HasOptionalKeys<Partial<Record<string, string>>>>().toBe<false>();
expectTypeOf<HasOptionalKeys<Partial<Record<symbol, unknown>>>>().toBe<false>();
expectTypeOf<HasOptionalKeys<Partial<Record<'first' | 'second', string>>>>().toBe<true>();

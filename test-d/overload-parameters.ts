import {expectTypeOf} from 'nz';
import type {OverloadParameters, UnknownArray} from '../index.d.ts';

// The details of overload enumeration are tested in overloads.ts; these tests check the projected parameter lists.
type Function1 = (foo: string, bar: number) => object;
type Function2 = (foo: bigint, ...bar: any[]) => void;

declare const overloadParameters: OverloadParameters<Function1 & Function2>;
expectTypeOf(overloadParameters).toBe<[foo: string, bar: number] | [foo: bigint, ...bar: any[]]>();

declare const anyOverloadParameters: OverloadParameters<any>;
expectTypeOf(anyOverloadParameters).toBe<UnknownArray>();

declare const neverOverloadParameters: OverloadParameters<never>;
expectTypeOf(neverOverloadParameters).toBe<never>();

// @ts-expect-error
type UnknownOverloadParameters = OverloadParameters<unknown>;

// Receivers are omitted, while optional arguments and generic rest parameters retain their structure.
type RequestParameters = {
	(this: {mode: 'read'}, path: string, options?: {cache: boolean}): Promise<string>;
	<Value extends {id: string}>(this: {mode: 'write'}, value: Value, ...labels: string[]): Promise<Value>;
};
expectTypeOf<OverloadParameters<RequestParameters>>()
	.toBe<[path: string, options?: {cache: boolean} | undefined] | [value: {id: string}, ...labels: string[]]>();
expectTypeOf<['users', undefined]>().toBeAssignableTo<OverloadParameters<RequestParameters>>();
expectTypeOf<OverloadParameters<(() => 0) | ((value: string) => 1)>>().toBe<[] | [value: string]>();

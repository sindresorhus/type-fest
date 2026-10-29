import {expectTypeOf} from 'nz';
import type {OverloadReturnType} from '../index.d.ts';

// The details of overload enumeration are tested in overloads.ts; these tests check the projected return types.
type Function1 = (foo: string, bar: number) => object;
type Function2 = (foo: bigint, ...bar: any[]) => void;

declare const overloadReturnType: OverloadReturnType<Function1 & Function2>;
expectTypeOf(overloadReturnType).toBe<object | void>();

declare const anyOverloadReturnType: OverloadReturnType<any>;
expectTypeOf(anyOverloadReturnType).toBe<any>();

declare const neverOverloadReturnType: OverloadReturnType<never>;
expectTypeOf(neverOverloadReturnType).toBe<never>();

// @ts-expect-error
type UnknownOverloadReturnType = OverloadReturnType<unknown>;

// Generic results retain their upper bound, including readonly fields, beside a concrete void result.
type RequestResults = {
	<Value extends {readonly id: string}>(value: Value): Promise<Value>;
	(event: 'close'): void;
};
expectTypeOf<OverloadReturnType<RequestResults>>().toBe<Promise<{readonly id: string}> | void>();
expectTypeOf<OverloadReturnType<(() => undefined) | ((value: string) => Promise<string>)>>().toBe<undefined | Promise<string>>();

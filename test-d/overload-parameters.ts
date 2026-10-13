import {expectTypeOf} from 'nz';
import type {OverloadParameters, UnknownArray} from '../index.d.ts';

// The details of overload enumeration are tested in overloads.ts, so only one case is tested here.
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

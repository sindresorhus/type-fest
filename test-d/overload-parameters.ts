import {expectType} from 'tsd';
import type {OverloadParameters} from '../index.d.ts';

// The details of overload enumeration are tested in overloads.ts, so only one case is tested here.
type Function1 = (foo: string, bar: number) => object;
type Function2 = (foo: bigint, ...bar: any[]) => void;

declare const overloadParameters: OverloadParameters<Function1 & Function2>;
expectType<[foo: string, bar: number] | [foo: bigint, ...bar: any[]]>(overloadParameters);

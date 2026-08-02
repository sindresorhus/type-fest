import {expectType} from 'tsd';
import type {OverloadReturnType} from '../index.d.ts';

// The details of overload enumeration are tested in overloads.ts, so only one case is tested here.
type Function1 = (foo: string, bar: number) => object;
type Function2 = (foo: bigint, ...bar: any[]) => void;

declare const overloadReturnType: OverloadReturnType<Function1 & Function2>;
expectType<object | void>(overloadReturnType);

declare const anyOverloadReturnType: OverloadReturnType<any>;
expectType<any>(anyOverloadReturnType);

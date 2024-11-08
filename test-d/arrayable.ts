import {expectType} from 'tsd';
import type {Arrayable} from '../index';

declare const unknown: unknown;

expectType<Arrayable<string>>(unknown as string | readonly string[]);
expectType<Arrayable<string | {foo: number}>>(unknown as (string | {foo: number}) | ReadonlyArray<string | {foo: number}>);
expectType<Arrayable<never>>(unknown as /* never | */ readonly never[]);
expectType<Arrayable<string[]>>(unknown as string[] | readonly string[][]);

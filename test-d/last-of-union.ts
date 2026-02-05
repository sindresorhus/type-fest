import {expectType} from 'tsd';
import type {LastOfUnion} from '../index.d.ts';

// `LastOfUnion` distinguishes between different modifiers.
type UnionType = {a: 0} | {b: 0} | {a?: 0} | {readonly a?: 0} | {readonly a: 0};
expectType<true>({} as LastOfUnion<UnionType> extends UnionType ? true : false);
expectType<false>({} as UnionType extends LastOfUnion<UnionType> ? true : false);

// `never` acts as a termination condition with `IsNever`.
expectType<never>({} as LastOfUnion<never>);

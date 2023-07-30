import {expectAssignable, expectNotAssignable} from 'tsd';
import type {RequireOneOrNone} from '../index';

type OneAtMost = RequireOneOrNone<Record<'foo' | 'bar' | 'baz', true>>;

expectAssignable<OneAtMost>({});
expectAssignable<OneAtMost>({foo: true});
expectAssignable<OneAtMost>({bar: true});
expectAssignable<OneAtMost>({baz: true});

expectNotAssignable<OneAtMost>({foo: true, bar: true});
expectNotAssignable<OneAtMost>({foo: true, baz: true});
expectNotAssignable<OneAtMost>({bar: true, baz: true});
expectNotAssignable<OneAtMost>({foo: true, bar: true, baz: true});

// 'foo' always required
type OneOrTwo = RequireOneOrNone<Record<'foo' | 'bar' | 'baz', true>, 'bar' | 'baz'>;

expectAssignable<OneOrTwo>({foo: true});
expectAssignable<OneOrTwo>({foo: true, bar: true});
expectAssignable<OneOrTwo>({foo: true, baz: true});

expectNotAssignable<OneOrTwo>({});
expectNotAssignable<OneOrTwo>({bar: true});
expectNotAssignable<OneOrTwo>({baz: true});
expectNotAssignable<OneOrTwo>({foo: true, bar: true, baz: true});

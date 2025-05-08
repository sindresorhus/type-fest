import {expectAssignable, expectNotAssignable} from 'tsd';
import type {RequireNone} from '../../source/internal/index.d.ts';

type NoneAllowed = RequireNone<'foo' | 'bar'>;

expectAssignable<NoneAllowed>({});
expectNotAssignable<NoneAllowed>({foo: 'foo'});
expectNotAssignable<NoneAllowed>({bar: 'bar'});
expectNotAssignable<NoneAllowed>({foo: 'foo', bar: 'bar'});

type SomeAllowed = Record<'bar', string> & RequireNone<'foo'>;

expectAssignable<SomeAllowed>({bar: 'bar'});
expectNotAssignable<SomeAllowed>({foo: 'foo'});
expectNotAssignable<SomeAllowed>({foo: 'foo', bar: 'bar'});

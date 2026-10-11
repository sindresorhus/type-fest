import {expectTypeOf} from 'nz';
import type {RequireNone} from '../../source/internal/index.d.ts';

type NoneAllowed = RequireNone<'foo' | 'bar'>;

({}) satisfies NoneAllowed;
expectTypeOf<{foo: 'foo'}>().not.toBeAssignableTo<NoneAllowed>();
expectTypeOf<{bar: 'bar'}>().not.toBeAssignableTo<NoneAllowed>();
expectTypeOf<{foo: 'foo'; bar: 'bar'}>().not.toBeAssignableTo<NoneAllowed>();

type SomeAllowed = Record<'bar', string> & RequireNone<'foo'>;

({bar: 'bar'}) satisfies SomeAllowed;
expectTypeOf<{foo: 'foo'}>().not.toBeAssignableTo<SomeAllowed>();
expectTypeOf<{foo: 'foo'; bar: 'bar'}>().not.toBeAssignableTo<SomeAllowed>();

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

// Forbidden numeric and symbol keys cannot be supplied, even as explicit undefined.
declare const forbiddenSymbol: unique symbol;
expectTypeOf<RequireNone<0 | typeof forbiddenSymbol>>().toBe<{0?: never; [forbiddenSymbol]?: never}>();
expectTypeOf<{0: undefined}>().not.toBeAssignableTo<RequireNone<0>>();
expectTypeOf<{[forbiddenSymbol]: undefined}>().not.toBeAssignableTo<RequireNone<typeof forbiddenSymbol>>();
expectTypeOf<RequireNone<never>>().toBe<{}>();
expectTypeOf<{value: string}>().not.toBeAssignableTo<RequireNone<any>>();
// @ts-expect-error Forbidden keys must be property keys.
type UnknownForbiddenKey = RequireNone<unknown>;

function _createNoKeys<Key extends PropertyKey>(): RequireNone<Key> {
	return {};
}

function _readForbiddenKey<Key extends PropertyKey>(value: RequireNone<Key>, key: Key): undefined {
	return value[key];
}

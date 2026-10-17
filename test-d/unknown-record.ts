import {expectTypeOf} from 'nz';
import type {Simplify, UnknownRecord} from '../index.d.ts';

declare let foo: UnknownRecord;

expectTypeOf(foo).toBeAssignableTo<UnknownRecord>();
expectTypeOf(foo = {}).toBeAssignableTo<UnknownRecord>();
expectTypeOf(foo = {bar: 'baz'}).toBeAssignableTo<UnknownRecord>();
expectTypeOf(foo = {bar: {baz: 'hello'}}).toBeAssignableTo<UnknownRecord>();

// @ts-expect-error
foo = [];
// @ts-expect-error
foo = 42;
// @ts-expect-error
foo = null;

expectTypeOf(foo['bar']).toBe<unknown>();

class Unicorn {
	name = 'unicorn';
}

class EmptyClass {}

type TypeAlias = {name: string};

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface Interface {
	name: string;
}

enum Enum {
	Value,
}

// Values can be anything, including functions, arrays, and class instances
expectTypeOf<{method: () => void; array: string[]; instance: Unicorn; map: Map<string, number>}>().toBeAssignableTo<UnknownRecord>();
expectTypeOf<{method(): void}>().toBeAssignableTo<UnknownRecord>();
expectTypeOf<{readonly name?: string}>().toBeAssignableTo<UnknownRecord>();
expectTypeOf<{[Symbol.iterator]: number; 1: string}>().toBeAssignableTo<UnknownRecord>();
expectTypeOf<Record<string, never>>().toBeAssignableTo<UnknownRecord>();
expectTypeOf<TypeAlias>().toBeAssignableTo<UnknownRecord>();
expectTypeOf<typeof Enum>().toBeAssignableTo<UnknownRecord>();

// Functions and class constructors are not plain objects
expectTypeOf<() => void>().not.toBeAssignableTo<UnknownRecord>();
expectTypeOf<(...arguments_: any[]) => any>().not.toBeAssignableTo<UnknownRecord>();
expectTypeOf<Function>().not.toBeAssignableTo<UnknownRecord>();
expectTypeOf<typeof Unicorn>().not.toBeAssignableTo<UnknownRecord>();
expectTypeOf<{(): void; name: string}>().not.toBeAssignableTo<UnknownRecord>();

// Arrays are not plain objects
expectTypeOf<string[]>().not.toBeAssignableTo<UnknownRecord>();
expectTypeOf<readonly string[]>().not.toBeAssignableTo<UnknownRecord>();
expectTypeOf<[string, number]>().not.toBeAssignableTo<UnknownRecord>();
expectTypeOf<readonly []>().not.toBeAssignableTo<UnknownRecord>();

// Class instances are not plain objects
expectTypeOf<Unicorn>().not.toBeAssignableTo<UnknownRecord>();
expectTypeOf<EmptyClass>().not.toBeAssignableTo<UnknownRecord>();
expectTypeOf<Map<string, number>>().not.toBeAssignableTo<UnknownRecord>();
expectTypeOf<Set<string>>().not.toBeAssignableTo<UnknownRecord>();
expectTypeOf<Date>().not.toBeAssignableTo<UnknownRecord>();
expectTypeOf<RegExp>().not.toBeAssignableTo<UnknownRecord>();
expectTypeOf<Error>().not.toBeAssignableTo<UnknownRecord>();
expectTypeOf<Promise<string>>().not.toBeAssignableTo<UnknownRecord>();
expectTypeOf<String>().not.toBeAssignableTo<UnknownRecord>();

// An interface is not assignable, because it has no implicit index signature
expectTypeOf<Interface>().not.toBeAssignableTo<UnknownRecord>();
expectTypeOf<TypeAlias & Interface>().not.toBeAssignableTo<UnknownRecord>();
expectTypeOf<Simplify<Interface>>().toBeAssignableTo<UnknownRecord>();

// Generic constraint
declare function toJson<Value extends UnknownRecord>(value: Value): string;

toJson({unicorn: true, method: () => 'unicorn'});
// @ts-expect-error
toJson(() => ({unicorn: true}));

// Edge cases
expectTypeOf<TypeAlias | (() => void)>().not.toBeAssignableTo<UnknownRecord>();
expectTypeOf<TypeAlias | {count: number}>().toBeAssignableTo<UnknownRecord>();
expectTypeOf<symbol>().not.toBeAssignableTo<UnknownRecord>();
expectTypeOf<undefined>().not.toBeAssignableTo<UnknownRecord>();
expectTypeOf<unknown>().not.toBeAssignableTo<UnknownRecord>();
expectTypeOf<object>().not.toBeAssignableTo<UnknownRecord>();
expectTypeOf<UnknownRecord>().toBeAssignableTo<object>();

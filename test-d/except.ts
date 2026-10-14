import {expectTypeOf} from 'nz';
import type {Except, KeysOfUnion} from '../index.d.ts';

declare const except: Except<{a: number; b: string}, 'b'>;
expectTypeOf(except).toBe<{a: number}>();
// @ts-expect-error
const _a: unknown = except.b;

const nonStrict = {
	a: 1,
	b: '2',
};

const nonStrictAssignment: typeof except = nonStrict; // No error

declare const strictExcept: Except<{a: number; b: string}, 'b', {requireExactProps: true}>;

// @ts-expect-error
const strictAssignment: typeof strictExcept = nonStrict;

// Generic properties
type Example = {
	[key: string]: unknown;
	foo: number;
	bar: string;
};

const test: Except<Example, 'bar', {requireExactProps: false}> = {foo: 123, bar: 'asdf'};
expectTypeOf(test.foo).toBe<number>();
expectTypeOf(test['bar']).toBe<unknown>();

// A key that only one member of a union has is still a key of that member, so it should be accepted. `keyof` of a union is the intersection of its members' keys, so the constraint rejected it and the user got a type error instead of a result. `KeysOfUnion` gathers the keys instead.
declare const keyOfOneMember: Except<{a: 1} | {b: 2}, 'a'>;
expectTypeOf(keyOfOneMember).toBe<{} | {b: 2}>();

declare const keyOfTheOtherMember: Except<{a: 1} | {b: 2}, 'b'>;
expectTypeOf(keyOfTheOtherMember).toBe<{a: 1} | {}>();

// A generic object is assignable to its own `Except`, because removing keys only widens the type. A distributive conditional around the mapped type would hide that from the compiler.
function exceptOfGeneric<ObjectType extends {a: number; b: string}>(object: ObjectType): Except<ObjectType, 'a'> {
	return object;
}

function exceptOfGenericKeys<ObjectType, KeyType extends keyof ObjectType>(object: ObjectType): Except<ObjectType, KeyType> {
	return object;
}

class ExceptOfThis {
	a = 1;
	b = '';
	method() {
		return (this satisfies Except<this, 'a'>).b;
	}
}

// A key of only some branches of a generic conditional type is accepted when intersected with `KeysOfUnion`. When the resolved type does not have the key, nothing is removed.
type Conditional<T> = T extends string ? {name: string; remove: string} : {prime: boolean};
type ExceptOfConditional<T> = Except<Conditional<T>, 'remove' & KeysOfUnion<Conditional<T>>>;
expectTypeOf<ExceptOfConditional<string>>().toBe<{name: string}>();
expectTypeOf<ExceptOfConditional<number>>().toBe<{prime: boolean}>();
expectTypeOf<ExceptOfConditional<string | number>>().toBe<{name: string} | {prime: boolean}>();

// A `null` member of a union is kept.
expectTypeOf<Except<{a: 1; b: 2} | null, 'a'>>().toBe<{b: 2} | null>();

// Exact removal still rejects a variable carrying the omitted key after discriminating the union.
type ExactUnion = Except<{kind: 'a'; keep: 1; drop: 2} | {kind: 'b'; value: 3}, 'drop', {requireExactProps: true}>;
({kind: 'a', keep: 1}) satisfies ExactUnion;
({kind: 'b', value: 3}) satisfies ExactUnion;
expectTypeOf({kind: 'a', keep: 1, drop: 2} as const).not.toBeAssignableTo<ExactUnion>();

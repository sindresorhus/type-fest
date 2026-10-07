import {expectAssignable, expectNotAssignable, expectType} from 'tsd';
import type {Except} from '../index.d.ts';

declare const except: Except<{a: number; b: string}, 'b'>;
expectType<{a: number}>(except);
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
expectType<number>(test.foo);
expectType<unknown>(test['bar']);

// A key that only one member of a union has is still a key of that member, so it should be accepted. `keyof` of a union is the intersection of its members' keys, so the constraint rejected it and the user got a type error instead of a result. `KeysOfUnion` gathers the keys instead.
declare const keyOfOneMember: Except<{a: 1} | {b: 2}, 'a'>;
expectType<{} | {b: 2}>(keyOfOneMember);

declare const keyOfTheOtherMember: Except<{a: 1} | {b: 2}, 'b'>;
expectType<{a: 1} | {}>(keyOfTheOtherMember);

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

// A `null` member of a union is kept.
expectType<{b: 2} | null>({} as Except<{a: 1; b: 2} | null, 'a'>);

// Exact removal still rejects a variable carrying the omitted key after discriminating the union.
type ExactUnion = Except<{kind: 'a'; keep: 1; drop: 2} | {kind: 'b'; value: 3}, 'drop', {requireExactProps: true}>;
expectAssignable<ExactUnion>({kind: 'a', keep: 1});
expectAssignable<ExactUnion>({kind: 'b', value: 3});
expectNotAssignable<ExactUnion>({kind: 'a', keep: 1, drop: 2} as const);

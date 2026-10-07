import {expectAssignable, expectNotAssignable, expectType} from 'tsd';
import type {ValueOf} from '../index.d.ts';

const value: ValueOf<{a: 1; b: 2; c: 3}> = 3;
const valueRestricted: ValueOf<{a: 1; b: 2; c: 3}, 'a'> = 1;

expectAssignable<1 | 2 | 3>(value);
expectNotAssignable<4>(value);

expectType<1>(valueRestricted);
expectNotAssignable<2>(valueRestricted);
expectNotAssignable<4>(valueRestricted);

// `keyof` of a union is the intersection of its members' keys, so the default key was empty for a union of objects that share nothing, and the value came out as `never`. The doc promises a union of the object's values, and this one has values.
declare const unionOfObjects: ValueOf<{a: 1} | {b: 2}>;
expectType<1 | 2>(unionOfObjects);

declare const threeWayUnion: ValueOf<{a: 1} | {b: 2} | {c: 3}>;
expectType<1 | 2 | 3>(threeWayUnion);

declare const unionOfObjectsSharedKey: ValueOf<{a: 1} | {a: 2}>;
expectType<1 | 2>(unionOfObjectsSharedKey);

// Asking for one member's key reads the value at the keys a member actually has, so a key the other member lacks contributes nothing rather than poisoning the whole result.
declare const oneKeyOfUnion: ValueOf<{a: 1} | {b: 2}, 'a'>;
expectType<1>(oneKeyOfUnion);

declare const unionWithNull: ValueOf<{a: 1} | {b: 2} | null>;
expectType<1 | 2>(unionWithNull);

// A generic object's value at a key is one of its values.
function valueOfGeneric<ObjectType extends object, Key extends keyof ObjectType>(object: ObjectType, key: Key): ValueOf<ObjectType, Key> {
	return object[key];
}

function valueOfGenericConstraint<ObjectType extends {a: number}>(object: ObjectType): ValueOf<ObjectType, 'a'> {
	return object.a;
}

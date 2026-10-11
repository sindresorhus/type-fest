import {expectTypeOf} from 'nz';
import type {ValueOf} from '../index.d.ts';

const value: ValueOf<{a: 1; b: 2; c: 3}> = 3;
const valueRestricted: ValueOf<{a: 1; b: 2; c: 3}, 'a'> = 1;

expectTypeOf(value).toBeAssignableTo<1 | 2 | 3>();
expectTypeOf(value).not.toBeAssignableTo<4>();

expectTypeOf(valueRestricted).toBe<1>();
expectTypeOf(valueRestricted).not.toBeAssignableTo<2>();
expectTypeOf(valueRestricted).not.toBeAssignableTo<4>();

// `keyof` of a union is the intersection of its members' keys, so the default key was empty for a union of objects that share nothing, and the value came out as `never`. The doc promises a union of the object's values, and this one has values.
declare const unionOfObjects: ValueOf<{a: 1} | {b: 2}>;
expectTypeOf(unionOfObjects).toBe<1 | 2>();

declare const threeWayUnion: ValueOf<{a: 1} | {b: 2} | {c: 3}>;
expectTypeOf(threeWayUnion).toBe<1 | 2 | 3>();

declare const unionOfObjectsSharedKey: ValueOf<{a: 1} | {a: 2}>;
expectTypeOf(unionOfObjectsSharedKey).toBe<1 | 2>();

// Asking for one member's key reads the value at the keys a member actually has, so a key the other member lacks contributes nothing rather than poisoning the whole result.
declare const oneKeyOfUnion: ValueOf<{a: 1} | {b: 2}, 'a'>;
expectTypeOf(oneKeyOfUnion).toBe<1>();

declare const unionWithNull: ValueOf<{a: 1} | {b: 2} | null>;
expectTypeOf(unionWithNull).toBe<1 | 2>();

// A generic object's value at a key is one of its values.
function valueOfGeneric<ObjectType extends object, Key extends keyof ObjectType>(object: ObjectType, key: Key): ValueOf<ObjectType, Key> {
	return object[key];
}

function valueOfGenericConstraint<ObjectType extends {a: number}>(object: ObjectType): ValueOf<ObjectType, 'a'> {
	return object.a;
}

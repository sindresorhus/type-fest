import {expectTypeOf} from 'nz';
import type {ObjectToUnion, Simplify} from '../index.d.ts';

// Each property becomes a member with only that property.
expectTypeOf<ObjectToUnion<{name: string}>>().toBe<{name: string}>();
expectTypeOf<ObjectToUnion<{name: string; age: number}>>().toBe<{name: string} | {age: number}>();
expectTypeOf<ObjectToUnion<{name: string; age: number; active: boolean}>>().toBe<{name: string} | {age: number} | {active: boolean}>();

// A value of the result must satisfy one member at a time.
declare function applyUpdate(update: ObjectToUnion<{name: string; age: number}>): void;
applyUpdate({name: 'Ada'});
applyUpdate({age: 37});
// @ts-expect-error The member with `name` requires a string.
applyUpdate({name: 1});
// @ts-expect-error The member with `age` requires a number.
applyUpdate({age: '37'});
// @ts-expect-error Unknown properties are not allowed.
applyUpdate({nickname: 'Ada'});
// @ts-expect-error A literal cannot use keys that no member has, even with a valid property.
applyUpdate({name: 'Ada', nickname: 'Ada'});

// Members are ordinary objects: the original object and literals with all properties are still accepted.
declare const update: ObjectToUnion<{name: string; age: number}>;
expectTypeOf<{name: string; age: number}>().toBeAssignableTo<typeof update>();
const bothProperties: typeof update = {name: 'Ada', age: 37};
// @ts-expect-error An object with no property matches no required member.
const noProperties: typeof update = {};

// The members lack the other keys, so the result is not assignable back to the original object.
expectTypeOf<ObjectToUnion<{name: string; age: number}>>().not.toBeAssignableTo<{name: string; age: number}>();

// Modifiers are preserved on the selected property.
expectTypeOf<ObjectToUnion<{readonly a: string; b: number}>>().toBe<{readonly a: string} | {b: number}>();
expectTypeOf<ObjectToUnion<{a?: string; b: number}>>().toBe<{a?: string} | {b: number}>();
expectTypeOf<ObjectToUnion<{readonly a?: string}>>().toBe<{readonly a?: string}>();
expectTypeOf<ObjectToUnion<{a?: string | undefined}>>().toBe<{a?: string | undefined}>();

// A member with an optional property also matches objects without it.
declare const optionalFields: ObjectToUnion<{a?: string; b: number}>;
const emptyForObjectWithOptional: typeof optionalFields = {};
const onlyOptional: typeof optionalFields = {a: 'value'};
const onlyRequired: typeof optionalFields = {b: 1};
// @ts-expect-error The member with `b` requires a number.
const wrongRequired: typeof optionalFields = {a: 'value', b: 'other'};
// @ts-expect-error The member with `a` requires a string.
const wrongOptional: typeof optionalFields = {a: 1};

// Readonly members cannot be assigned through.
declare const readonlyField: ObjectToUnion<{readonly status: 'ready'}>;
// @ts-expect-error The selected property stays readonly.
readonlyField.status = 'ready';

// Methods stay callable on their member.
declare const withMethod: ObjectToUnion<{say(value: string): boolean}>;
expectTypeOf<ObjectToUnion<{say(value: string): boolean}>>().toBe<{say(value: string): boolean}>();
withMethod.say('hello');
// @ts-expect-error The method requires its argument.
withMethod.say();

// Values are preserved without distribution or recursive conversion.
expectTypeOf<ObjectToUnion<{mode: 'a' | 'b'}>>().toBe<{mode: 'a' | 'b'}>();
expectTypeOf<ObjectToUnion<{mode: 'a' | 'b'}>>().not.toBe<{mode: 'a'} | {mode: 'b'}>();
expectTypeOf<ObjectToUnion<{a: any; b: never; c: unknown}>>().toBe<{a: any} | {b: never} | {c: unknown}>();
expectTypeOf<ObjectToUnion<{a: undefined; b: null}>>().toBe<{a: undefined} | {b: null}>();
expectTypeOf<ObjectToUnion<{requiredUndefined: undefined}>>().not.toBe<{requiredUndefined?: undefined}>();
expectTypeOf<ObjectToUnion<{meta: {deep: true}}>>().toBe<{meta: {deep: true}}>();
expectTypeOf<ObjectToUnion<{meta: {deep: true}}>>().not.toBe<{deep: true}>();
expectTypeOf<ObjectToUnion<{callback: (value: string) => number}>>().toBe<{callback: (value: string) => number}>();
expectTypeOf<ObjectToUnion<{tuple: readonly [string, number?]} | {list: string[]}>>().toBe<{tuple: readonly [string, number?]} | {list: string[]}>();
expectTypeOf<ObjectToUnion<{branded: string & Record<`brand-${string}`, true>}>>().toBe<{branded: string & Record<`brand-${string}`, true>}>();

// Keys of every form become members, following TypeScript's key rules.
declare const metadata: unique symbol;
expectTypeOf<ObjectToUnion<{0: string; '1': number}>>().toBe<{0: string} | {1: number}>();
expectTypeOf<ObjectToUnion<{[metadata]: true; name: string}>>().toBe<{[metadata]: true} | {name: string}>();
expectTypeOf<ObjectToUnion<{'weird key': void}>>().toBe<{'weird key': void}>();
expectTypeOf<ObjectToUnion<{[Symbol.iterator]: () => Generator<string>}>>().toBe<{[Symbol.iterator]: () => Generator<string>}>();

// Each index signature becomes one member that keeps the signature.
expectTypeOf<ObjectToUnion<Record<string, number>>>().toBe<Record<string, number>>();
expectTypeOf<ObjectToUnion<Record<number, string>>>().toBe<Record<number, string>>();
expectTypeOf<ObjectToUnion<Readonly<Record<string, number>>>>().toBe<{readonly [x: string]: number}>();
expectTypeOf<ObjectToUnion<Record<`${number}`, string>>>().toBe<Record<`${number}`, string>>();
expectTypeOf<ObjectToUnion<Record<`x-${string}`, number>>>().toBe<Record<`x-${string}`, number>>();
expectTypeOf<ObjectToUnion<Record<symbol, string>>>().toBe<Record<symbol, string>>();

// A string index signature absorbs the declared keys it covers, while a number or symbol index signature does not absorb string keys.
expectTypeOf<ObjectToUnion<{name: string; [key: string]: string}>>().toBe<Record<string, string>>();
expectTypeOf<ObjectToUnion<{a: string; [key: number]: string}>>().toBe<{[x: number]: string} | {a: string}>();
expectTypeOf<ObjectToUnion<{[key: symbol]: string; name: string}>>().toBe<{[x: symbol]: string} | {name: string}>();

// A call signature is not a property, so it contributes no member.
type Callable = {
	(value: string): number;
	extra: boolean;
};

expectTypeOf<ObjectToUnion<Callable>>().toBe<{extra: boolean}>();

// Object types with no known properties produce `never`.
expectTypeOf<ObjectToUnion<{}>>().toBe<never>();
expectTypeOf<ObjectToUnion<Record<never, unknown>>>().toBe<never>();
expectTypeOf<ObjectToUnion<Record<never, never>>>().toBe<never>();
expectTypeOf<ObjectToUnion<object>>().toBe<never>();
expectTypeOf<ObjectToUnion<() => void>>().toBe<never>();
expectTypeOf<ObjectToUnion<new () => object>>().toBe<never>();

// Arrays and tuples cannot be split into one-property members.
expectTypeOf<ObjectToUnion<[]>>().toBe<never>();
expectTypeOf<ObjectToUnion<readonly []>>().toBe<never>();
expectTypeOf<ObjectToUnion<[string]>>().toBe<never>();
expectTypeOf<ObjectToUnion<readonly [string, number]>>().toBe<never>();
expectTypeOf<ObjectToUnion<[string?]>>().toBe<never>();
expectTypeOf<ObjectToUnion<[string, ...number[]]>>().toBe<never>();
expectTypeOf<ObjectToUnion<string[]>>().toBe<never>();
expectTypeOf<ObjectToUnion<readonly number[]>>().toBe<never>();
expectTypeOf<ObjectToUnion<never[]>>().toBe<never>();
expectTypeOf<ObjectToUnion<any[]>>().toBe<never>();

// An intersection with an array or tuple is rejected like the array itself.
expectTypeOf<ObjectToUnion<{a: 1} & readonly [1]>>().toBe<never>();

// Boundary inputs.
expectTypeOf<ObjectToUnion<any>>().toBe<any>();
expectTypeOf<ObjectToUnion<never>>().toBe<never>();
// @ts-expect-error The input must be an object.
type UnknownInput = ObjectToUnion<unknown>;
// @ts-expect-error The input must be an object.
type StringInput = ObjectToUnion<string>;
// @ts-expect-error The input must be an object.
type NumberInput = ObjectToUnion<number>;
// @ts-expect-error The input must be an object.
type BigIntInput = ObjectToUnion<bigint>;
// @ts-expect-error The input must be an object.
type BooleanInput = ObjectToUnion<boolean>;
// @ts-expect-error The input must be an object.
type SymbolInput = ObjectToUnion<symbol>;
// @ts-expect-error The input must be an object.
type NullInput = ObjectToUnion<null>;
// @ts-expect-error The input must be an object.
type UndefinedInput = ObjectToUnion<undefined>;
// @ts-expect-error Every member of the input must satisfy the object constraint.
type MixedInput = ObjectToUnion<number | {a: 1}>;

// Unions distribute, so each member contributes its own members with its own values and modifiers.
expectTypeOf<ObjectToUnion<{x: string} | {x: number}>>().toBe<{x: string} | {x: number}>();
expectTypeOf<ObjectToUnion<{a: 1; x: string} | {b: 2; x: number}>>().toBe<{a: 1} | {x: string} | {b: 2} | {x: number}>();
expectTypeOf<ObjectToUnion<{a?: string; b: number} | {c: boolean}>>().toBe<{a?: string} | {b: number} | {c: boolean}>();
expectTypeOf<ObjectToUnion<{a: 1; b: 2} | {a: 'one'}>>().toBe<{a: 1} | {b: 2} | {a: 'one'}>();
expectTypeOf<ObjectToUnion<{} | {a: 1}>>().toBe<{a: 1}>();
expectTypeOf<ObjectToUnion<readonly [number] | {a: 1}>>().toBe<{a: 1}>();
expectTypeOf<ObjectToUnion<(() => void) | {a: 1}>>().toBe<{a: 1}>();
expectTypeOf<ObjectToUnion<Record<string, number> | {a: 1}>>().toBe<Record<string, number> | {a: 1}>();
expectTypeOf<ObjectToUnion<never | {a: 1}>>().toBe<{a: 1}>();
expectTypeOf<ObjectToUnion<any | {a: 1}>>().toBe<any>();

// Built-in object transformations compose.
type Base = {name: string; age: number; nickname?: string};
expectTypeOf<ObjectToUnion<Pick<Base, 'name' | 'age'>>>().toBe<{name: string} | {age: number}>();
expectTypeOf<ObjectToUnion<Omit<Base, 'nickname'>>>().toBe<{name: string} | {age: number}>();
expectTypeOf<Simplify<ObjectToUnion<Partial<Base>>>>().toBe<{name?: string} | {age?: number} | {nickname?: string}>();
expectTypeOf<ObjectToUnion<Readonly<Base>>>().toBe<{readonly name: string} | {readonly age: number} | {readonly nickname?: string}>();
expectTypeOf<ObjectToUnion<Required<Base>>>().toBe<{name: string} | {age: number} | {nickname: string}>();
expectTypeOf<ObjectToUnion<Record<'a' | 'b', 1>>>().toBe<{a: 1} | {b: 1}>();
expectTypeOf<ObjectToUnion<{[Key in 'a' | 'b']: {value: Key}}>>().toBe<{a: {value: 'a'}} | {b: {value: 'b'}}>();
expectTypeOf<ObjectToUnion<{[Key in 'a' | 'b' as `x_${Key}`]: 1}>>().toBe<{x_a: 1} | {x_b: 1}>();
expectTypeOf<ObjectToUnion<{a: string} & {b: number}>>().toBe<{a: string} | {b: number}>();

// Generic object types work through the public type without widening.
type FieldsOf<Value> = ObjectToUnion<{name: Value; count: Value[]}>;
expectTypeOf<FieldsOf<'first'>>().toBe<{name: 'first'} | {count: Array<'first'>}>();
expectTypeOf<FieldsOf<string | number>>().toBe<{name: string | number} | {count: Array<string | number>}>();
expectTypeOf<FieldsOf<never>>().toBe<{name: never} | {count: never[]}>();
expectTypeOf<FieldsOf<any>>().toBe<{name: any} | {count: any[]}>();
expectTypeOf<FieldsOf<unknown>>().toBe<{name: unknown} | {count: unknown[]}>();

type ValuesByKey<Value> = ObjectToUnion<Record<string, Value>>;
expectTypeOf<ValuesByKey<number>>().toBe<Record<string, number>>();

// Class instances include inherited properties, without requiring an index signature.
declare class Vehicle {
	readonly id: string;
	wheels: number;
}

expectTypeOf<ObjectToUnion<Vehicle>>().toBe<{readonly id: string} | {wheels: number}>();

// Inherited properties and methods become members like own properties.
declare class Animal {
	name: string;
	speak(): void;
}

declare class Dog extends Animal {
	breed: string;
}

expectTypeOf<ObjectToUnion<Animal>>().toBe<{name: string} | {speak(): void}>();
expectTypeOf<ObjectToUnion<Dog>>().toBe<{name: string} | {speak(): void} | {breed: string}>();

// A const object produces one readonly member per key with literal values.
const source = {kind: 'circle', radius: 3} as const;
type SourceFields = ObjectToUnion<typeof source>;
expectTypeOf<SourceFields>().toBe<{readonly kind: 'circle'} | {readonly radius: 3}>();
const sourceField: SourceFields = {kind: 'circle'};
if ('kind' in sourceField) {
	expectTypeOf(sourceField.kind).toBe<'circle'>();
}

// Enums produce one member per case.
enum NumericEnum {
	A,
	B,
}

enum StringEnum {
	A = 'a',
	B = 'b',
}

expectTypeOf<ObjectToUnion<typeof NumericEnum>>().toBe<{readonly A: NumericEnum.A} | {readonly B: NumericEnum.B}>();
expectTypeOf<ObjectToUnion<typeof StringEnum>>().toBe<{readonly A: StringEnum.A} | {readonly B: StringEnum.B}>();

// The documentation examples compile with their stated output types.
type Update = ObjectToUnion<{name: string; age: number}>;
type Fields = ObjectToUnion<{readonly id: string; done?: boolean}>;
expectTypeOf<Update>().toBe<{name: string} | {age: number}>();
expectTypeOf<Fields>().toBe<{readonly id: string} | {done?: boolean}>();

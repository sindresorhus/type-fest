import {expectTypeOf} from 'nz';
import type {Falsy, Tagged} from '../index.d.ts';

expectTypeOf<Falsy>().toBe<false | 0 | 0n | '' | null | undefined>();

// Every falsy value is accepted
expectTypeOf(false as const).toBeAssignableTo<Falsy>();
expectTypeOf(0 as const).toBeAssignableTo<Falsy>();
expectTypeOf(-0 as const).toBeAssignableTo<Falsy>();
expectTypeOf(0n as const).toBeAssignableTo<Falsy>();
expectTypeOf('' as const).toBeAssignableTo<Falsy>();
expectTypeOf(null).toBeAssignableTo<Falsy>();
expectTypeOf(undefined).toBeAssignableTo<Falsy>();
expectTypeOf<0 | ''>().toBeAssignableTo<Falsy>();

// Truthy values are rejected
expectTypeOf(true as const).not.toBeAssignableTo<Falsy>();
expectTypeOf(1 as const).not.toBeAssignableTo<Falsy>();
expectTypeOf(-1 as const).not.toBeAssignableTo<Falsy>();
expectTypeOf(1n as const).not.toBeAssignableTo<Falsy>();
expectTypeOf(' ' as const).not.toBeAssignableTo<Falsy>();
expectTypeOf('0' as const).not.toBeAssignableTo<Falsy>();
expectTypeOf('false' as const).not.toBeAssignableTo<Falsy>();
expectTypeOf({}).not.toBeAssignableTo<Falsy>();
expectTypeOf([]).not.toBeAssignableTo<Falsy>();
expectTypeOf(() => false).not.toBeAssignableTo<Falsy>();
expectTypeOf(Symbol('a')).not.toBeAssignableTo<Falsy>();

// Types that can also be truthy are rejected
expectTypeOf<boolean>().not.toBeAssignableTo<Falsy>();
expectTypeOf<number>().not.toBeAssignableTo<Falsy>();
expectTypeOf<bigint>().not.toBeAssignableTo<Falsy>();
expectTypeOf<string>().not.toBeAssignableTo<Falsy>();
expectTypeOf<unknown>().not.toBeAssignableTo<Falsy>();
expectTypeOf<0 | 1>().not.toBeAssignableTo<Falsy>();

// `void` is not a value type, so it is not included
expectTypeOf<void>().not.toBeAssignableTo<Falsy>();

// `NaN` has no literal type, so it is rejected like any other `number`
expectTypeOf(NaN).not.toBeAssignableTo<Falsy>();

// A boxed primitive is an object, so it is always truthy
expectTypeOf<Boolean>().not.toBeAssignableTo<Falsy>();
expectTypeOf<Number>().not.toBeAssignableTo<Falsy>();

// Members of an enum with falsy values are accepted
enum Status {
	Off = 0,
	On = 1,
}

enum Label {
	Empty = '',
	Text = 'text',
}

expectTypeOf<Status.Off>().toBeAssignableTo<Falsy>();
expectTypeOf<Status.On>().not.toBeAssignableTo<Falsy>();
expectTypeOf<Label.Empty>().toBeAssignableTo<Falsy>();
expectTypeOf<Label.Text>().not.toBeAssignableTo<Falsy>();

// Tagged falsy values are accepted
expectTypeOf<Tagged<0, 'Zero'>>().toBeAssignableTo<Falsy>();
expectTypeOf<Tagged<'', 'Empty'>>().toBeAssignableTo<Falsy>();
expectTypeOf<Tagged<string, 'Id'>>().not.toBeAssignableTo<Falsy>();

// Extracting the falsy part of a type
expectTypeOf<Extract<'a' | '' | 0 | 1 | true | false | null, Falsy>>().toBe<'' | 0 | false | null>();
expectTypeOf<Exclude<Falsy, null | undefined>>().toBe<false | 0 | 0n | ''>();
expectTypeOf<Extract<boolean, Falsy>>().toBe<false>();
expectTypeOf<Extract<'' | (string & {}), Falsy>>().toBe<''>();
expectTypeOf<Extract<string | number | bigint, Falsy>>().toBe<never>();
expectTypeOf<Extract<unknown, Falsy>>().toBe<never>();

// A type guard for `Falsy` narrows both branches correctly
declare function isFalsy(value: unknown): value is Falsy;

declare const optionalString: string | undefined;
if (isFalsy(optionalString)) {
	expectTypeOf(optionalString).toBe<'' | undefined>();
} else {
	expectTypeOf(optionalString).toBe<string>();
}

declare const number: number;
if (isFalsy(number)) {
	expectTypeOf(number).toBe<0>();
} else {
	expectTypeOf(number).toBe<number>();
}

declare const bigint: bigint;
if (isFalsy(bigint)) {
	expectTypeOf(bigint).toBe<0n>();
} else {
	expectTypeOf(bigint).toBe<bigint>();
}

declare const boolean: boolean;
if (isFalsy(boolean)) {
	expectTypeOf(boolean).toBe<false>();
} else {
	expectTypeOf(boolean).toBe<true>();
}

declare const literals: 'a' | '' | 0 | 1 | null;
if (isFalsy(literals)) {
	expectTypeOf(literals).toBe<'' | 0 | null>();
} else {
	expectTypeOf(literals).toBe<'a' | 1>();
}

declare const object: {a: number} | null;
if (isFalsy(object)) {
	expectTypeOf(object).toBe<null>();
} else {
	expectTypeOf(object).toBe<{a: number}>();
}

declare const unknownValue: unknown;
if (isFalsy(unknownValue)) {
	expectTypeOf(unknownValue).toBe<Falsy>();
} else {
	expectTypeOf(unknownValue).toBe<{}>();
}

declare const anyValue: any;
if (isFalsy(anyValue)) {
	expectTypeOf(anyValue).toBe<Falsy>();
} else {
	expectTypeOf(anyValue).toBe<any>();
}

// `void` is not part of `Falsy`, so it stays in the `else` branch
declare const optionalVoid: string | void;
if (isFalsy(optionalVoid)) {
	expectTypeOf(optionalVoid).toBe<'' | undefined>();
} else {
	expectTypeOf(optionalVoid).toBe<string | void>();
}

// A function that joins class names and ignores falsy values
declare function classNames(...values: Array<string | Falsy>): string;
declare const isActive: boolean;
classNames('button', isActive && 'active', undefined, null, '', 0);
// @ts-expect-error
classNames(true);
// @ts-expect-error
classNames(1);

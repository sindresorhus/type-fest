import {expectTypeOf} from 'nz';
import type {GuardedType} from '../index.d.ts';

// A declared type predicate
declare function isString(value: unknown): value is string;
expectTypeOf<GuardedType<typeof isString>>().toBe<string>();

declare function isStringOrNumber(value: unknown): value is string | number;
expectTypeOf<GuardedType<typeof isStringOrNumber>>().toBe<string | number>();

declare function isRecord(value: unknown): value is Record<string, unknown>;
expectTypeOf<GuardedType<typeof isRecord>>().toBe<Record<string, unknown>>();

// The narrowed type can be `unknown` when the predicate is explicit
declare function isExplicitlyUnknown(value: unknown): value is unknown;
expectTypeOf<GuardedType<typeof isExplicitlyUnknown>>().toBe<unknown>();

// An explicit predicate on `boolean` is a type predicate, unlike a `boolean` return type
declare function isBooleanValue(value: unknown): value is boolean;
expectTypeOf<GuardedType<typeof isBooleanValue>>().toBe<boolean>();

// A predicate on a function that is assigned to a `const`
const isDate = (value: unknown): value is Date => value instanceof Date;
expectTypeOf<GuardedType<typeof isDate>>().toBe<Date>();

// A branded type is extracted as is
type UserId = string & {readonly brand: 'UserId'};

const isUserId = (value: unknown): value is UserId => typeof value === 'string';
expectTypeOf<GuardedType<typeof isUserId>>().toBe<UserId>();

// Inferred type predicates, from TypeScript 5.5
const isNumber = (value: unknown) => typeof value === 'number';
expectTypeOf<GuardedType<typeof isNumber>>().toBe<number>();

const isRegExp = (value: unknown) => value instanceof RegExp;
expectTypeOf<GuardedType<typeof isRegExp>>().toBe<RegExp>();

// A check that removes the members of a union
const isValid = (value: string | number | null | undefined | false) => value !== null && value !== undefined && value !== false;
expectTypeOf<GuardedType<typeof isValid>>().toBe<string | number>();

const hasFoo = (value: unknown) => typeof value === 'object' && value !== null && 'foo' in value;
expectTypeOf<GuardedType<typeof hasFoo>>().toBe<object & Record<'foo', unknown>>();

const isArray = (value: unknown) => Array.isArray(value);
expectTypeOf<GuardedType<typeof isArray>>().toBe<any[]>();

const isPrimitive = (value: unknown) => typeof value === 'string' || typeof value === 'number';
expectTypeOf<GuardedType<typeof isPrimitive>>().toBe<string | number>();

// The parameter of the guard does not have to be `unknown`
const isNarrowing = (value: string | number) => typeof value === 'number';
expectTypeOf<GuardedType<typeof isNarrowing>>().toBe<number>();

// Extra parameters, optional parameters, a rest parameter, a default value, and a `this` parameter
declare function hasProperty(value: unknown, key: string): value is Record<string, unknown>;
expectTypeOf<GuardedType<typeof hasProperty>>().toBe<Record<string, unknown>>();

declare function isChecked(value: unknown, options?: {strict: boolean}): value is string;
expectTypeOf<GuardedType<typeof isChecked>>().toBe<string>();

declare function isBound(this: Date, value: unknown): value is string;
expectTypeOf<GuardedType<typeof isBound>>().toBe<string>();

declare function isOptional(value?: unknown): value is string;
expectTypeOf<GuardedType<typeof isOptional>>().toBe<string>();

declare function isRest(value: unknown, ...rest: string[]): value is string;
expectTypeOf<GuardedType<typeof isRest>>().toBe<string>();

declare function isReadonlyRest(value: unknown, ...rest: readonly [string]): value is string;
expectTypeOf<GuardedType<typeof isReadonlyRest>>().toBe<string>();

const withDefault = (value: unknown = 'text'): value is string => typeof value === 'string';
expectTypeOf<GuardedType<typeof withDefault>>().toBe<string>();

// Only the first parameter is narrowed
declare function narrowsSecond(value: string, other: unknown): other is number;
expectTypeOf<GuardedType<typeof narrowsSecond>>().toBe<never>();

// A method, and types that add a call signature to something else
type Shape = {kind: 'circle'; radius: number} | {kind: 'square'; side: number};

type ShapeGuards = {
	isCircle(value: Shape): value is {kind: 'circle'; radius: number};
};

expectTypeOf<GuardedType<ShapeGuards['isCircle']>>().toBe<{kind: 'circle'; radius: number}>();

type TaggedGuard = ((value: unknown) => value is Date) & {label: string};
expectTypeOf<GuardedType<TaggedGuard>>().toBe<Date>();

type GuardCallable = {
	(value: unknown): value is RegExp;
	tag: string;
};

expectTypeOf<GuardedType<GuardCallable>>().toBe<RegExp>();

// A type parameter in the predicate is replaced with its constraint, or with `unknown` when it has no constraint
declare function isStringLike<Value>(value: Value): value is Value & string;
expectTypeOf<GuardedType<typeof isStringLike>>().toBe<string>();

declare function isConstrained<Value extends object>(value: unknown): value is Value;
expectTypeOf<GuardedType<typeof isConstrained>>().toBe<object>();

declare function isUnconstrained<Value>(value: unknown): value is Value;
expectTypeOf<GuardedType<typeof isUnconstrained>>().toBe<unknown>();

// A guard factory
const hasKind = <Kind extends string>(kind: Kind) => (value: {kind: string}): value is {kind: Kind} => value.kind === kind;

expectTypeOf<GuardedType<ReturnType<typeof hasKind<'circle'>>>>().toBe<{kind: 'circle'}>();

// A union distributes, and members that are not type predicates are dropped
const isBoolean = (value: unknown) => typeof value === 'boolean';
declare function notAGuard(value: unknown): boolean;

expectTypeOf<GuardedType<typeof isString | typeof isNumber>>().toBe<string | number>();
expectTypeOf<GuardedType<typeof isString | typeof isNumber | typeof notAGuard>>().toBe<string | number>();

const guards = [isString, isNumber, isBoolean] as const;
expectTypeOf<GuardedType<(typeof guards)[number]>>().toBe<string | number | boolean>();

const guardMap = {string: isString, number: isNumber};
expectTypeOf<GuardedType<(typeof guardMap)[keyof typeof guardMap]>>().toBe<string | number>();

// A generic helper that takes any guard
type Narrowed<Guard extends (value: any) => boolean> = GuardedType<Guard>;
expectTypeOf<Narrowed<typeof isString>>().toBe<string>();

// The narrowed type comes from the last overload
declare function overloaded(value: string): value is string;
declare function overloaded(value: unknown): value is Date;
expectTypeOf<GuardedType<typeof overloaded>>().toBe<Date>();

// When an earlier overload has the predicate and the last one does not, the result is `unknown`
declare function mixedOverloads(value: unknown): value is string;
declare function mixedOverloads(value: unknown): boolean;
expectTypeOf<GuardedType<typeof mixedOverloads>>().toBe<unknown>();

// A check that removes a member of a union is inferred
const isCircle = (value: Shape) => value.kind === 'circle';
expectTypeOf<GuardedType<typeof isCircle>>().toBe<{kind: 'circle'; radius: number}>();
expectTypeOf<GuardedType<typeof isCircle>>().toBeAssignableTo<Shape>();

const isA = (value: 'a' | 'b') => value === 'a';
expectTypeOf<GuardedType<typeof isA>>().toBe<'a'>();

// A check on a nested property is not inferred
const isNamed = (value: {name: string} | {name: number}) => typeof value.name === 'string';
expectTypeOf<GuardedType<typeof isNamed>>().toBe<never>();

// A function that returns a boolean is not a type predicate
declare function plain(value: unknown): boolean;
expectTypeOf<GuardedType<typeof plain>>().toBe<never>();

const annotatedBoolean = (value: unknown): boolean => typeof value === 'string';
expectTypeOf<GuardedType<typeof annotatedBoolean>>().toBe<never>();

declare function returnsString(value: unknown): string;
expectTypeOf<GuardedType<typeof returnsString>>().toBe<never>();

declare function returnsVoid(value: unknown): void;
expectTypeOf<GuardedType<typeof returnsVoid>>().toBe<never>();

declare function noParameters(): boolean;
expectTypeOf<GuardedType<typeof noParameters>>().toBe<never>();

// A guard that narrows nothing has no inferred type predicate
const narrowsNothing = (value: string) => value.startsWith('/');
expectTypeOf<GuardedType<typeof narrowsNothing>>().toBe<never>();

// Assertion functions are not supported, because TypeScript reports their return type as `void`
declare function assertString(value: unknown): asserts value is string;
expectTypeOf<GuardedType<typeof assertString>>().toBe<never>();

declare function assertsNothing(value: unknown): asserts value;
expectTypeOf<GuardedType<typeof assertsNothing>>().toBe<never>();

// A `this` predicate is not a predicate on a parameter
class Checkable {
	isCheckable(): this is Checkable {
		return true;
	}
}

expectTypeOf<GuardedType<typeof Checkable.prototype.isCheckable>>().toBe<never>();

// Values that are not type predicates
expectTypeOf<GuardedType<unknown>>().toBe<never>();
expectTypeOf<GuardedType<never>>().toBe<never>();
expectTypeOf<GuardedType<string>>().toBe<never>();
expectTypeOf<GuardedType<{}>>().toBe<never>();
expectTypeOf<GuardedType<Function>>().toBe<never>();
expectTypeOf<GuardedType<BooleanConstructor>>().toBe<never>();
expectTypeOf<GuardedType<typeof Date>>().toBe<never>();

// `any` inside a predicate is extracted as `any`
declare function isAny(value: unknown): value is any;
expectTypeOf<GuardedType<typeof isAny>>().toBe<any>();

// A guard whose parameter is `any`
declare function fromAny(value: any): value is string;
expectTypeOf<GuardedType<typeof fromAny>>().toBe<string>();

// `any` matches both branches of the conditional, so the result is `unknown`
expectTypeOf<GuardedType<any>>().toBe<unknown>();

// The result rejects the types that the guard does not cover
expectTypeOf<GuardedType<typeof isString>>().not.toBeAssignableTo<number>();
expectTypeOf<number>().not.toBeAssignableTo<GuardedType<typeof isString>>();

// The result matches what the guard narrows to
declare const value: string | number;

if (isString(value)) {
	expectTypeOf(value).toBe<string>();
	const text: GuardedType<typeof isString> = value;
}

declare const numericValue: number;
// @ts-expect-error - `GuardedType<typeof isString>` is a `string`, not a `number`.
const textValue: GuardedType<typeof isString> = numericValue;

// The result types a parameter
const useText = (text: GuardedType<typeof isString>) => text;
expectTypeOf(useText).parameters.toBe<[text: string]>();
expectTypeOf(useText).returns.toBe<string>();

// The result types a filtered array
declare const values: Array<string | number>;
const strings = values.filter(isString);
expectTypeOf(strings).toBe<string[]>();

import {expectTypeOf} from 'nz';
import type {Arrayable, Promisable, Thunkable} from '../index.d.ts';

// Basic
expectTypeOf<Thunkable<string>>().toBe<string | (() => string)>();
expectTypeOf<Thunkable<number>>().toBe<number | (() => number)>();
expectTypeOf<Thunkable<boolean>>().toBe<boolean | (() => boolean)>();
expectTypeOf<Thunkable<'foo'>>().toBe<'foo' | (() => 'foo')>();
expectTypeOf<Thunkable<undefined>>().toBe<undefined | (() => undefined)>();
expectTypeOf<Thunkable<null>>().toBe<null | (() => null)>();
expectTypeOf<Thunkable<void>>().toBe<void | (() => void)>();
expectTypeOf<Thunkable<readonly string[]>>().toBe<readonly string[] | (() => readonly string[])>();
expectTypeOf<Thunkable<[string, number]>>().toBe<[string, number] | (() => [string, number])>();
expectTypeOf<Thunkable<{foo: string}>>().toBe<(() => {foo: string}) | {foo: string}>();

// Both forms are part of the type, it is never only one of them
expectTypeOf<Thunkable<string>>().not.toBe<string>();
expectTypeOf<Thunkable<string>>().not.toBe<() => string>();

// Both forms are accepted
declare const text: string;
declare const getText: () => string;

expectTypeOf(text).toBeAssignableTo<Thunkable<string>>();
expectTypeOf(getText).toBeAssignableTo<Thunkable<string>>();
expectTypeOf<{foo: string}>().toBeAssignableTo<Thunkable<{foo: string}>>();
expectTypeOf<() => {foo: string}>().toBeAssignableTo<Thunkable<{foo: string}>>();
expectTypeOf<() => 'foo'>().toBeAssignableTo<Thunkable<string>>();

// The thunk form must return the value type
expectTypeOf<() => number>().not.toBeAssignableTo<Thunkable<string>>();
// @ts-expect-error - `() => number` does not return a string
const wrongThunk: Thunkable<string> = () => 1;

// A thunk that throws matches any value type
declare const thrower: () => never;

expectTypeOf(thrower).toBeAssignableTo<Thunkable<string>>();

// A function that requires an argument is not the thunk form
declare const getTextFrom: (input: string) => string;

expectTypeOf(getTextFrom).not.toBeAssignableTo<Thunkable<string>>();
// @ts-expect-error - the thunk form takes no arguments
const notAThunk: Thunkable<string> = getTextFrom;

// Optional and rest parameters are accepted, because the function can be called without arguments
declare const optionalInput: (input?: string) => string;
declare const restInput: (...input: string[]) => string;

expectTypeOf(optionalInput).toBeAssignableTo<Thunkable<string>>();
expectTypeOf(restInput).toBeAssignableTo<Thunkable<string>>();

// The value itself can be a function with arguments
expectTypeOf<Thunkable<(input: string) => string>>().toBe<((input: string) => string) | (() => (input: string) => string)>();
// @ts-expect-error - a string is not a function value
const wrongPayload: Thunkable<(input: string) => string> = 'foo';

declare const functionValue: (input: string) => string;
declare const functionThunk: () => (input: string) => string;

expectTypeOf(functionValue).toBeAssignableTo<Thunkable<(input: string) => string>>();
expectTypeOf(functionThunk).toBeAssignableTo<Thunkable<(input: string) => string>>();

// When `Value` is a function, both forms are functions and cannot be told apart
expectTypeOf<Thunkable<() => void>>().toBe<(() => void) | (() => () => void)>();

// A union stays together in one thunk instead of being split per member
expectTypeOf<Thunkable<string | number>>().toBe<string | number | (() => string | number)>();
expectTypeOf<Thunkable<'foo' | undefined>>().toBe<'foo' | undefined | (() => 'foo' | undefined)>();
expectTypeOf<Thunkable<'a' | 'b'>>().not.toBe<'a' | 'b' | (() => 'a') | (() => 'b')>();
expectTypeOf<Thunkable<string | (() => void)>>().toBe<string | (() => void) | (() => string | (() => void))>();

// Composes with the other value wrappers
expectTypeOf<Thunkable<Promisable<string>>>().toBe<string | PromiseLike<string> | (() => string | PromiseLike<string>)>();
expectTypeOf<Thunkable<Promise<string>>>().toBe<Promise<string> | (() => Promise<string>)>();
expectTypeOf<Promisable<Thunkable<string>>>().toBe<string | (() => string) | PromiseLike<string | (() => string)>>();
expectTypeOf<Thunkable<Arrayable<string>>>().toBe<string | string[] | (() => string | string[])>();
expectTypeOf<Arrayable<Thunkable<string>>>().toBe<(string | (() => string)) | Array<string | (() => string)>>();

// Wrapping twice adds a third form, like `Arrayable` of an array
expectTypeOf<Thunkable<Thunkable<string>>>().toBe<string | (() => string) | (() => string | (() => string))>();

// Edge cases
expectTypeOf<Thunkable<any>>().toBe<any>();
expectTypeOf<Thunkable<unknown>>().toBe<unknown>();

// `never` is not in the union, so only the thunk form remains
expectTypeOf<Thunkable<never>>().toBe<() => never>();
expectTypeOf<Thunkable<never>>().toBeAssignableTo<Thunkable<string>>();

// `Thunkable` is covariant in the value type
expectTypeOf<Thunkable<'foo'>>().toBeAssignableTo<Thunkable<string>>();
expectTypeOf<Thunkable<string>>().not.toBeAssignableTo<Thunkable<'foo'>>();

// A branded value keeps its brand
type UserId = string & {readonly __brand: 'UserId'};

expectTypeOf<UserId>().toBeAssignableTo<Thunkable<UserId>>();
expectTypeOf<string>().not.toBeAssignableTo<Thunkable<UserId>>();

// Narrowing with `typeof` splits the union
declare const thunkable: Thunkable<string | number>;
if (typeof thunkable === 'function') {
	expectTypeOf(thunkable).toBe<() => string | number>();
} else {
	expectTypeOf(thunkable).toBe<string | number>();
}

// When the value type has a function member, narrowing keeps both function forms
declare const mixed: Thunkable<string | (() => void)>;
if (typeof mixed === 'function') {
	expectTypeOf(mixed).toBe<(() => void) | (() => string | (() => void))>();
} else {
	expectTypeOf(mixed).toBe<string>();
}

// Narrowing keeps working when the value can be a promise
declare const asyncThunkable: Thunkable<Promisable<readonly string[]>>;
if (typeof asyncThunkable === 'function') {
	expectTypeOf(asyncThunkable).toBe<() => readonly string[] | PromiseLike<readonly string[]>>();
} else {
	expectTypeOf(asyncThunkable).toBe<readonly string[] | PromiseLike<readonly string[]>>();
}

// `unknown` only narrows to `Function`, and `any` stays `any`
declare const unknownThunkable: Thunkable<unknown>;
if (typeof unknownThunkable === 'function') {
	expectTypeOf(unknownThunkable).toBe<Function>();
}

declare const anyThunkable: Thunkable<any>;
if (typeof anyThunkable === 'function') {
	expectTypeOf(anyThunkable).toBe<any>();
}

// The value must be resolved before it can be used
declare const thunkableText: Thunkable<string>;

declare const takesText: (value: string) => void;

// @ts-expect-error - `Thunkable<string>` also has the thunk form
takesText(thunkableText);

// A generic function needs a type guard, because `typeof` narrows to `Value & Function` too
function narrowInGeneric<Value>(input: Thunkable<Value>): void {
	if (typeof input !== 'function') {
		return;
	}

	expectTypeOf(input).toBe<(Value & Function) | (() => Value)>();
	// @ts-expect-error - `Value & Function` has no call signature
	input();
}

function isThunk<Value>(input: Thunkable<Value>): input is () => Value {
	return typeof input === 'function';
}

function resolve<Value>(input: Thunkable<Value>): Value {
	return isThunk(input) ? input() : input;
}

expectTypeOf(resolve({foo: 'bar'})).toBe<{foo: string}>();
expectTypeOf(resolve<string>(() => 'foo')).toBe<string>();
expectTypeOf(resolve<{foo: string}>(() => ({foo: 'bar'}))).toBe<{foo: string}>();

// A value with overloads stays intact
type Parser = {
	(input: string): string;
	(input: number): number;
};

declare const parser: Parser;
declare const getParser: () => Parser;

expectTypeOf(parser).toBeAssignableTo<Thunkable<Parser>>();
expectTypeOf(getParser).toBeAssignableTo<Thunkable<Parser>>();

// The value type can be a generic function
declare const identityFunction: <Value>(value: Value) => Value;

expectTypeOf(identityFunction).toBeAssignableTo<Thunkable<<Value>(value: Value) => Value>>();

// A class instance is a value, but the constructor is not a thunk
class Point {
	x = 0;
}

expectTypeOf<Point>().toBeAssignableTo<Thunkable<Point>>();
expectTypeOf<() => Point>().toBeAssignableTo<Thunkable<Point>>();
expectTypeOf<typeof Point>().not.toBeAssignableTo<Thunkable<Point>>();

// `Thunkable` does not add `undefined`, so an optional property still rejects an explicit `undefined`
type Config = {
	readonly name?: Thunkable<string>;
};

expectTypeOf<{}>().toBeAssignableTo<Config>();
expectTypeOf<{name: 'foo'}>().toBeAssignableTo<Config>();
expectTypeOf<{name: undefined}>().not.toBeAssignableTo<Config>();

// A realistic build tool plugin option
type Plugin = {name: string};
type Options = {
	readonly plugins: Thunkable<Promisable<readonly Plugin[]>>;
};

async function loadPlugins(options: Options): Promise<readonly Plugin[]> {
	const {plugins} = options;

	return typeof plugins === 'function' ? plugins() : plugins;
}

expectTypeOf(loadPlugins).returns.toBe<Promise<readonly Plugin[]>>();
expectTypeOf<{plugins: readonly Plugin[]}>().toBeAssignableTo<Options>();
expectTypeOf<{plugins: PromiseLike<readonly Plugin[]>}>().toBeAssignableTo<Options>();
expectTypeOf<{plugins: () => readonly Plugin[]}>().toBeAssignableTo<Options>();
expectTypeOf<{plugins: () => PromiseLike<readonly Plugin[]>}>().toBeAssignableTo<Options>();
expectTypeOf<{plugins: readonly string[]}>().not.toBeAssignableTo<Options>();
expectTypeOf<{plugins: (input: string) => readonly Plugin[]}>().not.toBeAssignableTo<Options>();

// A lazy initializer, like React's `useState`
declare function useState<Value>(initialValue: Thunkable<Value>): [Value, (value: Value) => void];

expectTypeOf(useState('foo')).toBe<[string, (value: string) => void]>();
expectTypeOf(useState(() => 'foo')).toBe<[string, (value: string) => void]>();
expectTypeOf(useState<{foo: string}>(() => ({foo: 'bar'}))).toBe<[{foo: string}, (value: {foo: string}) => void]>();

// A default value, so the caller can omit the argument
function greet(name: Thunkable<string> = 'world'): string {
	return typeof name === 'function' ? name() : name;
}

expectTypeOf(greet).toBe<(name?: Thunkable<string>) => string>();
expectTypeOf(greet('foo')).toBe<string>();
expectTypeOf(greet(() => 'foo')).toBe<string>();
expectTypeOf(greet()).toBe<string>();

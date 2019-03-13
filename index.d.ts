// TODO: Add more examples

// TODO: This can just be `export type Primitive = not object` when the `not` keyword is out.
/**
[Primitive value type](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)
*/
export type Primitive =
	| null
	| undefined
	| string
	| number
	| boolean
	| symbol;

/**
[Class type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
*/
export type Class<T = unknown> = new(...args: any[]) => T;

/**
[TypedArray type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
*/
export type TypedArray =
	| Int8Array
	| Uint8Array
	| Uint8ClampedArray
	| Int16Array
	| Uint16Array
	| Int32Array
	| Uint32Array
	| Float32Array
	| Float64Array;

export type JSONObject = {[key: string]: JSONValue};
export interface JSONArray extends Array<JSONValue> {} // eslint-disable-line @typescript-eslint/no-empty-interface
export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;

/**
A value that is like an [Observable](https://github.com/tc39/proposal-observable)
*/
export interface ObservableLike {
	subscribe(observer: (value: unknown) => void): void;
	[Symbol.observable](): ObservableLike;
}

/**
Create a new type from an object type with certain keys.

@example
```
import {Omit} from 'type-fest';

type Foo = {
	a: number;
	b: string;
};

type FooWithoutA = Omit<Foo, 'a'>;
//=> {b: string};
```

I'm surprised this one is not built-in. Please open new issues on TypeScript about making it built-in.
See: https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-420919470
*/
export type Omit<ObjectType, KeysType extends keyof ObjectType> = Pick<ObjectType, Exclude<keyof ObjectType, KeysType>>;

/**
Merge two types into a new type. Keys of the second type overrides keys of the first type.

@example
```
import {Merge} from 'type-fest';

type Foo = {
	a: number;
	b: string;
};

type Bar = {
	b: number;
};

const ab: Merge<Foo, Bar> = {a: 1, b: 2};
```
*/
export type Merge<FirstType, SecondType> = Omit<FirstType, Extract<keyof FirstType, keyof SecondType>> & SecondType;

/**
Create a new type from an object type extracting just properties, not methods.

@example
```
import {JustProps} from 'type-fest';

interface Foo {
	a: string;
	b: number;
	c(): string;
	d(x: string): string;
}

const foo: JustProps<Foo> = {a: 'a', b: 1};
```
*/
export type JustProps<ObjectType> = Pick<ObjectType, ({ [Property in keyof ObjectType]: ObjectType[Property] extends (...args: unknown[]) => unknown ? never : Property })[keyof ObjectType]>;

/**
Create a new type from an object type extracting just methods

@example
```
import {JustMethods} from 'type-fest';

interface Foo {
	a: string;
	b: number;
	c(): string;
	d(x: string): string;
}

const foo: JustMethods<Foo> = {c: () => 'c', d: (x: string) => x};
```
*/
export type JustMethods<ObjectType> = Pick<ObjectType, ({ [Method in keyof ObjectType]: ObjectType[Method] extends (...args: unknown[]) => unknown ? Method : never })[keyof ObjectType]>;

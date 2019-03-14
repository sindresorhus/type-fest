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

/*
Create a type that requires at least one of the given keys.

@example
```
import {RequireAtLeastOne} from 'type-fest';

type SystemMessages = {
	macos?: string;
	linux?: string;
	windows?: string;
	default?: string;
};

const messages: RequireAtLeastOne<SystemMessages, 'macos' | 'linux' | 'windows'> = {macos: 'hey', default: 'hello'};
```
*/
export type RequireAtLeastOne<ObjectType, KeysType extends keyof ObjectType = keyof ObjectType> =
	{
		// For each Key in KeysType make a mapped type
		[Key in KeysType]: (
			// …by picking that Key's type and making it required
			Required<Pick<ObjectType, Key>>
		)
	}[KeysType]
	// …then, make intersection types by adding the remaining properties to each mapped type
	& Omit<ObjectType, KeysType>;

export {PackageJson} from './source/npm';

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
Currently, when a union type of a primitive type is combined with literal types, TypeScript loses all information about the combined literals. Thus, when such a type is used in an IDE with autocompletion, no suggestions are made for the declared literals.

This type is a workaround for the TypeScript issue https://github.com/Microsoft/TypeScript/issues/29729. It will be removed as soon as it's not needed any more.

@example
```
import {LiteralUnion} from 'type-fest';

type Pet = LiteralUnion<'dog' | 'cat', string>;

const pet: Pet = '';
// Start typing in your TypeScript enabled IDE, you will get auto-completion for `dog` and `cat` literals.
```
 */
export type LiteralUnion<
	LiteralType extends BaseType,
	BaseType extends Primitive
> = LiteralType | (BaseType & {_?: never});

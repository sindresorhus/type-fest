/// <reference lib="esnext"/>

// TODO: This can just be `export type Primitive = not object` when the `not` keyword is out.
/**
Matches any [primitive value](https://developer.mozilla.org/en-US/docs/Glossary/Primitive).
*/
export type Primitive =
	| null
	| undefined
	| string
	| number
	| boolean
	| symbol
	| bigint;

// TODO: Remove the `= unknown` sometime  in the future when most users are on TS 3.5 as it's now the default
/**
Matches a [`class` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).
*/
export type Class<T = unknown, Arguments extends any[] = any[]> = new(...arguments_: Arguments) => T;

/**
Matches any [typed array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), like `Uint8Array` or `Float64Array`.
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
	| Float64Array
	| BigInt64Array
	| BigUint64Array;

/**
Matches a JSON object.

This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. Don't use this as a direct return type as the user would have to double-cast it: `jsonObject as unknown as CustomResponse`. Instead, you could extend your CustomResponse type from it to ensure your type only uses JSON-compatible types: `interface CustomResponse extends JsonObject { … }`.
*/
export type JsonObject = {[key: string]: JsonValue};

/**
Matches a JSON array.
*/
export interface JsonArray extends Array<JsonValue> {}

/**
Matches any valid JSON value.
*/
export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;

declare global {
	interface SymbolConstructor {
		readonly observable: symbol;
	}
}

/**
Matches a value that is like an [Observable](https://github.com/tc39/proposal-observable).
*/
export interface ObservableLike {
	subscribe(observer: (value: unknown) => void): void;
	[Symbol.observable](): ObservableLike;
}

/**
Creates an opaque type, which hides its internal details from the public, and can only be created by being used explicitly.

The generic type parameter can be anything. It doesn't have to be an object.

Read more about opaque types [here](https://codemix.com/opaque-types-in-javascript/).

There have been several discussions about adding this feature to TypeScript via the `opaque type` operator, similar to how Flow does it. Unfortunately, nothing has (yet) moved forward:
	1. [](https://github.com/Microsoft/TypeScript/issues/15408)
	2. [](https://github.com/Microsoft/TypeScript/issues/15807)

@example
```
import {Opaque} from 'type-fest';

type AccountNumber = Opaque<number>;
type AccountBalance = Opaque<number>;

function createAccountNumber(): AccountNumber {
	return 2 as AccountNumber;
}

function getMoneyForAccount(accountNumber: AccountNumber): AccountBalance {
	return 4 as AccountBalance;
}

// This will compile successfully:
getMoneyForAccount(createAccountNumber());

// But this won't, because it has to be explicitly passed as an AccountNumber.
getMoneyForAccount(2);

// You can use opaque values like they aren't opaque too, like this:
const accountNumber = createAccountNumber();

// This will compile successfully:
accountNumber + 2;
```
 */
type Opaque<Type> = Type & {readonly __opaque__: unique symbol};

/**
Matches a [`class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).

@category Class
*/
export type Class<T, Arguments extends unknown[] = any[]> = {
	prototype: Pick<T, keyof T>;
	new(...arguments_: Arguments): T;
};

/**
Matches a [`class` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).

@category Class
*/
export type Constructor<T, Arguments extends unknown[] = any[]> = new(...arguments_: Arguments) => T;

/**
Matches an [`abstract class`](https://www.typescriptlang.org/docs/handbook/2/classes.html#abstract-classes-and-members).

@category Class

@privateRemarks
We cannot use a `type` here because TypeScript throws: 'abstract' modifier cannot appear on a type member. (1070)
*/
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface AbstractClass<T, Arguments extends unknown[] = any[]> extends AbstractConstructor<T, Arguments> {
	prototype: Pick<T, keyof T>;
}

/**
Matches an [`abstract class`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-2.html#abstract-construct-signatures) constructor.

@category Class
*/
export type AbstractConstructor<T, Arguments extends unknown[] = any[]> = abstract new(...arguments_: Arguments) => T;

/**
Matches an asynchronous function.

Use-cases:
- Constrain a generic type to an asynchronous function.
- Declare a reusable asynchronous callback signature.

@example
```
import type {AsyncFunction} from 'type-fest';

type FetchData = AsyncFunction<[url: URL], Uint8Array>;

const fetchData: FetchData = async url => {
	const response = await fetch(url);
	return new Uint8Array(await response.arrayBuffer());
};
```

@category Basic
*/
export type AsyncFunction<Arguments extends readonly unknown[] = readonly any[], ReturnValue = unknown> = (...arguments_: Arguments) => Promise<ReturnValue>;

/**
Matches any asynchronous function.

Use-cases:
- Constrain a generic type to any asynchronous function without prescribing its parameters or return value.

@example
```
import type {AnyAsyncFunction} from 'type-fest';

function register<FunctionType extends AnyAsyncFunction>(function_: FunctionType): FunctionType {
	return function_;
}

const parse = register(async (value: string) => Number.parseInt(value, 10));

const result = parse('42');
//=> Promise<number>
```

@category Basic
*/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyAsyncFunction = (...arguments_: readonly any[]) => Promise<unknown>;

/**
Matches any function.

Use-cases:
- Constrain a generic type to any function while erasing its parameters and return value.

@example
```
import type {AnyFunction} from 'type-fest';

function identity<FunctionType extends AnyFunction>(function_: FunctionType): FunctionType {
	return function_;
}
```

@category Basic
*/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = (...arguments_: readonly any[]) => any;

export {};

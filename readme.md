<div align="center">
	<br>
	<br>
	<img src="media/logo.svg" alt="type-fest" height="300">
	<br>
	<br>
	<b>A collection of essential TypeScript types</b>
	<br>
	<hr>
</div>
<br>
<br>

[![Build Status](https://travis-ci.com/sindresorhus/type-fest.svg?branch=master)](https://travis-ci.com/sindresorhus/type-fest)
[![](https://img.shields.io/badge/unicorn-approved-ff69b4.svg)](https://www.youtube.com/watch?v=9auOCbH5Ns4)
<!-- Commented out until they actually show anything
[![npm dependents](https://badgen.net/npm/dependents/type-fest)](https://www.npmjs.com/package/type-fest?activeTab=dependents) [![npm downloads](https://badgen.net/npm/dt/type-fest)](https://www.npmjs.com/package/type-fest)
-->

Many of the types here should have been built-in. You can help by suggesting some of them to the [TypeScript project](https://github.com/Microsoft/TypeScript/blob/master/CONTRIBUTING.md).

Either add this package as a dependency or copy-paste the needed types. No credit required. 👌

PR welcome for additional commonly needed types and docs improvements. Read the [contributing guidelines](.github/contributing.md) first.


## Install

```
$ npm install type-fest
```


## Usage

```ts
import {Omit} from 'type-fest';

type Foo = {
	unicorn: string;
	rainbow: boolean;
};

type FooWithoutRainbow = Omit<Foo, 'rainbow'>;
//=> {unicorn: string}
```


## API

Click the type names for complete docs.

### Basic

- [`Primitive`](source/basic.d.ts) - Matches any [primitive value](https://developer.mozilla.org/en-US/docs/Glossary/Primitive).
- [`Class`](source/basic.d.ts) - Matches a [`class` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).
- [`TypedArray`](source/basic.d.ts) - Matches any [typed array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), like `Uint8Array` or `Float64Array`.
- [`JsonObject`](source/basic.d.ts) - Matches a JSON object.
- [`JsonArray`](source/basic.d.ts) - Matches a JSON array.
- [`JsonValue`](source/basic.d.ts) - Matches any valid JSON value.
- [`ObservableLike`](source/basic.d.ts) - Matches a value that is like an [Observable](https://github.com/tc39/proposal-observable).

### Utilities

- [`Omit`](source/omit.d.ts) - Create a type from an object type without certain keys.
- [`Mutable`](source/mutable.d.ts) - Convert an object with `readonly` properties into a mutable object. Inverse of `Readonly<T>`.
- [`Merge`](source/merge.d.ts) - Merge two types into a new type. Keys of the second type overrides keys of the first type.
- [`MergeExclusive`](source/merge-exclusive.d.ts) - Create a type that has mutually exclusive properties.
- [`RequireAtLeastOne`](source/require-at-least-one.d.ts) - Create a type that requires at least one of the given properties.
- [`LiteralUnion`](source/literal-union.d.ts) - Allows creating a union type by combining primitive types and literal types without sacrificing auto-completion in IDEs for the literal type part of the union. Workaround for [Microsoft/TypeScript#29729](https://github.com/Microsoft/TypeScript/issues/29729).

### Miscellaneous

- [`PackageJson`](source/package-json.d.ts) - Type for [npm's `package.json` file](https://docs.npmjs.com/creating-a-package-json-file).


## Declined types

*If we decline a type addition, we will make sure to document the better solution here.*


## Tips

### Built-in types

There are many advanced types most users don't know about.

- [`Partial<T>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1401-L1406) - Make all properties in `T` optional.

	<details><summary>Example</summary>
	<p>

	```ts
	interface Todo {
		title: string;
		description: string;
	}

	function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
		return { ...todo, ...fieldsToUpdate };
	}

	const todo1 = {
		title: 'organize desk',
		description: 'clear clutter',
	};

	const todo2 = updateTodo(todo1, {
		description: 'throw out trash',
	});
	```

	</p>
	</details>

- [`Required<T>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1408-L1413) - Make all properties in `T` required.

	<details><summary>Example</summary>
	<p>

	```ts
	interface FindPhotosQueryParams {
		searchQuery?: string;
		sort?: "relevance" | "rating" | "upload-date";
		sortOrder?: "asc" | "desc";
	}

	const { searchQuery = "", sort = "relevance", sortOrder = "desc" } = parseQuery(location.search) as FindPhotosQueryParams;
	findPhotos({ searchQuery, sort, sortOrder });

	// Takes URL's search query and returns object.
	function parseQuery(query: string): object {
		const result = {};

		new URLSearchParams(query).forEach((value, key) => {
			result[key] = value;
		});

		return result;
	}

	// Sends GET request to API and returns Promise with found photos.
	function findPhotos(data: Required<FindPhotosQueryParams>) {
		return fetch("/api/find_videos", { body: JSON.stringify(data) });
	}
	```

	</p>
	</details>

- [`Readonly<T>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1415-L1420) - Make all properties in `T` readonly.
- [`Pick<T, K>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1422-L1427) - From `T`, pick a set of properties whose keys are in the union `K`.

	<details><summary>Example</summary>
	<p>

	```ts
	// Creates an object composed of the picked object properties.
	function pick<T extends object, K extends keyof T>(source: T, keys: K[]): Pick<T, K> {
		const result = {} as Partial<Pick<T, K>>;

		keys.forEach((key) => {
			result[key] = source[key];
		})

		return result as Pick<T, K>;
	}

	const todo = {
		title: 'organize desk',
		description: 'clear clutter',
		completed: false
	};

	const previewTodo = pick(todo, ["title", "completed"]);
	previewTodo.description; // Property 'description' does not exist on type 'Pick<{ title: string; description: string; completed: boolean; }, "title" | "completed">'.
	```

	</p>
	</details>


- [`Record<K, T>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1429-L1434) - Construct a type with a set of properties `K` of type `T`.
- [`Exclude<T, U>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1436-L1439) - Exclude from `T` those types that are assignable to `U`.
- [`Extract<T, U>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1441-L1444) - Extract from `T` those types that are assignable to `U`.
- [`NonNullable<T>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1446-L1449) - Exclude `null` and `undefined` from `T`.
- [`Parameters<T>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1451-L1454) - Obtain the parameters of a function type in a tuple.
- [`ConstructorParameters<T>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1456-L1459) - Obtain the parameters of a constructor function type in a tuple.
- [`ReturnType<T>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1461-L1464) – Obtain the return type of a function type.

	<details><summary>Example</summary>
	<p>

	```ts
	function map<F extends (currentValue: T, index?: number) => any, T>(array: T[], callback: F): ReturnType<F>[] {
		const result = [];

		for (let index = 0; index < array.length; index++) {
			result.push(callback(array[index], index));
		}

		return result;
	}

	const users = [{ name: "Alice", age: 42 }, { name: "Bob", age: 37 }];

	const userNames = map(users, (user) => user.name); // string[];
	```

	</p>
	</details>

- [`InstanceType<T>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1466-L1469) – Obtain the instance type of a constructor function type.

You can find some examples in the [TypeScript docs](https://www.typescriptlang.org/docs/handbook/advanced-types.html#predefined-conditional-types).


## Maintainers

- [Sindre Sorhus](https://github.com/sindresorhus)
- [Jarek Radosz](https://github.com/CvX)
- [Dimitri Benin](https://github.com/BendingBender)


## License

(MIT OR CC0-1.0)

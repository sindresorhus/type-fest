import type {MapsSetsOrArrays, NonRecursiveType} from './internal/index.d.ts';
import type {UndefinedOnPartialDeep} from './undefined-on-partial-deep.d.ts'; // For `@link`

/**
Create a type where all optional keys are set to also accept `undefined`.

Note: This is only needed when the [`exactOptionalPropertyTypes`](https://www.typescriptlang.org/tsconfig#exactOptionalPropertyTypes) TSConfig setting is enabled.

Unlike {@link UndefinedOnPartialDeep}, this type only changes the top-level properties. Nested objects, array and tuple elements, map values, set items, functions, and built-in values are kept as is.

The `?` and `readonly` modifiers are preserved, and a required key stays required. An index signature is kept as is, because it has no optional modifier.

Use-cases:
- When `exactOptionalPropertyTypes` is enabled, an object like `{a: undefined}` is not assignable to the type `{a?: number}`. You can use `UndefinedOnPartial<{a?: number}>` to make it assignable.
- Accept an object that lists every optional top-level key explicitly, with `undefined` for the missing values, without loosening nested keys.

@example
```
import type {UndefinedOnPartial} from 'type-fest';

type Settings = {
	optionA: string;
	optionB?: number;
	nested: {
		optionC?: boolean;
	};
};

const settings: UndefinedOnPartial<Settings> = {
	optionA: 'foo',
	optionB: undefined, // 👉 `optionB` can be set to `undefined` now.
	// 👉 Nested optional keys are unchanged.
	nested: {},
};

const nestedSettings: UndefinedOnPartial<Settings> = {
	optionA: 'foo',
	// @ts-expect-error `optionC` is nested, so it does not accept `undefined`.
	nested: {
		optionC: undefined,
	},
};
```

@see {@link UndefinedOnPartialDeep} for the recursive version.

@category Object
*/
export type UndefinedOnPartial<Type> =
	Type extends NonRecursiveType | MapsSetsOrArrays
		? Type
		: Type extends object
			? UndefinedOnPartialObject<Type>
			: Type;

/**
Adds `undefined` to the value type of each top-level optional property, keeping the `?` and `readonly` modifiers.
*/
type UndefinedOnPartialObject<Type extends object> = {
	[Key in keyof Type]: undefined extends Type[Key] ? Type[Key] | undefined : Type[Key];
};

export {};

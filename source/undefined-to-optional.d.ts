import type {UndefinedToOptionalObject, MapsSetsOrArrays, NonRecursiveType} from './internal/index.d.ts';
import type {PartialOnUndefined} from './partial-on-undefined.d.ts'; // For `@link`

/**
Make properties with a union containing `undefined` optional, removing `undefined` from their values.

Use it for objects where an absent value must be omitted instead of set to `undefined`. Unlike {@link PartialOnUndefined}, `{value: string | undefined}` becomes `{value?: string}`, which rejects `{value: undefined}` with `exactOptionalPropertyTypes`. Without that option, removing `undefined` has no effect.

Only top-level properties change, and the `readonly` modifier is preserved. An optional property loses `undefined` too. Index signatures and properties typed as only `undefined`, `any`, `unknown`, or `never` are kept as is, and so is a union that TypeScript treats as `unknown`, like `{} | null | undefined`.

A `void` property becomes optional but still accepts `undefined`. An index signature that includes `void` gets `undefined` added, which does not change what it accepts.

Unions are processed member by member. Non-object types, functions, built-in values, arrays, tuples, maps, and sets are kept as is.

@example
```
import type {UndefinedToOptional} from 'type-fest';

type Settings = {
	id: string;
	theme: 'light' | 'dark' | undefined;
	label?: string | undefined;
};

type StrictSettings = UndefinedToOptional<Settings>;
//=> {id: string; theme?: 'light' | 'dark'; label?: string}

const settings: StrictSettings = {id: 'editor'};

// @ts-expect-error Omit `theme` instead of setting it to `undefined`.
const invalidSettings: StrictSettings = {id: 'editor', theme: undefined};
```

@see {@link PartialOnUndefined} to keep `undefined` in the values.

@category Object
*/
export type UndefinedToOptional<ObjectType> =
	// Distribute before mapping so discriminated union members keep their own keys and values.
	ObjectType extends NonRecursiveType | MapsSetsOrArrays
		? ObjectType
		: ObjectType extends object
			? UndefinedToOptionalObject<ObjectType>
			: ObjectType;

export {};

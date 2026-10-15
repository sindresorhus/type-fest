/**
Matches a JSON object.

This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. Don't use this as a direct return type as the user would have to double-cast it: `jsonObject as unknown as CustomResponse`. Instead, you could extend your CustomResponse type from it to ensure your type only uses JSON-compatible types: `interface CustomResponse extends JsonObject { … }`.

Note: Optional properties need [`exactOptionalPropertyTypes`](https://www.typescriptlang.org/tsconfig#exactOptionalPropertyTypes), because `undefined` is not a JSON value. Use `Jsonifiable` for values passed to `JSON.stringify`.

Note: An object with symbol keys is assignable to `JsonObject`, because TypeScript does not check symbol keys against a string index signature. This is safe, as `JSON.stringify` ignores symbol keys.

@category JSON
*/
export type JsonObject = {[Key in string]: JsonValue};

/**
Matches a JSON array.

@category JSON
*/
export type JsonArray = JsonValue[] | readonly JsonValue[];

/**
Matches any valid JSON primitive value.

@category JSON
*/
export type JsonPrimitive = string | number | boolean | null;

/**
Matches any valid JSON value.

Note: An `interface` is not assignable to `JsonValue`, because TypeScript does not give an interface an implicit index signature (more properties can be merged into an interface later). To fix it, do one of these:
- Use a `type` alias instead.
- Make the interface extend `JsonObject`. Optional properties then need `exactOptionalPropertyTypes`.
- Use `Jsonify` to transform it.

Note: `Array.isArray()` does not narrow away the `readonly JsonValue[]` part of `JsonValue`, because TypeScript types it as `arg is any[]` ([TypeScript#17002](https://github.com/microsoft/TypeScript/issues/17002)). `JsonValue` accepts readonly arrays so that values like `[1, 2] as const` are assignable. To narrow it, use a type guard that also matches readonly arrays:

@example
```
import type {JsonValue} from 'type-fest';

const isArray = Array.isArray as (value: unknown) => value is readonly unknown[];

declare const value: JsonValue;

if (typeof value === 'object' && value !== null && !isArray(value)) {
	const object = value;
	//=> JsonObject
}
```

@see `Jsonify` if you need to transform a type to one that is assignable to `JsonValue`.

@category JSON
*/
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export {};

/**
Matches a [`class` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).

@category Basic
*/
export type Class<T, Arguments extends any[] = any[]> = new(...arguments_: Arguments) => T;

/**
Matches a JSON object.

This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. Don't use this as a direct return type as the user would have to double-cast it: `jsonObject as unknown as CustomResponse`. Instead, you could extend your CustomResponse type from it to ensure your type only uses JSON-compatible types: `interface CustomResponse extends JsonObject { … }`.

@category Basic
*/
export type JsonObject = {[Key in string]?: JsonValue};

/**
Matches a JSON array.

@category Basic
*/
export type JsonArray = JsonValue[];

/**
Matches any valid JSON value.

@category Basic
*/
export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;

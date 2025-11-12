/**
Represents an object with `unknown` value. You probably want this instead of `{}`.

Use case: You have an object whose keys and values are unknown to you.

@example
```
import type {UnknownRecord} from 'type-fest';

function toJson(object: UnknownRecord) {
	return JSON.stringify(object);
}

toJson({hello: 'world'});
//=> '{"hello":"world"}'

function isObject(value: unknown): value is UnknownRecord {
	return typeof value === 'object' && value !== null;
}

isObject({hello: 'world'});
//=> true

isObject('hello');
//=> false
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gVQHYGtsQDu2ASigMbQAmAvnAGZQQhwDkSqAtPSgM4ysA3AChh9AK7ZyMYBGwIIAKV5yAFBABGAKwowAXHBz4ipCtQCUGYQEgoKGOKjzFAZQDyAOQB0-KMGwA5sD0iOrauuYiNKIwSirYqugAFigANqkQBqyE0KlUrDSRwgD0xQC8AHxs6ABEKekQNXo1OVB5NTSsohJSMnJwwLxu4dKqAG4AhqniKAaSxsTmBpPTaIOGeATEZJRQVFa29o7yHCgQ9HArM3Blt2yaOtKscABkL5dT1wCEd9ji6VFRINho8YIl6hksq08gUiqVKggoDMgUMRmDWBCIKw4eUqvQprwUEA)

@category Type
@category Object
*/
export type UnknownRecord = Record<PropertyKey, unknown>;

export {};

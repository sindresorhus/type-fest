/**
Returns a boolean for whether the given type is `any`.

@link https://stackoverflow.com/a/49928360/1490091

Useful in type utilities, such as disallowing `any`s to be passed to a function.

@example
```
import type {IsAny} from 'type-fest';

const typedObject = {a: 1, b: 2} as const;
const anyObject: any = {a: 1, b: 2};

function get<O extends (IsAny<O> extends true ? {} : Record<string, number>), K extends keyof O = keyof O>(obj: O, key: K) {
	return obj[key];
}

const typedA = get(typedObject, 'a');
//=> 1

const anyA = get(anyObject, 'a');
//=> any
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSQM4EEB2iAvnAGZQQhwDkSqAtKStjNQNwBQHAxhPiwmQoAJgHkARgCsU3eAF4MAQwBccAIwAaOONUAmEouxxe-GJxMDFhCdNmqriOAvQr1WnXH2cOpAK75ZYD44AHMUGAAeUTgUAA8YFHxhIwAKHAJEKIA+GPjE5IQoXzQAfgwSVQAlGWhhCJYoYHwQrXxfEHEUKCyASi0AaVyEpKMAaxRECFI4aIVxyenRLJSIKVVRLXnVfp6MDgBIKHDfKHw4VckAbXmAXU4iLgt4OhFcJ1DwlJexKRkYLWoimoPU4AHpQXIcmpHnxLIQ3gowjAUg4bH8AUCQRxwZC4A4gA)

@category Type Guard
@category Utilities
*/
export type IsAny<T> = 0 extends 1 & NoInfer<T> ? true : false;

export {};

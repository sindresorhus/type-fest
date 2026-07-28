/**
Returns a boolean for whether the given type is `any`.

@link https://stackoverflow.com/a/49928360/1490091

Useful in type utilities, such as disallowing `any`s to be passed to a function.

Uses the built-in [`NoInfer`](https://www.typescriptlang.org/docs/handbook/utility-types.html#noinfertype) utility type to prevent circular constraint errors.

@example
```
import type {IsAny} from 'type-fest';

const typedObject = {a: 1, b: 2} as const;
const anyObject: any = {a: 1, b: 2};

function get<O extends (IsAny<O> extends true ? {} : Record<string, number>), K extends keyof O = keyof O>(object: O, key: K) {
	return object[key];
}

const typedA = get(typedObject, 'a');
//=> 1

const anyA = get(anyObject, 'a');
//=> any
```

@see https://www.typescriptlang.org/docs/handbook/utility-types.html#noinfertype

@category Type Guard
@category Utilities
*/
export type IsAny<T> = 0 extends 1 & NoInfer<T> ? true : false;

export {};

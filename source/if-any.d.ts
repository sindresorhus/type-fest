import type {IsAny} from './is-any';

/**
If the given type `T` is `any`, the returned type is `TypeIfAny`. Otherwise, the return type is `TypeIfNotAny`. If only `T` is specified, `TypeIfAny` will be `true` and `TypeIfNotAny` will be false.

@link https://stackoverflow.com/a/49928360/1490091

Useful in type utilities, such as disallowing `any`s to be passed to a function.

@example
```
import type {IfAny} from 'type-fest';

const typedObject = {a: 1, b: 2} as const;
const anyObject: any = {a: 1, b: 2};

function get<O extends IfAny<O, {}, Record<string, number>>, K extends keyof O = keyof O>(obj: O, key: K) {
	return obj[key];
}

const typedA = get(typedObject, 'a');
//=> 1

const anyA = get(anyObject, 'a');
//=> any
```

@category Utilities
*/
export type IfAny<T, TypeIfAny = true, TypeIfNotAny = false> = (
	IsAny<T> extends true ? TypeIfAny : TypeIfNotAny
);

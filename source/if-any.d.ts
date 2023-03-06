import type {IsAny} from './is-any';

/**
If the given type `T` is `any`, the returned type is `TypeIfAny`. Otherwise, the return type is `TypeIfNotAny`. If only `T` is specified, `TypeIfAny` will be `true` and `TypeIfNotAny` will be false.

@link https://stackoverflow.com/a/49928360/1490091

Useful for disallowing `any`s to be passed to a function or used in a type utility.

@example
```
import type {IfAny} from 'type-fest';

function get<O extends IfAny<O, never, Record<string, number>>, K extends keyof O = keyof O>(obj: O, key: K) {
	return obj[key];
}
```

@category Utilities
*/
export type IfAny<T, TypeIfAny = true, TypeIfNotAny = false> = (
	IsAny<T> extends true ? TypeIfAny : TypeIfNotAny
);

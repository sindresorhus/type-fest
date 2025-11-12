import type {IsEmptyObject} from './empty-object.d.ts';

/**
An if-else-like type that resolves depending on whether the given type is `{}`.

@deprecated This type will be removed in the next major version. Use the {@link If} type instead.

@see {@link IsEmptyObject}

@example
```
import type {IfEmptyObject} from 'type-fest';

type ShouldBeTrue = IfEmptyObject<{}>;
//=> true

type ShouldBeBar = IfEmptyObject<{key: any}, 'foo', 'bar'>;
//=> 'bar'
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSQGYFFxIDyARgFYoDGMAvnNlBCHAORKoC02KAzjMwNwAoQWzQBlABYQArgBsAJgCEUAFSjS0AXjg58YImUowAPOmoA+IQHorm8wnUphouJJkLligIZQ423QSIJORUpgDWKIgAXHBeAHaI1AA0LNgQEMwpzMQ+zJaCNnYsOVDMQA)

@category Type Guard
@category Utilities
*/
export type IfEmptyObject<
	T,
	TypeIfEmptyObject = true,
	TypeIfNotEmptyObject = false,
> = IsEmptyObject<T> extends true ? TypeIfEmptyObject : TypeIfNotEmptyObject;

export {};

import type {IsUnknown} from './is-unknown.d.ts';

/**
An if-else-like type that resolves depending on whether the given type is `unknown`.

@deprecated This type will be removed in the next major version. Use the {@link If} type instead.

@see {@link IsUnknown}

@example
```
import type {IfUnknown} from 'type-fest';

type ShouldBeTrue = IfUnknown<unknown>;
//=> true

type ShouldBeBar = IfUnknown<'not unknown', 'foo', 'bar'>;
//=> 'bar'
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSQGYFUB2A1vhAO74C+c2UEIcA5EqgLTYoDOMDA3AFB9maAMoALCAFcANgBMAQigAqUCWgC8cHAWJl8AHglES5AHz8A9ObUmEKlAKFwxk2QrkBDKHA1ajuvQwk8IY65AwANIzYEBARjABGngxmfJbWCUlAA)

@category Type Guard
@category Utilities
*/
export type IfUnknown<T, TypeIfUnknown = true, TypeIfNotUnknown = false> = (
	IsUnknown<T> extends true ? TypeIfUnknown : TypeIfNotUnknown
);

export {};

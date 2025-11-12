import type {IsAny} from './is-any.d.ts';

/**
An if-else-like type that resolves depending on whether the given type is `any`.

@deprecated This type will be removed in the next major version. Use the {@link If} type instead.

@see {@link IsAny}

@example
```
import type {IfAny} from 'type-fest';

type ShouldBeTrue = IfAny<any>;
//=> true

type ShouldBeBar = IfAny<'not any', 'foo', 'bar'>;
//=> 'bar'
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSQGYEEB2iAvnNlBCHAORKoC02KAzjFQNwBQHtaAygBYQArgBsAJgCEUAFShC0AXjg4CiADwBDQgD5OAej0LtCOSi484A4eKkSNUOEpWE1VfBHhbEVADTVsEBC+1ABG9lS6HAZGoeFAA)

@category Type Guard
@category Utilities
*/
export type IfAny<T, TypeIfAny = true, TypeIfNotAny = false> = (
	IsAny<T> extends true ? TypeIfAny : TypeIfNotAny
);

export {};

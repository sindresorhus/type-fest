import type {IsNever} from './is-never.d.ts';

/**
An if-else-like type that resolves depending on whether the given type is `never`.

@deprecated This type will be removed in the next major version. Use the {@link If} type instead.

@see {@link IsNever}

@example
```
import type {IfNever} from 'type-fest';

type ShouldBeTrue = IfNever<never>;
//=> true

type ShouldBeBar = IfNever<'not never', 'foo', 'bar'>;
//=> 'bar'
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSQGYDkUBuKUAvnNlBCHAORKoC02KAzjDQNwBQX9aAygAsIAVwA2AEwBCKACpQRaALxwc+IlAA8AO0LEAfNwD0RpfoQKUPPnCGjJMqQEMocFWr1aa2iPF0aaABpabAgIINoAIxcaQy4TMyiYoA)

@category Type Guard
@category Utilities
*/
export type IfNever<T, TypeIfNever = true, TypeIfNotNever = false> = (
	IsNever<T> extends true ? TypeIfNever : TypeIfNotNever
);

export {};

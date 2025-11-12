import type {IsNull} from './is-null.d.ts';

/**
An if-else-like type that resolves depending on whether the given type is `null`.

@deprecated This type will be removed in the next major version. Use the {@link If} type instead.

@see {@link IsNull}

@example
```
import type {IfNull} from 'type-fest';

type ShouldBeTrue = IfNull<null>;
//=> true

type ShouldBeBar = IfNull<'not null', 'foo', 'bar'>;
//=> 'bar'
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSQGYDkCuANoQL5zZQQhwDkSqAtNigM4w0DcAUF-WgMoALCEQAmAIRQAVKPjQBeODgLEAPADsihAHzcA9HvnaEslDz5whIwhJTiAhlDiLlW1TXUR4m4jQA0tNgQEP60AEaONLpcBkbhkUA)

@category Type Guard
@category Utilities
*/
export type IfNull<T, TypeIfNull = true, TypeIfNotNull = false> = (
	IsNull<T> extends true ? TypeIfNull : TypeIfNotNull
);

export {};

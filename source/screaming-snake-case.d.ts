import type {_DefaultDelimiterCaseOptions} from './delimiter-case.d.ts';
import type {ApplyDefaultOptions} from './internal/index.d.ts';
import type {SnakeCase} from './snake-case.d.ts';
import type {WordsOptions} from './words.d.ts';

/**
Convert a string literal to screaming-snake-case.

This can be useful when, for example, converting a camel-cased object property to a screaming-snake-cased SQL column name.

@example
```
import type {ScreamingSnakeCase} from 'type-fest';

const someVariable: ScreamingSnakeCase<'fooBar'> = 'FOO_BAR';
const someVariableNoSplitOnNumbers: ScreamingSnakeCase<'p2pNetwork', {splitOnNumbers: false}> = 'P2P_NETWORK';

```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gZQMZRQQxGADsBzTY-AaxQGF8BnFAXzgDMoIQ4ByJVALRsUDGDwDcAKEnYIxUXAZcUANXxRg+AEYAbFAC44OPIRLlKNekwA8PNhAgAhdTwB8cALy8AYgHlfAPqOAIIAShIycgpKIKrqmrooAHIQmGA6wDC+xEkAriBaKFAMhsYERGQU1HSMKLZgAExgSSgwAO7QVDwANBgM6ZnZeQVFJez4OkzM7l48AAoNcwFJAKIAKgDqvqEA0hFAA)

@category Change case
@category Template literal
 */
export type ScreamingSnakeCase<
	Value,
	Options extends WordsOptions = {},
> = Value extends string
	? Uppercase<SnakeCase<Value, ApplyDefaultOptions<WordsOptions, _DefaultDelimiterCaseOptions, Options>>>
	: Value;

export {};

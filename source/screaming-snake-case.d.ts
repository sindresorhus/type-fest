import type {SnakeCase} from './snake-case';

/**
Convert a string literal to screaming-snake-case.

This can be useful when, for example, converting a camel-cased object property to a screaming-snake-cased SQL column name.

@example
```
import type {ScreamingSnakeCase} from 'type-fest';

const someVariable: ScreamingSnakeCase<'fooBar'> = 'FOO_BAR';
```

@category Change case
@category Template literal
 */
export type ScreamingSnakeCase<Value> = Value extends string
	? Uppercase<SnakeCase<Value>>
	: Value;

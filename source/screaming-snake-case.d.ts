import type {SnakeCase} from './snake-case';
import type {WordsOptions} from './words';

/**
Convert a string literal to screaming-snake-case.

This can be useful when, for example, converting a camel-cased object property to a screaming-snake-cased SQL column name.

@example
```
import type {ScreamingSnakeCase} from 'type-fest';

const someVariable: ScreamingSnakeCase<'fooBar'> = 'FOO_BAR';
const someVariableNoSplitOnNumbers: ScreamingSnakeCase<'p2pNetwork', {splitOnNumbers: false}> = 'P2P_NETWORK';

```

@category Change case
@category Template literal
 */
export type ScreamingSnakeCase<
	Value,
	Options extends WordsOptions = {splitOnNumbers: false},
> = Value extends string ? Uppercase<SnakeCase<Value, Options>> : Value;

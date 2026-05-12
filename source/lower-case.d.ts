import type {_DefaultDelimiterCaseOptions, DelimiterCase} from './delimiter-case.d.ts';
import type {ApplyDefaultOptions} from './internal/index.d.ts';
import type {WordsOptions} from './words.d.ts';

/**
Convert a string literal to lowercase.

This can be useful when, for example, converting a camel-cased object property to a lowercase SQL column name.

@example
```
import type {LowerCase} from 'type-fest';

const someVariable: LowerCase<'fooBar'> = 'foobar';
const someVariableNoSplitOnNumbers: LowerCase<'p2pNetwork'> = 'p2pnetwork';
const someVariableWithPunctuation: LowerCase<'onDialog:close', {splitOnPunctuation: true}> = 'ondialogclose';

```

@category Change case
@category Template literal
*/
/**
Convert a string literal to lowercase.

This can be useful when, for example, converting a camel-cased object property to a lowercase SQL column name.

@example
```
import type {LowerCase} from 'type-fest';

const someVariable: LowerCase<'fooBar'> = 'foobar';
const someVariableNoSplitOnNumbers: LowerCase<'p2pNetwork'> = 'p2pnetwork';
const someVariableWithPunctuation: LowerCase<'onDialog:close', {splitOnPunctuation: true}> = 'ondialogclose';

```

@category Change case
@category Template literal
*/
export type LowerCase<
	Value,
	Options extends WordsOptions = {},
> = DelimiterCase<Value, '', ApplyDefaultOptions<WordsOptions, _DefaultDelimiterCaseOptions, Options>>;

export {};

import type {_DefaultDelimiterCaseOptions, DelimiterCase} from './delimiter-case.d.ts';
import type {ApplyDefaultOptions} from './internal/index.d.ts';
import type {WordsOptions} from './words.d.ts';

/**
Convert a string literal to lowercase with words separated by spaces.

This can be useful when, for example, converting a camel-cased label key to human-readable lowercase text.

@example
```
import type {LowerSpaced} from 'type-fest';

const someVariable: LowerSpaced<'fooBar'> = 'foo bar';
const someVariableNoSplitOnNumbers: LowerSpaced<'p2pNetwork'> = 'p2p network';
const someVariableWithPunctuation: LowerSpaced<'onDialog:close', {splitOnPunctuation: true}> = 'on dialog close';

```

@category Change case
@category Template literal
*/
export type LowerSpaced<
	Value,
	Options extends WordsOptions = {},
> = DelimiterCase<Value, ' ', ApplyDefaultOptions<WordsOptions, _DefaultDelimiterCaseOptions, Options>>;

export {};

import type {_DefaultDelimiterCaseOptions} from './delimiter-case.d.ts';
import type {DelimiterCasedProperties} from './delimiter-cased-properties.d.ts';
import type {ApplyDefaultOptions} from './internal/index.d.ts';
import type {WordsOptions} from './words.d.ts';

/**
Convert top-level object properties to lowercase.

This can be useful when, for example, converting some API types from a different style.

@see {@link LowerDespaced}
@see {@link LowerDespacedPropertiesDeep}

@example
```
import type {LowerDespacedProperties} from 'type-fest';

type User = {
	userId: number;
	userName: string;
};

const result: LowerDespacedProperties<User> = {
	userid: 1,
	username: 'Tom',
};

const splitOnPunctuation: LowerDespacedProperties<{'foo::bar': string}, {splitOnPunctuation: true}> = {
	foobar: 'string',
};
```

@category Change case
@category Template literal
@category Object
*/
export type LowerDespacedProperties<
	Value,
	Options extends WordsOptions = {},
> = DelimiterCasedProperties<Value, '', ApplyDefaultOptions<WordsOptions, _DefaultDelimiterCaseOptions, Options>>;

export {};

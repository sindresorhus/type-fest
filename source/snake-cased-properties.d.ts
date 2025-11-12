import type {_DefaultDelimiterCaseOptions} from './delimiter-case.d.ts';
import type {DelimiterCasedProperties} from './delimiter-cased-properties.d.ts';
import type {ApplyDefaultOptions} from './internal/index.d.ts';
import type {WordsOptions} from './words.d.ts';

/**
Convert object properties to snake case but not recursively.

This can be useful when, for example, converting some API types from a different style.

@see {@link SnakeCase}
@see {@link SnakeCasedPropertiesDeep}

@example
```
import type {SnakeCasedProperties} from 'type-fest';

interface User {
	userId: number;
	userName: string;
}

const result: SnakeCasedProperties<User> = {
	user_id: 1,
	user_name: 'Tom',
};

const splitOnNumbers: SnakeCasedProperties<{line1: string}, {splitOnNumbers: true}> = {
	'line_1': 'string',
};
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gZQHYEMDWKAwrgM4oAmAClBKrMCqQL5wBmtIcA5EqgLRsmMbgG4AUOODYYKKG1wBjNAFVyUDOICQAV3UBJCgC442HSABGcibvUA5XCBQnSMKNIDmE5pMURsrnBQTDoANjAmOATEZJQ0dHIwjKQAPGpyAHxwALyatnIA+sDGcACMADTaeoV4TibcACoQINyVzBLifgHwpGChwDAA8th25lZQpJF4hCTk1LT0SUwp6P3YKKUubp7M5Ri9-UMjY3KTCFA6KMxZueja3GsoBaXc9a7u2B6t4u1AA)

@category Change case
@category Template literal
@category Object
*/
export type SnakeCasedProperties<
	Value,
	Options extends WordsOptions = {},
> = DelimiterCasedProperties<Value, '_', ApplyDefaultOptions<WordsOptions, _DefaultDelimiterCaseOptions, Options>>;

export {};

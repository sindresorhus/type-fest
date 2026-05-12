/**
Convert top-level object properties to lowercase without changing existing delimiters.

This can be useful when, for example, converting some API types from a different style while preserving punctuation and separators.

@example
```
import type {LowerCaseProperties} from 'type-fest';

type User = {
	userId: number;
	'user-name': string;
	'user.name': string;
};

const result: LowerCaseProperties<User> = {
	userid: 1,
	'user-name': 'Tom',
	'user.name': 'Tom',
};
```

@category Change case
@category Template literal
@category Object
*/
export type LowerCaseProperties<Value> = Value extends Function
	? Value
	: Value extends Array<infer U>
		? Value
		: {
			[K in keyof Value as K extends string ? Lowercase<K> : K]: Value[K];
		};

export {};

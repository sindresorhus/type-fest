import type {_DefaultDelimiterCaseOptions} from './delimiter-case.d.ts';
import type {DelimiterCasedPropertiesDeep} from './delimiter-cased-properties-deep.d.ts';
import type {ApplyDefaultOptions} from './internal/index.d.ts';
import type {WordsOptions} from './words.d.ts';

/**
Convert object properties to lowercase with words separated by spaces recursively.

This can be useful when, for example, converting some API types from a different style.

@see {@link LowerSpaced}
@see {@link LowerSpacedProperties}

@example
```
import type {LowerSpacedPropertiesDeep} from 'type-fest';

type User = {
	userId: number;
	userName: string;
};

type UserWithFriends = {
	userInfo: User;
	userFriends: User[];
};

const result: LowerSpacedPropertiesDeep<UserWithFriends> = {
	'user info': {
		'user id': 1,
		'user name': 'Tom',
	},
	'user friends': [
		{
			'user id': 2,
			'user name': 'Jerry',
		},
		{
			'user id': 3,
			'user name': 'Spike',
		},
	],
};

const splitOnPunctuation: LowerSpacedPropertiesDeep<{'user@info': {'user::id': number; 'user::name': string}}, {splitOnPunctuation: true}> = {
	'user info': {
		'user id': 1,
		'user name': 'Tom',
	},
};
```

@category Change case
@category Template literal
@category Object
*/
export type LowerSpacedPropertiesDeep<
	Value,
	Options extends WordsOptions = {},
> = DelimiterCasedPropertiesDeep<Value, ' ', ApplyDefaultOptions<WordsOptions, _DefaultDelimiterCaseOptions, Options>>;

export {};

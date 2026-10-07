import type {_DefaultDelimiterCaseOptions} from './delimiter-case.d.ts';
import type {ApplyDefaultOptions} from './internal/index.d.ts';
import type {CasedPropertiesDeep} from './internal/cased-properties-deep.d.ts';
import type {WordsOptions} from './words.d.ts';

/**
Convert object properties to a custom string delimiter casing recursively.

This can be useful when, for example, converting some API types from a different style.

@see {@link DelimiterCase}
@see {@link DelimiterCasedProperties}

@example
```
import type {DelimiterCasedPropertiesDeep} from 'type-fest';

type User = {
	userId: number;
	userName: string;
};

type UserWithFriends = {
	userInfo: User;
	userFriends: User[];
};

const result: DelimiterCasedPropertiesDeep<UserWithFriends, '-'> = {
	'user-info': {
		'user-id': 1,
		'user-name': 'Tom',
	},
	'user-friends': [
		{
			'user-id': 2,
			'user-name': 'Jerry',
		},
		{
			'user-id': 3,
			'user-name': 'Spike',
		},
	],
};

const splitOnNumbers: DelimiterCasedPropertiesDeep<{line1: {line2: [{line3: string}]}}, '-', {splitOnNumbers: true}> = {
	'line-1': {
		'line-2': [
			{
				'line-3': 'string',
			},
		],
	},
};

const splitOnPunctuation: DelimiterCasedPropertiesDeep<{'user@info': {'user::id': number; 'user::name': string}}, '-', {splitOnPunctuation: true}> = {
	'user-info': {
		'user-id': 1,
		'user-name': 'Tom',
	},
};
```

@category Change case
@category Template literal
@category Object
*/
export type DelimiterCasedPropertiesDeep<
	Value,
	Delimiter extends string,
	Options extends WordsOptions = {},
> = CasedPropertiesDeep<Value, {delimiter: Delimiter}, ApplyDefaultOptions<WordsOptions, _DefaultDelimiterCaseOptions, Options>>;

export {};

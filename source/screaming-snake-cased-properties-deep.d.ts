import type {CasedPropertiesDeep} from './internal/cased-properties-deep.d.ts';
import type {WordsOptions} from './words.d.ts';
import type {ScreamingSnakeCase} from './screaming-snake-case.d.ts'; // For `@link`
import type {ScreamingSnakeCasedProperties} from './screaming-snake-cased-properties.d.ts'; // For `@link`

/**
Convert object properties to screaming snake case recursively.

This can be useful when, for example, converting some API types from a different style.

@see {@link ScreamingSnakeCase}
@see {@link ScreamingSnakeCasedProperties}

@example
```
import type {ScreamingSnakeCasedPropertiesDeep} from 'type-fest';

type User = {
	userId: number;
	userName: string;
};

type UserWithFriends = {
	userInfo: User;
	userFriends: User[];
};

const result: ScreamingSnakeCasedPropertiesDeep<UserWithFriends> = {
	USER_INFO: {
		USER_ID: 1,
		USER_NAME: 'Tom',
	},
	USER_FRIENDS: [
		{
			USER_ID: 2,
			USER_NAME: 'Jerry',
		},
		{
			USER_ID: 3,
			USER_NAME: 'Spike',
		},
	],
};

const splitOnNumbers: ScreamingSnakeCasedPropertiesDeep<{line1: {line2: [{line3: string}]}}, {splitOnNumbers: true}> = {
	LINE_1: {
		LINE_2: [
			{
				LINE_3: 'string',
			},
		],
	},
};

const splitOnPunctuation: ScreamingSnakeCasedPropertiesDeep<{'user@info': {'user::id': number; 'user::name': string}}, {splitOnPunctuation: true}> = {
	USER_INFO: {
		USER_ID: 1,
		USER_NAME: 'Tom',
	},
};
```

@category Change case
@category Template literal
@category Object
*/
export type ScreamingSnakeCasedPropertiesDeep<
	Value,
	Options extends WordsOptions = {},
> = CasedPropertiesDeep<Value, 'screamingSnake', Options>;

export {};

import type {_DefaultDelimiterCaseOptions} from './delimiter-case.d.ts';
import type {DelimiterCasedPropertiesDeep} from './delimiter-cased-properties-deep.d.ts';
import type {ApplyDefaultOptions} from './internal/index.d.ts';
import type {WordsOptions} from './words.d.ts';

/**
Convert object properties to lowercase recursively.

This can be useful when, for example, converting some API types from a different style.

@see {@link LowerCase}
@see {@link LowerCasedProperties}

@example
```
import type {LowerCasedPropertiesDeep} from 'type-fest';

type User = {
	userId: number;
	userName: string;
};

type UserWithFriends = {
	userInfo: User;
	userFriends: User[];
};

const result: LowerCasedPropertiesDeep<UserWithFriends> = {
	userinfo: {
		userid: 1,
		username: 'Tom',
	},
	userfriends: [
		{
			userid: 2,
			username: 'Jerry',
		},
		{
			userid: 3,
			username: 'Spike',
		},
	],
};

const splitOnPunctuation: LowerCasedPropertiesDeep<{'user@info': {'user::id': number; 'user::name': string}}, {splitOnPunctuation: true}> = {
	userinfo: {
		userid: 1,
		username: 'Tom',
	},
};
```

@category Change case
@category Template literal
@category Object
*/
/**
Convert object properties to lowercase recursively.

This can be useful when, for example, converting some API types from a different style.

@see {@link LowerCase}
@see {@link LowerCasedProperties}

@example
```
import type {LowerCasedPropertiesDeep} from 'type-fest';

type User = {
	userId: number;
	userName: string;
};

type UserWithFriends = {
	userInfo: User;
	userFriends: User[];
};

const result: LowerCasedPropertiesDeep<UserWithFriends> = {
	userinfo: {
		userid: 1,
		username: 'Tom',
	},
	userfriends: [
		{
			userid: 2,
			username: 'Jerry',
		},
		{
			userid: 3,
			username: 'Spike',
		},
	],
};

const splitOnPunctuation: LowerCasedPropertiesDeep<{'user@info': {'user::id': number; 'user::name': string}}, {splitOnPunctuation: true}> = {
	userinfo: {
		userid: 1,
		username: 'Tom',
	},
};
```

@category Change case
@category Template literal
@category Object
*/
export type LowerCasedPropertiesDeep<
	Value,
	Options extends WordsOptions = {},
> = DelimiterCasedPropertiesDeep<Value, '', ApplyDefaultOptions<WordsOptions, _DefaultDelimiterCaseOptions, Options>>;

export {};

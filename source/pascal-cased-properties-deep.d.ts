import type {CamelCaseOptions, _DefaultCamelCaseOptions} from './camel-case.d.ts';
import type {ApplyDefaultOptions} from './internal/index.d.ts';
import type {CasedPropertiesDeep} from './internal/cased-properties-deep.d.ts';

/**
Convert object properties to pascal case recursively.

This can be useful when, for example, converting some API types from a different style.

@see {@link PascalCase}
@see {@link PascalCasedProperties}

@example
```
import type {PascalCasedPropertiesDeep} from 'type-fest';

type User = {
	userId: number;
	userName: string;
};

type UserWithFriends = {
	userInfo: User;
	userFriends: User[];
};

const result: PascalCasedPropertiesDeep<UserWithFriends> = {
	UserInfo: {
		UserId: 1,
		UserName: 'Tom',
	},
	UserFriends: [
		{
			UserId: 2,
			UserName: 'Jerry',
		},
		{
			UserId: 3,
			UserName: 'Spike',
		},
	],
};

const preserveConsecutiveUppercase: PascalCasedPropertiesDeep<{fooBAR: {fooBARBiz: [{fooBARBaz: string}]}}, {preserveConsecutiveUppercase: true}> = {
	FooBAR: {
		FooBARBiz: [{
			FooBARBaz: 'string',
		}],
	},
};

const splitOnPunctuation: PascalCasedPropertiesDeep<{'user@info': {'user::id': number; 'user::name': string}}, {splitOnPunctuation: true}> = {
	UserInfo: {
		UserId: 1,
		UserName: 'Tom',
	},
};
```

@category Change case
@category Template literal
@category Object
*/
export type PascalCasedPropertiesDeep<Value, Options extends CamelCaseOptions = {}> =
	CasedPropertiesDeep<Value, 'pascal', ApplyDefaultOptions<CamelCaseOptions, _DefaultCamelCaseOptions, Options>>;

export {};

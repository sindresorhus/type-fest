import type {CamelCaseOptions, _DefaultCamelCaseOptions} from './camel-case.d.ts';
import type {ApplyDefaultOptions} from './internal/index.d.ts';
import type {CasedPropertiesDeep} from './internal/cased-properties-deep.d.ts';

/**
Convert object properties to camel case recursively.

This can be useful when, for example, converting some API types from a different style.

@see {@link CamelCasedProperties}
@see {@link CamelCase}

@example
```
import type {CamelCasedPropertiesDeep} from 'type-fest';

type User = {
	UserId: number;
	UserName: string;
};

type UserWithFriends = {
	UserInfo: User;
	UserFriends: User[];
};

const result: CamelCasedPropertiesDeep<UserWithFriends> = {
	userInfo: {
		userId: 1,
		userName: 'Tom',
	},
	userFriends: [
		{
			userId: 2,
			userName: 'Jerry',
		},
		{
			userId: 3,
			userName: 'Spike',
		},
	],
};

const preserveConsecutiveUppercase: CamelCasedPropertiesDeep<{fooBAR: {fooBARBiz: [{fooBARBaz: string}]}}, {preserveConsecutiveUppercase: true}> = {
	fooBAR: {
		fooBARBiz: [{
			fooBARBaz: 'string',
		}],
	},
};

const splitOnPunctuation: CamelCasedPropertiesDeep<{'user@info': {'user::id': number; 'user::name': string}}, {splitOnPunctuation: true}> = {
	userInfo: {
		userId: 1,
		userName: 'Tom',
	},
};
```

@category Change case
@category Template literal
@category Object
*/
export type CamelCasedPropertiesDeep<
	Value,
	Options extends CamelCaseOptions = {},
> = CasedPropertiesDeep<Value, 'camel', ApplyDefaultOptions<CamelCaseOptions, _DefaultCamelCaseOptions, Options>>;

export {};

import type {_DefaultDelimiterCaseOptions} from './delimiter-case.d.ts';
import type {DelimiterCasedPropertiesDeep} from './delimiter-cased-properties-deep.d.ts';
import type {ApplyDefaultOptions} from './internal/index.d.ts';
import type {WordsOptions} from './words.d.ts';

/**
Convert object properties to kebab case recursively.

This can be useful when, for example, converting some API types from a different style.

@see {@link KebabCase}
@see {@link KebabCasedProperties}

@example
```
import type {KebabCasedPropertiesDeep} from 'type-fest';

interface User {
	userId: number;
	userName: string;
}

interface UserWithFriends {
	userInfo: User;
	userFriends: User[];
}

const result: KebabCasedPropertiesDeep<UserWithFriends> = {
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

const splitOnNumbers: KebabCasedPropertiesDeep<{line1: { line2: [{ line3: string }] }}, {splitOnNumbers: true}> = {
	'line-1': {
		'line-2': [
			{
				'line-3': 'string',
			},
		],
	},
};
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gaRQIwIY4DCeAzigCYAKUEqswKJAIiimAL5wBmNIcA5ElQBaLoxj8A3AChpwAHYwUULngDGaAKpkoGaQEgArjoCS5AFxx5hkDmUyjOgHJ4QKSyRhQFAcxntZBSUVdS0dAHVgGAALADFvFHlyEj1HZRN5LghLbXsDY2V4hiSSHJ0AbQBdf1k1CHlPOChGQwAbGEtsfCJSCmpaZRgGZlYwAB5cqEiYosTkgD44AF5U-gKoYQUs-kt0A301nU3yHbgARgAafcPlYXlXFFP+ABUIEH4r-XZPm42eYuSp3K+z2+jBv2OpwATJ9wes7g8ngApZRQRAffbfEH7A7w4AnSwAZlhuKO9zcTwAymBgABrR6wrH6SpXdgyaR1BrwEhgVpRADy8icNjsUFKcC6BGIZCoNDoQ0YLDYY3QfPkKDOuzgapQUMs5XQ2oUKEJHi8vjg7Eqlu+GB5fJgguFtmU4q8hhQ7EWK1B-B1wjOp1BB39UKBOOD4P9hKenm88h8GLBX1hLIMWLZQA)

@category Change case
@category Template literal
@category Object
*/
export type KebabCasedPropertiesDeep<
	Value,
	Options extends WordsOptions = {},
> = DelimiterCasedPropertiesDeep<Value, '-', ApplyDefaultOptions<WordsOptions, _DefaultDelimiterCaseOptions, Options>>;

export {};

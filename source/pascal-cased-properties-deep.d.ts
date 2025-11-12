import type {CamelCaseOptions, _DefaultCamelCaseOptions} from './camel-case.d.ts';
import type {ApplyDefaultOptions} from './internal/index.d.ts';
import type {PascalCase} from './pascal-case.d.ts';

/**
Convert object properties to pascal case recursively.

This can be useful when, for example, converting some API types from a different style.

@see {@link PascalCase}
@see {@link PascalCasedProperties}

@example
```
import type {PascalCasedPropertiesDeep} from 'type-fest';

interface User {
	userId: number;
	userName: string;
}

interface UserWithFriends {
	userInfo: User;
	userFriends: User[];
}

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
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gBQIYGcDG2ANgMJ4oAmmUEqswKuAIiimAL5wBmNIcA5ElQBaLoxj8A3AChpwAHYwUULtnxoAqrmUZpASACu2qAEkKALjjyDIAEbKZh4wDlsIFJdwwoCgOYz2WQUlFTVNYwB1YBgACwAxHxR5ClxdJ2UTeS4ISy0HfSNlBIZk3FzjAG0AXQDZfAh5LzgoRgMiGEscAmIybSoaOhgGZlYwAB48qCjY4qSUgD44AF40yczsy3R9PTWLOABGABptydd3S34AFQgQfmO9dnvJ2dLLCu2tvS-dywAme++LjcHgEACllFBEHdto8PtsdsYzJYAMwAhHKM4g-gAZTAwAA1ihoV9YXoqsd2DJpPVGvAwC1jAA3FAkBrafAGIbMjRgOiEbSdPCEUjkfq0ZRDRgsNhjdDZCAAIQAggAlTby5UqhXAABebzlEEVqoV2D1cC8PnkvnYVXYjww9MYymZrMaKA5XJQPL55Es3gMKHYixWnzihs1m22YaNWt1+vh0c1JrN-AtfmJD3J+lhlKAA)

@category Change case
@category Template literal
@category Object
*/
export type PascalCasedPropertiesDeep<Value, Options extends CamelCaseOptions = {}> =
	_PascalCasedPropertiesDeep<Value, ApplyDefaultOptions<CamelCaseOptions, _DefaultCamelCaseOptions, Options>>;

type _PascalCasedPropertiesDeep<Value, Options extends Required<CamelCaseOptions>> = Value extends Function | Date | RegExp
	? Value
	: Value extends Array<infer U>
		? Array<_PascalCasedPropertiesDeep<U, Options>>
		: Value extends Set<infer U>
			? Set<_PascalCasedPropertiesDeep<U, Options>>
			: Value extends object
				? {
					[K in keyof Value as PascalCase<K, Options>]: _PascalCasedPropertiesDeep<Value[K], Options>;
				}
				: Value;

export {};

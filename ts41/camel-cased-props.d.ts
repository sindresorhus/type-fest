import {CamelCase} from './camel-case';

/**
Convert object props to camelCase but not recursively.

This can be useful when, for example, converting some api type from other style.

@see CamelCasedPropsDeep
@see CamelCase
@example
```
interface User {
	UserId: number;
	UserName: string;
}

const result: CamelCasedProps<User> = {
	userId: 1,
	userName: "Tom",
};

```
*/
export type CamelCasedProps<T> = T extends Array<infer U>
	? U[]
	: {
			[K in keyof T as CamelCase<K>]: T[K];
	};

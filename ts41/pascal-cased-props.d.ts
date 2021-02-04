import {PascalCase} from './pascal-case';

/**
Convert object props to PascalCase but not recursively.

This can be useful when, for example, converting some api type from other style.

@see PascalCase
@see PascalCasedPropsDeep
@example
```
interface User {
	userId: number;
	userName: string;
}
const result: PascalCasedProps<User> = {
	UserId: 1,
	UserName: "Tom",
};

```
*/
export type PascalCasedProps<T> = T extends Array<infer U>
	? U[]
	: { [K in keyof T as PascalCase<K>]: T[K] };

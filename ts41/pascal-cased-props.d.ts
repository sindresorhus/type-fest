import {PascalCase} from './pascal-case';

/**
Convert object props to PascalCase but not recursively.

This can be useful when, for example, converting some api type from other style.

@see PascalCase
@see PascalCasedPropertiesDeep
@example
```
interface User {
	userId: number;
	userName: string;
}
const result: PascalCasedProperties<User> = {
	UserId: 1,
	UserName: 'Tom',
};

```
*/
export type PascalCasedProperties<Value> = Value extends Array<infer U>
	? Value
	: { [K in keyof Value as PascalCase<K>]: Value[K] };

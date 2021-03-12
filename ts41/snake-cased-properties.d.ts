import {DelimiterCasedProperties} from './delimiter-cased-properties';

/**
Convert object properties to snake case but not recursively.

This can be useful when, for example, converting some api type from other style.

@see SnakeCase
@see SnakeCasedPropertiesDeep
@example
```
interface User {
	userId: number;
	userName: string;
}

const result: SnakeCasedProperties<User> = {
	user_id: 1,
	user_name: 'Tom',
};
```
*/
export type SnakeCasedProperties<Value> = DelimiterCasedProperties<Value, '_'>;

import {DelimiterCasedProperties} from './delimiter-cased-props';

/**
Convert object props to kebab-case but not recursively.

This can be useful when, for example, converting some api type from other style.

@see KebabCase
@see KebabCasedPropertiesDeep
@example
```
interface User {
	userId: number;
	userName: string;
}
const result: KebabCasedProperties<User> = {
	'user-id': 1,
	'user-name': 'Tom',
};
```
*/
export type KebabCasedProperties<Value> = DelimiterCasedProperties<Value, '-'>;

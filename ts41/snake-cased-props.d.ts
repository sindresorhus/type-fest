import {DelimiterCasedProps} from './delimiter-cased-props';

/**
Convert object props to snake_case but not recursively.

This can be useful when, for example, converting some api type from other style.

@see SnakeCase
@see SnakeCasedPropsDeep
@example
```
interface User {
	userId: number;
	userName: string;
}
const result: SnakeCasedProps<User> = {
	user_id: 1,
	user_name: "Tom",
};

```
*/
export type SnakeCasedProps<T> = DelimiterCasedProps<T, '_'>;

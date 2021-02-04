import {DelimiterCasedProps} from './delimiter-cased-props';

/**
Convert object props to kebab-case but not recursively.

This can be useful when, for example, converting some api type from other style.

@see KebabCase
@see KebabCasedPropsDeep
@example
```
interface User {
	userId: number;
	userName: string;
}
const result: KebabCasedProps<User> = {
	"user-id": 1,
	"user-name": "Tom",
};
```
*/
export type KebabCasedProps<T> = DelimiterCasedProps<T, '-'>;

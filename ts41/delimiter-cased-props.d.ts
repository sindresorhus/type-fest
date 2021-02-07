import {DelimiterCase} from './delimiter-case';

/**
Convert object props to delimiter-case but not recursively.

This can be useful when, for example, converting some api type from other style.

@see DelimiterCase
@see DelimiterCasedPropertiesDeep
@example
```
interface User {
	userId: number;
	userName: string;
}
const result: DelimiterCasedProperties<User, "-"> = {
	"user-id": 1,
	"user-name": "Tom",
};
```
*/
export type DelimiterCasedProperties<T, D extends string> = T extends Array<infer U>
	? U[]
	: { [K in keyof T as DelimiterCase<K, D>]: T[K] };

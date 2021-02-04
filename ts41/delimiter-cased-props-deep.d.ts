import {DelimiterCase} from './delimiter-case';

/**
Convert object props to delimiter-case recursively.

This can be useful when, for example, converting some API types from other style.

@see DelimiterCase
@see DelimiterCasedProps
@example
```
interface User {
    userId: number;
    userName: string;
}

interface UserWithFriends {
    userInfo: User;
    userFriends: User[];
}

const result: DelimiterCasedPropsDeep<UserWithFriends, '-'> = {
    'user-info': {
        'user-id': 1,
        'user-name': "Tom",
    },
    'user-friends': [
        {
            'user-id': 2,
            'user-name': "Jerry",
        },
        {
            'user-id': 3,
            'user-name': "Spike",
        },
    ],
};

```
*/
export type DelimiterCasedPropsDeep<T, D extends string> = T extends Array<infer U> ? Array<DelimiterCasedPropsDeep<U, D>> : {
            [K in keyof T as DelimiterCase<K, D>]: DelimiterCasedPropsDeep<T[K], D>;
      };

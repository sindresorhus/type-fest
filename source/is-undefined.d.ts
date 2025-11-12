/**
Returns a boolean for whether the given type is `undefined`.

@example
```
import type {IsUndefined} from 'type-fest';

type UndefinedFallback<T, Fallback> = IsUndefined<T> extends true ? Fallback : T;

type Example1 = UndefinedFallback<undefined, string>;
//=> string

type Example2 = UndefinedFallback<number, string>;
//=> number
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSQM4FUB2AJigGbD4qEC+cJUEIcA5EqgLQkrYxMDcAUP1ZoCxMhUIAxAIYAbWQCNpAYwDWAHgAqAGjgz5StQD44AXjg5RpcpS0mUADxgoi2BFACuaAPx65ilVU4AC44TQEhZDQAUQdpcFkUAEYzOCtxSn0AtXUPImsJXW4ocgBzIwEAekrTE2KywWE4WPiwRIAmVPSbKX9DDXwPEAUUKCKYEvxyqpqTQeHRoA)

@category Type Guard
@category Utilities
*/
export type IsUndefined<T> = [T] extends [undefined] ? true : false;

export {};

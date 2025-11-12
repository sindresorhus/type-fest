import type {SetReturnType} from './set-return-type.d.ts';

/**
Create an async version of the given function type, by boxing the return type in `Promise` while keeping the same parameter types.

Use-case: You have two functions, one synchronous and one asynchronous that do the same thing. Instead of having to duplicate the type definition, you can use `Asyncify` to reuse the synchronous type.

@example
```
import type {Asyncify} from 'type-fest';

// Synchronous function
type Config = {featureFlags: Record<string, boolean>};

declare function loadConfigSync(path: string): Config;

type LoadConfigAsync = Asyncify<typeof loadConfigSync>;
//=> (path: string) => Promise<Config>
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gQQM6IHYDGwAZogL5zFQQhwDkSqAtMStjHQNwBQ3A9HzgBlfAQAW1PBACu2StMIxgEPN0ZoAwiuLAA5nAC8GVgEMY0qCgBiAGxO7sALjgAlFAWgATADzsowPF0AGjgAIwgIGxQTPAA+Mh5uT3c7S3lFZTw4GwgTTy08HV0RQgAKMDMxZz8A3QBKZwKixPU4ABlc-O09HFFDOF7CEkRvdQhibM6mvRKCWJ4BA1i4csrqmH9AusNlgAVqEGBsFG9p3VigA)

@category Async
*/
export type Asyncify<Function_ extends (...arguments_: any[]) => any> = SetReturnType<Function_, Promise<Awaited<ReturnType<Function_>>>>;

export {};

import type {IsAny} from './is-any.d.ts';

/**
Returns a boolean for whether the given type includes `undefined`.

@example
```ts
import type {IsOptional} from 'type-fest';

type A = IsOptional<string>;
//=> false

type B = IsOptional<string | undefined>;
//=> true

type C = IsOptional<string | null>;
//=> false

type D = IsOptional<string | null | undefined>;
//=> true
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSQM4HkwzAQB2AhgDYC+cAZlBCHAORKoC0NK2MTA3AFD9WaAIJwAvHBz5CJCgB5uUYMQDmAPgEB6LePW0K2FIOFwAQhKl4CRMuUUxlauAB84AV2IATFDRUovTX4dPQQod2MhZDQAYUtpGzl7JRVVVzhid3JyIJD9GkNI0wAReOtZOwcnNLdM7PTPHz9iANzdfUcIoA)

@category Type Guard
@category Utilities
*/
export type IsOptional<T> = IsAny<T> extends true ? true : Extract<T, undefined> extends never ? false : true;

export {};

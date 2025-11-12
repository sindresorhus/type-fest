type AsyncFunction = (...arguments_: any[]) => PromiseLike<unknown>;

/**
Unwrap the return type of a function that returns a `Promise`.

There has been [discussion](https://github.com/microsoft/TypeScript/pull/35998) about implementing this type in TypeScript.

@example
```ts
import type {AsyncReturnType} from 'type-fest';

declare function asyncFunction(): Promise<{foo: string}>;

// This type resolves to the unwrapped return type of `asyncFunction`.
type Value = AsyncReturnType<typeof asyncFunction>;
//=> {foo: string}

declare function doSomething(value: Value): void;

asyncFunction().then(value => doSomething(value));
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gQQM6IHYDGASijAK5R4AqyKAvnAGZQQhwDkSqAtIytjHYBuAFAiAJigIAbAIZQ0jMoRjAIeOLNyEAYsoKr1ACgCUALjgAFFiGDYUAHnSMIECwKjA8AczoA+UREAeiC4KgALOwRaOAVsCGkAN34ECARwtGUAdyhZMFRxWNIKDS40CEY4AAMtfAI9FTU8KoA6ETK4ADVZaTI0AF44HDqSckoaVAcyis1tev1DPADgoP6-DBc3OA8vXzFJGXlFBaa4cQgAZVZSSJ8jRJ6+i27elHM4RIhgcUDa3RPjCYWjAMnh7o8ButzlcQDdduDXiYTEIgA)

@category Async
*/
export type AsyncReturnType<Target extends AsyncFunction> = Awaited<ReturnType<Target>>;

export {};

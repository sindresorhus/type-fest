import {PromiseValue} from './promise-value';
import {SetReturnType} from './set-return-type';

/**
Create an async version of the given function type.

@example
```
import {Asyncify} from 'type-fest';

// Synchronous function.
function getFooSync(someArg: SomeType): Foo {
	// …
}

type AsyncifiedFooGetter = Asyncify<typeof getFooSync>;
//=> type AsyncifiedFooGetter = (someArg: SomeType) => Promise<Foo>;

// Same as `getFooSync` but asynchronous.
const getFooAsync: AsyncifiedFooGetter = (someArg) => {
	// TypeScript now knows that `someArg` is `SomeType` automatically.
	// It also knows that this function must return `Promise<Foo>`.
	// If you have `@typescript-eslint/promise-function-async` linter rule enabled, it will even report that "Functions that return promises must be async."

	// ...
}
```
*/
export type Asyncify<Fn extends (...args: any[]) => unknown> = SetReturnType<Fn, Promise<PromiseValue<ReturnType<Fn>>>>;

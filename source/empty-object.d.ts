declare const emptyObjectSymbol: unique symbol;

/**
Represents a strictly empty plain object, the `{}` value.

When you annotate something as the type `{}`, it can be anything except `null` and `undefined`. This means that you cannot use `{}` to represent an empty plain object ([read more](https://stackoverflow.com/questions/47339869/typescript-empty-object-and-any-difference/52193484#52193484)).

@example
```
import type {EmptyObject} from 'type-fest';

// The following illustrates the problem with `{}`.
const foo1: {} = {}; // Pass
const foo2: {} = []; // Pass
const foo3: {} = 42; // Pass
const foo4: {} = {a: 1}; // Pass

// With `EmptyObject` only the first case is valid.
const bar1: EmptyObject = {}; // Pass
// @ts-expect-error
const bar2: EmptyObject = []; // Fail
// @ts-expect-error
const bar3: EmptyObject = 42; // Fail
// @ts-expect-error
const bar4: EmptyObject = {a: 1}; // Fail
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gUXEg8gIwCsUBjGAXzgDMoIQ4ByJVAWipQGcYGBuAKD4B6QXAAqACzRUIAGxkQA7sAB2AczjA5AVy5QAhjE4JJcMLXwyU9JTHFwABunL2AdHxIRlXahAgBGAC4MSgBeYJ44YTgABT0ODndPb2kIACYgpzgwgG0AXQio2PjEr3gUgGYM0LgAFlSCkSKEj1KfCBqqrIw9IL9yBpi4hKERAHVgWwdsMDwiUhh7OE8ZRGMpYChvEji0YA44ADc9GWAAEzcW73w9KEC4adniMi6nAaaRuAABGA4WFAAPVBkP5QWhQEpXG7pe44RAEJ7wHL5SIiABiek0H2+vwBQJgILBEPg1yglRhMzhc2eYTqA3RmKi2L+gPmBOgRLgJI65Me8xePTgfTpGJkQA)

Unfortunately, `Record<string, never>`, `Record<keyof any, never>` and `Record<never, never>` do not work. See {@link https://github.com/sindresorhus/type-fest/issues/395 #395}.

@category Object
*/
export type EmptyObject = {[emptyObjectSymbol]?: never};

/**
Returns a `boolean` for whether the type is strictly equal to an empty plain object, the `{}` value.

@example
```
import type {IsEmptyObject} from 'type-fest';

type Pass = IsEmptyObject<{}>; //=> true
type Fail1 = IsEmptyObject<[]>; //=> false
type Fail2 = IsEmptyObject<null>; //=> false
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSQM4FFxIDyARgFYoDGMAvnAGZQQhwDkSqAtHStjCwNwAoQezQAFAIbZscALxwc+METKUYAHnTUAfPzgB6fbO0IoAVxQjkaAGITgAGwCMchXgKIS5KuoDaAXV0DIxM6CQdsS1E4O0cAJldFDy81dQA7MwcHIMNjenDIoA)

@see {@link EmptyObject}
@category Object
*/
export type IsEmptyObject<T> = T extends EmptyObject ? true : false;

export {};

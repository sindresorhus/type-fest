/**
Get the element type of an `Iterable`/`AsyncIterable`. For example, `Array`, `Set`, `Map`, generator, stream, etc.

This can be useful, for example, if you want to get the type that is yielded in a generator function. Often the return type of those functions are not specified.

This type works with both `Iterable`s and `AsyncIterable`s, so it can be use with synchronous and asynchronous generators.

Here is an example of `IterableElement` in action with a generator function:

@example
```
import type {IterableElement} from 'type-fest';

function * iAmGenerator() {
	yield 1;
	yield 2;
}

type MeNumber = IterableElement<ReturnType<typeof iAmGenerator>>
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSRiqBDAIwBsUBREkFAOxgF84AzKCEOAciVQFoGUBnGGwDcAKBEMArlQDGMYBCpwAVHGABBEAHFquPDGgAKAJQYRASETAURACZwAjKItXbcAEyjaYzmgCyKADkJEAJcOABeOGxdYjIKahgAHgAlFBgJKCoAFWQURJ8IBlUNbSpdfSgAPkqgA)

And here is an example with an async generator:

@example
```
import type {IterableElement} from 'type-fest';

async function * iAmGeneratorAsync() {
	yield 'hi';
	yield true;
}

type MeStringOrBoolean = IterableElement<ReturnType<typeof iAmGeneratorAsync>>
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSRiqBDAIwBsUBREkFAOxgF84AzKCEOAciVQFoGUBnGGwDcAKBF4+iKgGNGAVxkxgEKnABUcYAEEQAcWq48MaFskyAFAEoMIgJCJgKIgBN2AC2DC7Dp65hQ5FFFaMU40AFkUAGV-YCoAcwB5KAAhCAgSPFUAXjhsQ2IyCmoYAB4AJRQYOSgqABVkFFKwiAZNHX0qQ2MoUylpAD4BoA)

Many types in JavaScript/TypeScript are iterables. This type works on all types that implement those interfaces.

An example with an array of strings:

@example
```
import type {IterableElement} from 'type-fest';

type MeString = IterableElement<string[]>
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSRiqBDAIwBsUBREkFAOxgF84AzKCEOAciVQFoGUBnGGwDcAKBGc0AWRQBlGFGBUA5nAC8cbLkIlyKSjQA8AhcoDaAXQB8QA)

@example
```
import type {IterableElement} from 'type-fest';

const fruits = new Set(['🍎', '🍌', '🍉'] as const);

type Fruit = IterableElement<typeof fruits>;
//=> '🍎' | '🍌' | '🍉'
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSRiqBDAIwBsUBREkFAOxgF84AzKCEOAciVQFoGUBnGGwDcAKBEBjCFQGMoAV2Aw+cALxwqKAO5wAyihgAKANptAPBuA5fbYAadqcAy+9duBJfbYBdOHmWTpMAJSiRTjQAMXlFVThsXEISchRKGgAeIIgGWQUlAD5RAHoclUzbSzgAH1sHUuc2IA)

@category Iterable
*/
export type IterableElement<TargetIterable> =
	TargetIterable extends Iterable<infer ElementType> ?
		ElementType :
		TargetIterable extends AsyncIterable<infer ElementType> ?
			ElementType :
			never;

export {};

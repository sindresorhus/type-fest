/**
Get the element type of an Iterable or AsyncIterable.

This can be useful if you want to know get the type that is yielded in a generator function. Often
the return type of those functions is not specified. `IterableElement` works with both `Iterable`s
and `AsyncIterable`s so it can be use with synchronous and asynchronous generators.

Here is an example of `IterableElement` in action with a generator function:
@example
```
function * iAmGenerator() {
	yield 1;
	yield 2;
}
type MeNumber = IterableElement<ReturnType<typeof iAmGenerator>>
```

And here is an example with an async generator:
@example
```
async function * iAmGeneratorAsync() {
	yield 'hi';
	yield true;
}
type MeStringOrBoolean = IterableElement<ReturnType<typeof iAmGeneratorAsync>>
```

Many things in JavaScript and TypeScript are an `Iterable` or an `AsyncIterable`. `IterableElement` works
on all types that implement those interfaces! So `IterableElement` can also be used for a `Set`, a `Map`,
a `ReadableStream` or an `Array`.

An example with a `string` array.
@example
```
type MeString = IterableElement<string[]>
```
*/
export type IterableElement<TargetIterable> =
	TargetIterable extends Iterable<infer ElementType> ?
	ElementType :
	TargetIterable extends AsyncIterable<infer ElementType> ?
	ElementType :
	never;

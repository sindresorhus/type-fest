/**
Get the element type of an Iterable or AsyncIterable.

Quite usefull if combined with generators:
@example
```
function * iAmGenerator() {
	yield 1;
	yield 2;
}
type MeNumber = IterableElement<ReturnType<typeof iAmGenerator>>
```

Or, async iterators!
@example
```
async function * iAmGeneratorAsync() {
	yield "hi";
	yield true;
}
type MeStringOrBoolean = IterableElement<ReturnType<typeof iAmGeneratorAsync>>
```

An `Array` is also an `Iterable`, so we can do this:
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

/**
Either matches an array containing only `Value`, or `Value` itself, not in an array.

This can prove to be useful when you're not sure if you're going to get a type as an array, or on it's own.

@example
```
import {OneOrMore} from 'type-fest';

type ID = number;
type OneOrMoreIDs = OneOrMore<ID>;

function runOnIDs (ids: OneOrMoreIDs) {
	if (Array.isArray(ids)) {
		ids.forEach(id => console.log(id));
	} else {
		console.log(ids);
	}
}
```
*/
export type OneOrMore<Value> = Value | readonly Value[];

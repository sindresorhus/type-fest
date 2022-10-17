import type {JsonPrimitive, JsonValue} from './basic';

type JsonifiablePrimitive = JsonPrimitive | {toJSON: () => JsonValue};
type JsonifiableObject = {[Key in string]: Jsonifiable};
type JsonifiableArray = Jsonifiable[];

/**
Matches a value that can be losslessly converted to JSON.

@example
```
import type {Jsonifiable} from 'type-fest';

// Neither a map nor undefined can be serialized by JSON.stringify so
// it will be lost.
const error: Jsonifiable = {
    map: new Map(),
    missing: undefined,
};

// Numbers can be directly serialized and Date objects have a toJSON()
// function.
const good: Jsonifiable = {
    number: 3,
    date: new Date(),
}
```

@category JSON
*/
export type Jsonifiable = JsonifiablePrimitive | JsonifiableObject | JsonifiableArray;

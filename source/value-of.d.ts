/**
Create a union of the object's values, and optionally specify which keys to get the values from.

@example
```
// data.json
{
	"foo": 1,
	"bar": 2
}

// main.ts
import {ValueOf} from 'type-fest';
import data = require('./data.json');

export default (name: string): ValueOf<typeof data> => {
	return data[name]
}
```
*/
export type ValueOf<ObjectType, ValueType extends keyof ObjectType = keyof ObjectType> = ObjectType[ValueType];

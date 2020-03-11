/**
Create a union of the object's values, and optionally specify which keys to get the values from.

@example
```
// data.json
{
	"foo": 1,
	"bar": 2,
	"biz": 3
}

// main.ts
import {ValueOf} from 'type-fest';
import data = require('./data.json');

export function getData(name: string): ValueOf<typeof data> {
	return data[name]
}

export function onlyBar(name: string): ValueOf<typeof data, 2> {
	return data[name]
}

// file.ts
import {getData, onlyBar} from "./main"

getData("foo")
//=> 1

onlyBar("foo")
//=> TypeError ...

onlyBar("bar")
//=> 2
```
*/
export type ValueOf<ObjectType, ValueType extends keyof ObjectType = keyof ObjectType> = ObjectType[ValueType];

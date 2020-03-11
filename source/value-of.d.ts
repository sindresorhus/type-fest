/**
Create a union of the object's values, and optionally specify which keys to get the values from.

@example
```
import {ValueOf} from 'type-fest';

const value: ValueOf<{a: 1; b: 2; c: 3}> = 3;

expectType<1 | 2 | 3>(value);
```
*/
export type ValueOf<ObjectType, ValueType extends keyof ObjectType = keyof ObjectType> = ObjectType[ValueType];

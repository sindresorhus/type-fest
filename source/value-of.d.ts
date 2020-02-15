/**
Creates a union of all the values of the object's keys. Optionally, a key can be supplied, which limits the keys to get the values for.

@example
```
import {ValueOf} from 'type-fest';

const value: ValueOf<{ a: 1; b: 2; c: 3 }> = 3;

expectType<1 | 2 | 3>(value);
```
*/
export type ValueOf<ObjectType, ValueType extends keyof ObjectType = keyof ObjectType> = ObjectType[ValueType];

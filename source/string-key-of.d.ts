/**
Get string keys from type.

Use-cases:
- Get string keys from a type which may have number keys.
- Making it possible to index using strings retrieved from template types.

@example
```
import {StringKeyOf} from 'type-fest';

type Foo = {
	1: number,
	stringKey: string,
};

type StringKeysOfFoo = StringKeyOf<Foo>;
//=> '1' | 'stringKey'
```

@category Object
*/
export type StringKeyOf<BaseType> = `${Extract<keyof BaseType, string | number>}`;

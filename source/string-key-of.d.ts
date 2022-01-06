/**
Get string keys from type.

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

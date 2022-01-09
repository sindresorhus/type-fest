/**
Get the string keys of the given type.

Number keys are converted to strings, because object property key is coerced to a string.

Use-cases:
- Get string keys from a type which may have number keys.
- Makes it possible to index using strings retrieved from template types.

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

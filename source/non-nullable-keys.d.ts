/**
Extract the keys from a type where the value type of the key include `null`.

Internally this is used for the `NullableToOptional` type.

@example
```
import {NullableKeys} from 'type-fest';

interface Example {
	a: string;
	b: string | number;
	c: string | null;
	d: {} | null;
}

type NullableKeys = ConditionalKeys<Example>;
//=> 'c' | 'd'
```

@category Object
*/
export type NonNullableKeys<Base> = {
	// Pick all keys where the value type of the key include `null`
	[K in keyof Base]: null extends Base[K] ? never : K
}[keyof Base];

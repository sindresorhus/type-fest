/**
Extract the keys from a type where the value type of the key do not include `null`.

@example
```
import {NonNullableKeys} from 'type-fest';

interface Example {
	a: string;
	b: string | number;
	c: string | null;
	d: {} | null;
	e?: number;
}

type Keys = NonNullableKeys<Example>;
//=> 'a' | 'b'
```

@category Object
*/
export type NonNullableKeys<Base> = NonNullable<
	{
		// Pick all keys where the value type of the key include `null`
		[K in keyof Base]: null extends Base[K]
			? never
			// Pick all (optional) keys where the value type of the key include `undefined`
			: (undefined extends Base[K] ? never : K)
	}[keyof Base]
>;

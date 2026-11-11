import type {IsAny} from './is-any.d.ts';
import type {UnwrapBrandedPrimitive} from './unwrap-branded-primitive.d.ts';

/**
Convert a primitive type to its string representation.

Useful for typing URL parameters or converting numeric property keys to strings.

Supports strings, numbers, bigints, booleans, `null`, and `undefined`. Distributes over unions and removes brands using {@link UnwrapBrandedPrimitive}, with the same limitations. Unsupported members, including symbols and objects, produce `never`. `any` produces `string`; `never` and `unknown` produce `never`.

Uses TypeScript's template literal rules: non-literal `number` and `bigint` produce `${number}` and `${bigint}` patterns. This type is not the return type of `String()` or the `.toString()` function.

@example
```
import type {ToString} from 'type-fest';

type Page = ToString<1 | 2>;
//=> '1' | '2'

type Preview = ToString<boolean>;
//=> 'true' | 'false'

type Cursor = ToString<42n | undefined>;
//=> '42' | 'undefined'

type StringKeys = ToString<keyof {name: string; 0: boolean}>;
//=> 'name' | '0'
```

@category String
@category Template literal
*/
export type ToString<Value> = IsAny<Value> extends true
	? string
	: ToStringHelper<Value extends object ? UnwrapBrandedPrimitive<Value> : Value>;

type ToStringHelper<Value> = Value extends string | number | bigint | boolean | null | undefined ? `${Value}` : never;

export {};

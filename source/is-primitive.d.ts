import type {IsAny} from './is-any.d.ts';
import type {Primitive} from './primitive.d.ts';

/**
Returns a boolean for whether the given type is a primitive.

Useful for selecting primitive properties or stopping recursive type transformations at primitive values. Includes all types in {@link Primitive}, including `null` and `undefined`, but excludes `void` and boxed primitives like `String`.

Checks unions as a whole: Every member must be primitive. Returns `false` for `any`, `never`, and `unknown`.

@example
```
import type {IsPrimitive} from 'type-fest';

type Literal = IsPrimitive<'hello'>;
//=> true

type PrimitiveUnion = IsPrimitive<string | number | null>;
//=> true

type MixedUnion = IsPrimitive<string | {name: string}>;
//=> false
```

@example
```
import type {IsPrimitive} from 'type-fest';

type PrimitiveProperties<Value> = {
	[Key in keyof Value as IsPrimitive<Value[Key]> extends true ? Key : never]: Value[Key];
};

type UserSummary = PrimitiveProperties<{
	id: number;
	name?: string;
	settings: {theme: string};
}>;
//=> {id: number; name?: string}
```

@category Type Guard
@category Utilities
*/
export type IsPrimitive<Value> = IsAny<Value> extends true ? false : [Value] extends [never] ? false : [Value] extends [Primitive] ? true : false;

export {};

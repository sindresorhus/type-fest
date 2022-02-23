import {NonNullableKeys} from './non-nullable-keys';
import {Simplify} from './simplify';
import {UnionToIntersection} from './union-to-intersection';

/**
Make the keys of a type where the value type of the key include `null` optional.

@example
```
import {NullableToOptional} from 'type-fest';

interface Example {
  a: string;
  b: number | null;
  c: null;
}

type NullIsOptional = NullableToOptional<Example>;
//=> { a: string, b?: number | null, c?: null }
```

@category Object
*/
export type NullableToOptional<Base> = Simplify<
  // Simplify to display as a single type instead of the union
  UnionToIntersection<
    // Wrap in `UnionToIntersection` to create singular type
    | Pick<
        // Keep all non-nullable key-value pairs as is
        Base,
        NonNullableKeys<Base>
      >
    | Partial<
        // Make all nullable key-value pairs optional
        Omit<Base, NonNullableKeys<Base>>
      >
  >
>;

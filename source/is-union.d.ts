import type {UnionToIntersection} from './union-to-intersection';

/**
Detects whether a given type is a union of types.

While you can default to returning a boolean based on the condition, the resulting typing will be simpler if you instead specify the `True` and `False` type parameters.

Note that `boolean` and `enum` types are unions.

Use-cases:
- You want to ensure a given type is not a union but a singular type.

@example
```
import type {IsUnion} from 'type-fest';

// If `MaybeSingle` is a union type, resolves to `never`, otherwise MaybeSingle.
type EnsureSingleType<MaybeSingle> = IsUnion<MaybeSingle, never, MaybeSingle>;
```

@category Utilities
*/
export type IsUnion<MaybeUnion, True = true, False = false> =
  [MaybeUnion] extends [UnionToIntersection<MaybeUnion>] ? False : True;

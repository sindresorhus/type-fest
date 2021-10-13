/**
Constructs a type by excluding from Type all union members that are assignable to ExcludedUnion.

This type is a stricter version of [`Exclude`](https://www.typescriptlang.org/docs/handbook/utility-types.html#excludetype-excludedunion). The `Exclude` type does not restrict the omitted keys to be keys present on the given type, while `ExcludeStrict` does. The benefits of a stricter type are avoiding typos and allowing the compiler to pick up on rename refactors automatically.

@example
```
import {ExcludeStrict} from 'type-fest';

type ShirtSizes = 'xxxl' | 'xxl' | 'xl' | 'l' | 'm' | 's' | 'xs' | 'xxs';

type OnlyLargeShirts = ExcludeStrict<ShirtSizes, 'm' | 's' | 'xs' | 'xxs'>;
//=> 'xxxl' | 'xxl' | 'xl' | 'l';
```

@category Utilities
*/
export type ExcludeStrict<Type, ExcludedUnion extends Type> = Exclude<Type, ExcludedUnion>;

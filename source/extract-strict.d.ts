/**
Constructs a type by extracting from Type all union members that are assignable to Union.

This type is a stricter version of [`Extract`](https://www.typescriptlang.org/docs/handbook/utility-types.html#extracttype-union). The `Extract` type does not restrict the omitted keys to be keys present on the given type, while `ExtractStrict` does. The benefits of a stricter type are avoiding typos and allowing the compiler to pick up on rename refactors automatically.

This type has been proposed to the TypeScript team ([microsoft/TypeScript#31474](https://github.com/microsoft/TypeScript/issues/31474)).

@example
```
type ShirtSizes = 'xxxl' | 'xxl' | 'xl' | 'l' | 'm' | 's' | 'xs' | 'xxs';

type NoLargeShirts = ExtractStrict<ShirtSizes, 'm' | 's' | 'xs' | 'xxs'>;
expectType<'m' | 's' | 'xs' | 'xxs' >('m' as NoLargeShirts);
//=> 'm' | 's' | 'xs' | 'xxs';
```

@category Utilities
*/
export type ExtractStrict<Type, Union extends Type> = Extract<Type, Union>;

/**
Create a type that requires the defined properties. The remaining properties are kept as is. The sister of `SetOptional` type.

Use-case: You want to define a single model where the only thing that changes is whether or not some of the properties are required.

@example
```
import {SetRequired} from 'type-fest';

type Foo = {
  a?: number;
  b: string;
  c?: boolean;
}

type SomeRequired = SetRequired<Foo, 'b' | 'c'>;
//  type SomeRequired = {
//    a?: number;
//    b: string; // was already required, still is
//    c: boolean; // is now required
//  }
```
*/

export type SetRequired<BaseType, Keys extends keyof BaseType = keyof BaseType> =

// Pick from the base type just the keys that are not required
Pick<
  BaseType,
  Exclude<keyof BaseType, Keys>
>

// Intersect that type with:
&

// Pick from the base type the keys that should be required and make them required
Required<
  Pick<
    BaseType,
    Keys
  >
> extends

// If InferredType extends the previous then for each property use the inferred type property
infer InferredType
  ? { [Property in keyof InferredType]: InferredType[Property] }
  : never;

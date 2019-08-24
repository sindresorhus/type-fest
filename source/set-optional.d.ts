/**
Define one or more keys for a new type created from the original type that should now be optional. The sister of `SetRequired` type.

Use-case: You want to define a single model where the only thing that changes is whether or not some of the properties are optional.

@example
```
import {SetOptional} from 'type-fest';

type Foo = {
  a: number;
  b?: string;
  c: boolean;
}

type SomeOptional = SetOptional<Foo, 'b' | 'c'>;
//  type SomeOptional = {
//    a: number;
//    b?: string; // was already optional, still is
//    c?: boolean; // is now optional
//  }
```
*/

export type SetOptional<BaseType, Keys extends keyof BaseType = keyof BaseType> =

// Pick from the base type just the keys that are not optional
Pick<
  BaseType,
  Exclude<keyof BaseType, Keys>
>

// Intersect that type with
&

// Pick from the base type the keys that should be optional and make them optional
Partial<
  Pick<
    BaseType,
    Keys
  >
> extends

// If InferredType extends the previous then for each property use the inferred type property
infer InferredType
    ? { [Property in keyof InferredType]: InferredType[Property] }
    : never;

/**
The sister of `Optionalize` type. Allows you to define one or more keys for a type that should be required.

Use-case: You want to define a single model where the only thing that changes is
whether or not some of the properties are required

@example
```
import {Require} from 'type-fest';

type Foo = {
  a?: number;
  b: string;
  c?: boolean;
}

type SomeRequired = Require<Foo, 'b' | 'c'>;
// type SomeRequired = {
//   a?: number;
//   b: string; // was already required, still is
//   c: boolean; // is now required
// }
```
*/

export type Require<BaseType, Keys extends keyof BaseType = keyof BaseType> =
Pick<BaseType, Exclude<keyof BaseType, Keys>> &
Required<Pick<BaseType, Keys>> extends infer InferredType
  ? { [Property in keyof InferredType]: InferredType[Property] }
  : never;

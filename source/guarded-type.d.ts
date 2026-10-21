/**
Extract the type that a type predicate function narrows its parameter to.

Use-cases:
- Get the narrowed type from a type guard, without writing the type twice.
- Get the type of a guard from a library that does not export the type.
- Create a union of the types that a collection of guards accepts.

@example
```
import type {GuardedType} from 'type-fest';

const isNotNullish = (value: string | null | undefined) => value !== null && value !== undefined;

type NotNullish = GuardedType<typeof isNotNullish>;
//=> string
```

@example
```
import type {GuardedType} from 'type-fest';

const isPrimitive = (value: unknown) => typeof value === 'string' || typeof value === 'number';

type Primitive = GuardedType<typeof isPrimitive>;
//=> string | number
```

@example
```
import type {GuardedType} from 'type-fest';

const isString = (value: unknown) => typeof value === 'string';
const isNumber = (value: unknown) => typeof value === 'number';

const guards = [isString, isNumber] as const;

type Accepted = GuardedType<(typeof guards)[number]>;
//=> string | number
```

Returns `never` when the type is not a function, or when the function has no `value is` type predicate on its first parameter.

A union of function types is distributed, so the result is the union of the narrowed types. A member that is not a type predicate adds `never`, so it drops out.

Note: TypeScript infers a type predicate only from certain guard expressions, like `typeof value === 'string'`, `value instanceof Date`, `value != null`, `'key' in value`, `Array.isArray(value)`, or a check that removes a union member, like `value.kind === 'circle'`. It does not infer one from a nested property check, like `typeof value.name === 'string'`, or from a `boolean` return type. Declare `value is YourType` in that case.

Note: A type parameter in the predicate is replaced with its constraint, or with `unknown` when it has no constraint. So `value is Value & string` becomes `string`.

Note: Assertion functions, like `(value: unknown) => asserts value is string`, and `this` predicates, like `check(): this is Foo`, return `never`. TypeScript reports the return type of an assertion signature as `void`, so it cannot be told apart from any other `void`-returning function. A `this` predicate does not narrow a parameter.

Note: The narrowed type of an overloaded function is inferred from the last signature, due to a [TypeScript limitation](https://github.com/microsoft/TypeScript/issues/29732). When an earlier signature has the type predicate and the last one does not, the result is `unknown`.

@category Function
*/
// `any` instead of `unknown` because a guard with a narrower parameter is not assignable to `(value: unknown) => ...` under `strictFunctionTypes`.
// The rest parameter is needed because a guard that takes more parameters, like `(value: unknown, key: string) => ...`, is not assignable to a signature that takes only one.
export type GuardedType<FunctionType> = FunctionType extends (value: any, ...arguments_: any[]) => value is infer Guarded ? Guarded : never;

export {};

import type {Simplify} from './simplify.d.ts'; // For `@link`

/**
Flattens a union type to improve type hints shown in editors, by showing the members instead of the type alias names.

When union aliases are combined into one union, TypeScript shows the alias names instead of the underlying members. Hovering over `Unflattened` below shows `U1 | U2`, which tells you nothing about the members.

@example
```
import type {SimplifyUnion} from 'type-fest';

type U1 = 5 | ['b'] | symbol;
type U2 = null | '2' | {foo: 'bar'};

type Unflattened = U1 | U2;
//=> U1 | U2

type Flattened = SimplifyUnion<Unflattened>;
//=> '2' | 5 | ['b'] | null | symbol | {foo: 'bar'}
```

The union members are kept as they are. The exceptions are an enum input, which is decomposed into a union of its members, and a template literal type intersected with `{}`, which loses the `{}`. Values stay assignable in both directions. Unlike {@link Simplify}, which flattens object types into new object types, `SimplifyUnion` leaves object types untouched.

A member that is not a union itself, like `type U1 = {a: 1}`, is still shown by its alias name. Use {@link Simplify} to flatten object members too.

@example
```
import type {Simplify, SimplifyUnion} from 'type-fest';

type U1 = {a: 1};
type U2 = {b: 2};

type Flattened = Simplify<SimplifyUnion<U1 | U2>>;
//=> {a: 1} | {b: 2}
```

Do not use it on an unresolved generic type. `SimplifyUnion<Type>` and `Type` are not assignable to each other in a generic position, because the flattening only happens once `Type` is a concrete type.

@category Union
*/
export type SimplifyUnion<Union> = {[Member in Union as string]: Member}[string];

// The rename to `string` forces TypeScript to instantiate each member of `Union` as the value of a single-key object, which strips the alias references. Indexing the object with that key gives back a fresh union of the members, which is what the hints then show. An unresolved `Union` stays deferred, which is why it is not assignable to `Union` in a generic position.

export {};

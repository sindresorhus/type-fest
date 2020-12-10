import {UnionToIntersection} from './union-to-intersection';

/**
Convert an explicit union type to an tuple.

The elements order of the tuple and of the union will be the same. Because of that, you should not use this if the union is computed instead of manually declared, because the TypeScript compiler does not guarantee that the order of the union elements will always be the same.

Inspired by [this issue in the TypeScript repo](https://github.com/microsoft/TypeScript/issues/13298).

Use-case: You need to do validation but you don't have an enum, only an union type. Similar to the [`Extract` example in the readme](https://typescript-play.js.org/?target=6#code/CYUwxgNghgTiAEAzArgOzAFwJYHtXzSwEdkQBJYACgEoAueVZAWwCMQYBuAKDDwGcM8MgBF4AXngBlAJ6scESgHIRi6ty5ZUGdoihgEABXZ888AN5d48ANoiAuvUat23K6ihMQ9ATE0BzV3goPy8GZjZOLgBfLi4Aejj4AEEICBwAdz54MAALKFQQ+BxEeAAHY1NgKAwoIKy0grr4DByEUpgccpgMaXgAaxBerCzi+B9-ZulygDouFHRsU1z8kKMYE1RhaqgAHkt4AHkWACt4EAAPbVRgLLWNgBp9gGlBs8uQa6yAUUuYPQwdgNpKM7nh7mMML4CgA+R5WABqUAgpDeVxuhxO1he0jsXGh8EoOBO9COx3BQPo2PBADckaR6IjkSA6PBqTgsMBzPsicdrEC7OJWXSQNwYvFEgAVTS9JLXODpeDpKBZFg4GCoWa8VACIJykAKiQWKy2YQOAioYikCg0OEMDyhRSy4DyxS24KhAAMjyi6gS8AAwjh5OD0iBFHAkJoEOksC1mnkMJq8gUQKDNttKPlnfrwYp3J5XfBHXqoKpfYkAOI4ansTxaeDADmoRSCCBYAbxhC6TDx6rwYHIRX5bScjA4bLJwoDmDwDkfbA9JMrVMVdM1TN69LgkTgwgkchUahqIA), but in that case the `changePersonData` function does not validate the `key` parameter at runtime, making it only safe inside TypeScript. Using a tuple and `includes` for validation gives us runtime safety for that kind of function.

@example
```
type Union = 'A' | 'B';

const tuple: UnionToTuple<Union> = ['A', 'B'];
```

@example
```
// This type may come from a library that you are using
type ActionsInSomeLibrary = 'create' | 'read' | 'update' | 'delete' | 'aggregate';

type AllowedActions = Exclude<ActionsInSomeLibrary, 'aggregate'>;

const actions: UnionToTuple<AllowedActions> = ['create', 'read', 'update', 'delete'];

actions.includes(requestedAction) // Validate
```
*/
export type UnionToTuple<Union> =
    UnionToIntersection<
        // Distributive conditional trick.
        // See the source for the `UnionToIntersection` type for more details.
        Union extends unknown
        ? (distributed: Union) => void
        : never
    > extends ((merged: infer Intersection) => void)
        // Transforms ('A' | 'B') into [[[], "A"], "B"], but destructures the arrays
        ? readonly [...UnionToTuple<Exclude<Union, Intersection>>, Intersection]
        : [];

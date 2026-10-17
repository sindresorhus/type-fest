import type {IsLiteral} from './is-literal.d.ts';
import type {TupleToEnum} from './tuple-to-enum.d.ts'; // For `@link`

/**
Create an enum-like object type from a union of property keys, where each key maps to itself.

Members that are not literals, like `string` or `` `on${string}` ``, are ignored.

Use-case: Type an object that maps each value of a union to itself, like `{create: 'create', delete: 'delete'}`, when it is built from the union's values at runtime.

@example
```
import type {UnionToEnum} from 'type-fest';

type Action = 'create' | 'delete';

type ActionEnum = UnionToEnum<Action>;
//=> {readonly create: 'create'; readonly delete: 'delete'}
```

@example
```
import type {UnionToEnum} from 'type-fest';

function createEnum<const Values extends readonly string[]>(values: Values) {
	return Object.fromEntries(values.map(value => [value, value])) as UnionToEnum<Values[number]>;
}

const Direction = createEnum(['up', 'down']);
//=> {readonly up: 'up'; readonly down: 'down'}
```

@see {@link TupleToEnum} for numeric values.
@category Object
*/
// There is intentionally no `numeric` option, unlike `TupleToEnum`. Numeric values would have to follow union order, which depends on TypeScript internals and can change with unrelated code or a TypeScript upgrade. They could also never match a runtime object, since runtime code assigns numbers by iterating an array, which has its own order.
export type UnionToEnum<Union extends PropertyKey> = {
	readonly [Key in Union as IsLiteral<Key> extends true ? Key : never]: Key;
};

export {};

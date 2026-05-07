import type {ConditionalKeys} from './conditional-keys.d.ts';

/**
Groups items by the value of a specified key.

This type creates an object where each key is a possible value of the specified property `GroupingKey`, and the corresponding value is the union of all items from the input type `Union` that have that value for property `GroupingKey`.

Use-cases:
- Grouping unions of objects by a discriminant property, such as categorizing different types of items by their type or color.
- Creating type-safe grouped data structures from discriminated unions.

@example
```
import type {GroupBy} from 'type-fest';

type Apple = {
	color: 'green';
	kind: 'fruit';
};

type Banana = {
	color: 'yellow';
	kind: 'fruit';
};

type Tomato = {
	color: 'red';
	kind: 'vegetable';
};

type GroupedByColor = GroupBy<Apple | Banana | Tomato, 'color'>;
// {
//   green: Apple;
//   yellow: Banana;
//   red: Tomato;
// }

type GroupedByKind = GroupBy<Apple | Banana | Tomato, 'kind'>;
// {
//   fruit: Apple | Banana;
//   vegetable: Tomato;
// }
```

@category Object
@category Union
*/
export type GroupBy<
	Union,
	GroupingKey extends ConditionalKeys<Union, PropertyKey>,
> = {
	[Key in Extract<Union[GroupingKey], PropertyKey>]: Union extends Union
		? Key extends Union[GroupingKey]
			? Union
			: never
		: never;
};

export {};

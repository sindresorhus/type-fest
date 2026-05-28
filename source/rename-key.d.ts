import type {KeysOfUnion} from './keys-of-union.d.ts';

/**
Rename a single key in an object type, preserving its value type and modifiers (optional, readonly).

Useful when you want to derive a new type from an existing one with one key relabeled, without losing the original value type or remapping every property. See {@link RenameKeys} for the multi-key variant.

@example
```
import type {RenameKey} from 'type-fest';

type User = {
	id: string;
	name: string;
	createdAt: Date;
};

type Renamed = RenameKey<User, 'createdAt', 'created_at'>;
//=> {id: string; name: string; created_at: Date}
```

Works with unions, distributing over each member:

@example
```
import type {RenameKey} from 'type-fest';

type Event =
	| {kind: 'click'; target: string}
	| {kind: 'submit'; target: HTMLFormElement};

type Renamed = RenameKey<Event, 'target', 'element'>;
//=> {
// 	kind: 'click';
// 	element: string;
// } | {
// 	kind: 'submit';
// 	element: HTMLFormElement;
// }
```

Preserves optional and readonly modifiers:

@example
```
import type {RenameKey} from 'type-fest';

type Source = {
	readonly id: string;
	label?: string;
};

type Renamed = RenameKey<RenameKey<Source, 'id', 'identifier'>, 'label', 'name'>;
//=> {readonly identifier: string; name?: string}
```

@category Object
*/
export type RenameKey<
	BaseType,
	FromKey extends KeysOfUnion<BaseType>,
	ToKey extends PropertyKey,
> = {
	[Key in keyof BaseType as Key extends FromKey ? ToKey : Key]: BaseType[Key];
};

export {};

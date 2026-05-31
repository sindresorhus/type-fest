import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {RenameKeys} from './rename-keys.d.ts';

/**
Rename a single key in an object type, preserving its value type and modifiers (optional, readonly). Other keys pass through unchanged.

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

Returns `never` under the same conditions as `RenameKeys`. The wrapper also rejects a typo'd source key at the call site via `FromKey extends KeysOfUnion<BaseType>`:

@example
```
import type {RenameKey} from 'type-fest';

// @ts-expect-error 'missing' is not a property of the source.
type Bad = RenameKey<{a: number}, 'missing', 'renamed'>;
```

@see {@link RenameKeys}
@category Object
*/
export type RenameKey<
	BaseType,
	FromKey extends KeysOfUnion<BaseType>,
	ToKey extends PropertyKey,
> = RenameKeys<BaseType, {[Key in FromKey]: ToKey}>;

export {};

import type {IfNotAnyOrNever} from './internal/index.d.ts';
import type {TagContainer, UnwrapTagged} from './tagged.d.ts';

/**
Returns a boolean for whether the given type is a `true` or `false` [literal type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types).

Useful for:
	- providing strongly-typed functions when given literal arguments
	- type utilities, such as when constructing parsers and ASTs

@example
```
import type {IsBooleanLiteral} from 'type-fest';

const id = 123;

type GetId<AsString extends boolean> =
	IsBooleanLiteral<AsString> extends true
		? AsString extends true
			? `${typeof id}`
			: typeof id
		: number | string;

function getId<AsString extends boolean = false>(options?: {asString: AsString}) {
	return (options?.asString ? `${id}` : id) as GetId<AsString>;
}

const numberId = getId();
//=> number | string

const stringId = getId({asString: true});
//=> number | string

declare const runtimeBoolean: boolean;
const eitherId = getId({asString: runtimeBoolean});
//=> string | number
```

@category Type Guard
@category Utilities
*/
export type IsBooleanLiteral<T> = IfNotAnyOrNever<T, {
	ifNot: _IsBooleanLiteral<T extends TagContainer<any> ? UnwrapTagged<T> : T>;
	ifAny: false;
	ifNever: false;
}>;

type _IsBooleanLiteral<T> = boolean extends T
	? false
	: T extends boolean
		? true
		: false;

export {};

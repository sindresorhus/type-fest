import type {Simplify} from '../simplify.d.ts';

// Returns `never` if the key is optional otherwise return the key type.
type RequiredFilter<Type, Key extends keyof Type> = undefined extends Type[Key]
	? Type[Key] extends undefined
		? Key
		: never
	: Key;

// Returns `never` if the key is required otherwise return the key type.
type OptionalFilter<Type, Key extends keyof Type> = undefined extends Type[Key]
	? Type[Key] extends undefined
		? never
		: Key
	: never;

/**
Enforce optional keys (by adding the `?` operator) for keys that have a union with `undefined`.

@example
```
import type {EnforceOptional} from 'type-fest';

type Foo = {
	a: string;
	b?: string;
	c: undefined;
	d: number | undefined;
};

type FooBar = EnforceOptional<Foo>;
// => {
// 	a: string;
// 	b?: string;
// 	c: undefined;
// 	d?: number;
// }
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gUQHYDNoDGKA8mDMBNgIYA2AvnLlBCHAORKoC0uKAzjDYBuAFAjOaAGIQIcALwYRASCoAuOAKjBsAc1FKARgH51m7XuUF1AV2wATFLm0o7+u+uzWQBlFDgAfOFsHJ2wXUTpRcWQpGQAhKj8FHHwoIlJySloAHmkIAD5RAHoi+XzFErgVUxgtXWLSwxMNWvMGqqsg+0dnVxFKpTtmz29fdrogA)

@internal
@category Object
*/
export type EnforceOptional<ObjectType> = Simplify<{
	[Key in keyof ObjectType as RequiredFilter<ObjectType, Key>]: ObjectType[Key]
} & {
	[Key in keyof ObjectType as OptionalFilter<ObjectType, Key>]?: Exclude<ObjectType[Key], undefined>
}>;

export {};

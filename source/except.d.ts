import type {IsEqual} from './is-equal';

/**
Filter out keys from an object.

Returns `never` if `Exclude` is strictly equal to `Key`.
Returns `never` if `Key` extends `Exclude`.
Returns `Key` otherwise.

@example
```
type Filtered = Filter<'foo', 'foo'>;
//=> never
```

@example
```
type Filtered = Filter<'bar', string>;
//=> never
```

@example
```
type Filtered = Filter<'bar', 'foo'>;
//=> 'bar'
```

@see {NonStrictExcept}
*/
type Filter<KeyType, ExcludeType> =
IsEqual<KeyType, ExcludeType> extends true ? never :
	KeyType extends ExcludeType ? never : KeyType;

type ExceptOptions = {
	/**
	Setting this to `false` is not recommended.

	@default true
	*/
	strict?: boolean;
};

/**
Create a type from an object type without certain keys.

This type is a stricter version of [`Omit`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-5.html#the-omit-helper-type). The `Omit` type does not restrict the omitted keys to be keys present on the given type, while `Except` does. The benefits of a stricter type are avoiding typos and allowing the compiler to pick up on rename refactors automatically.

This type was proposed to the TypeScript team, which declined it, saying they prefer that libraries implement stricter versions of the built-in types ([microsoft/TypeScript#30825](https://github.com/microsoft/TypeScript/issues/30825#issuecomment-523668235)).

The LaxExcept refers to the standard Except method that permits the assignment of an object with additional properties to an object of a different type.
@see https://github.com/sindresorhus/type-fest/issues/556

@category Object
*/
type NonStrictExcept<ObjectType, KeysType extends keyof ObjectType> = {
	[KeyType in keyof ObjectType as Filter<KeyType, KeysType>]: ObjectType[KeyType];
};

/**
Create a type from an object type without certain keys - in stricter way.
When the "strict" option in ExceptOptions is true (by default) StrictExcept will be used.

The StrictExcept method resolves the problem that arises when an object with additional properties is assigned to an object of a different type.
@see https://github.com/sindresorhus/type-fest/issues/556

@category Object
*/

type StrictExcept<ObjectType, KeysType extends keyof ObjectType> = NonStrictExcept<ObjectType, KeysType> & Partial<Record<KeysType, never>>;

/**
The Except type is the exported type, which determines the appropriate method to use (LaxExcept or StrictExcept) based on the options provided as the third argument (which is set to true by default).
x
@example
```
import { Except } from "type-fest";

type Foo = {
	a: number;
	b: string;
	c: boolean;
};

type FooWithoutA = Except<Foo, "a", {strict: false}>;

const foo: Foo = {
  a: 1,
  b: "b",
  c: true,
};

const fooWithoutA: FooWithoutA = foo; // No error
//=> NonStrictExcept<Foo, "a">;

@example
```
import { Except } from "type-fest";

type Foo = {
	a: number;
	b: string;
	c: boolean;
};

type FooWithoutA = Except<Foo, "a", {strict: true}>; // true be default

const foo: Foo = {
  a: 1,
  b: "b",
  c: true,
};

const fooWithoutA: FooWithoutA = foo; // Error
//=> StrictExcept<Foo, "a">;
 */
export type Except<ObjectType, KeysType extends keyof ObjectType, Options extends ExceptOptions = {strict: true}> =
Options['strict'] extends true ? StrictExcept<ObjectType, KeysType> : NonStrictExcept<ObjectType, KeysType>;

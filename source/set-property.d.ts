import type {ConsistsOnlyOf} from './consists-only-of.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {DigitCharacter} from './characters.d.ts';
import type {OmitIndexSignature} from './omit-index-signature.d.ts';
import type {PickIndexSignature} from './pick-index-signature.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {ExactKey, SetArrayAccess, SimplifyObject, ToPath, ToString, UnwrapPathBrand} from './internal/index.d.ts';
import type {IsReadonlyArray} from './is-readonly-array.d.ts';

/**
The declared spelling of `Key` in `BaseType`, or `never` when no member declares it. An index signature declares no keys, so `OmitIndexSignature` keeps it from shadowing the literal ones.
*/
type DeclaredKey<BaseType extends object, Key extends PropertyKey> = ExactKey<OmitIndexSignature<BaseType>, Key>;

/**
The spelling of `Key` covered by an index signature in `BaseType`, or `never`. Matching uses TypeScript's own key rules, including template index signatures.
*/
type CoveringSignature<BaseType extends object, Key extends PropertyKey> = ExactKey<PickIndexSignature<BaseType>, Key>;

/**
The member that reading `Key` resolves through: a declared key or an index signature that covers it.

Check each member independently so overlapping index signatures all admit the new value.
*/
type KeyMatch<Key extends PropertyKey, Member extends PropertyKey> = [ExactKey<Record<Member, unknown>, Key>] extends [never] ? never : Member;

/**
Walk `Path` one key at a time, and place `Value` at the end of the path. Each union member is walked independently, creating a container when necessary.
*/
type SetPropertyAtPath<BaseType, Path extends readonly PropertyKey[], Value> =
	BaseType extends unknown // For distributing `BaseType`
		? Path extends readonly [infer Key extends PropertyKey, ...infer Rest extends readonly PropertyKey[]]
			? SetPropertyAtKey<BaseType, ToString<UnwrapPathBrand<Key>>, Rest, Value>
			// The path is exhausted, so this is where the value is placed.
			: Path extends readonly [] ? Value : BaseType
		: never; // Should never happen

/**
Set the property at the first key of the path, on an array, an object, or a new container when the value at the position is not an object.
*/
type SetPropertyAtKey<BaseType, Key extends PropertyKey, Rest extends readonly PropertyKey[], Value> =
	Key extends unknown // For distributing `Key`, so a union of keys sets each one on its own, the same as a union of paths
		? IsAny<BaseType> extends true
			? any
			: BaseType extends UnknownArray
				? SetPropertyInArray<BaseType, Key, Rest, Value>
				// A non-literal key, like `string`, `number`, or `` `${number}` ``, can name any property, so the type is returned unchanged.
				: {} extends Record<ToString<Key>, never>
					? BaseType
					: BaseType extends object
						? SetPropertyInObject<BaseType, Key, Rest, Value>
						// A non-object at an intermediate position is replaced by a new container, like `dot-prop` and Lodash do at runtime.
						// A nullish member is replaced too, and a numeric key creates an array.
						: SetPropertyAtKey<NewContainer<Key>, Key, Rest, Value>
		: never; // Should never happen

/**
Create an array for a canonical non-negative integer key, and an object for any other key.
*/
type NewContainer<Key extends PropertyKey> = ToString<Key> extends `${bigint}`
	? ConsistsOnlyOf<ToString<Key>, DigitCharacter> extends true ? never[] : {}
	: {};

/**
Set the property at `Key` in the object, and create the key when no member declares it and no index signature covers it.
*/
type SetPropertyInObject<BaseType extends object, Key extends PropertyKey, Rest extends readonly PropertyKey[], Value> =
	// Simplify only the rebuilt object, preserving untouched properties and replacement values, including class instances and arrays.
	SimplifyObject<{
		[Member in keyof BaseType]: Member extends KeyMatch<Key, Member>
			// A key under an index signature unions the original value, because the signature constrains every key it covers. An undeclared entry may be missing, so it also sets into a new container.
			? [CoveringSignature<BaseType, Key>] extends [never]
				? SetPropertyAtPath<BaseType[Member], Rest, Value>
				: BaseType[Member] | SetPropertyAtPath<BaseType[Member] | ({} extends Record<Member, never> ? undefined : never), Rest, Value>
			: BaseType[Member]
	}
	& ([DeclaredKey<BaseType, Key>] extends [never]
		? [CoveringSignature<BaseType, Key>] extends [never]
			// The key is new, like `dot-prop` creating it at runtime.
			? {[CreatedKey in ToString<Key>]: SetPropertyAtPath<undefined, Rest, Value>}
			: {}
		: {})>;

/**
Set the element at the numeric key in the array or tuple. An array of unknown length unions the deep-set element into its element type, since only one element changes, and a tuple replaces an explicitly declared position. Any other numeric position gives an array of unknown length and may create a new container for a missing element.
*/
type SetPropertyInArray<ArrayType extends UnknownArray, Key extends PropertyKey, Rest extends readonly PropertyKey[], Value> =
	// A numeric key is matched by its round-tripped spelling, the same way `Get` reads it, so `01` does not name `1`. Any other key cannot name an element.
	ToString<Key> extends `${infer Index extends number}`
		? `${Index}` extends ToString<Key>
			? `${Index}` extends keyof ArrayType
				? {[Member in keyof ArrayType]: Member extends `${Index}` ? SetPropertyAtPath<ArrayType[Member], Rest, Value> : ArrayType[Member]}
				// An index outside a declared tuple position, or a non-literal index, makes the element type a union in an array of unknown length.
				: SetArrayAccess<Array<ArrayType[number] | SetPropertyAtPath<ArrayType[number] | undefined, Rest, Value>>, IsReadonlyArray<ArrayType>>
			// A non-canonical numeric spelling, like `01`, does not name an element.
			: never
		: never; // Any other key cannot name an element

/**
Read the path as `Get` does: an array is kept, and anything else is split on `.` and `[...]`.
*/
type NormalizePath<Path extends string | number | ReadonlyArray<string | number>> =
	Path extends ReadonlyArray<string | number> ? Path : ToPath<ToString<UnwrapPathBrand<Path>>>;

/**
Set a deeply-nested property on an object using a key path, like [Lodash's `.set()`](https://lodash.com/docs#set) function.

Use-case: Type the result of functions that set a property at a key path, like [`dot-prop`](https://github.com/sindresorhus/dot-prop)'s `setProperty` function.

Keys along the path that do not exist are created, and a value that is not an object, including a nullish one, is replaced by a new container at an intermediate position, the same way Lodash and `dot-prop` behave at runtime. A literal non-negative integer index creates an array; other keys create plain objects. A nullish member of a union sets into a new container, so its result unions with the results of the other members. Property modifiers are preserved, including on the property being set. The operation is not blocked by `readonly`, since it produces a new type.

A variable-length array unions the deep-set value into its element type, since only one element changes. An array element or index-signature entry may be absent, so a deep write also includes the result of creating a new container there. A tuple preserves its shape when updating an explicitly declared position in its fixed prefix; other indexes give an array of unknown length. A key that is not an index, like `'length'`, cannot set into an array, and makes the array `never`.

A path can also be a number, like `Get`, read as its string form. An empty string path sets a key named `''`. An empty array path sets nothing. A union of paths sets each path on its own, and the results union.

@example
```
import type {SetProperty} from 'type-fest';

type Settings = {
	theme: {
		color: string;
	};
};

type SettingsWithFontSize = SetProperty<Settings, 'theme.fontSize', number>;
// {
// 	theme: {
// 		color: string;
// 		fontSize: number;
// 	};
// }

// The path can also be an array of strings, like `Get`
type SettingsWithDarkMode = SetProperty<Settings, ['theme', 'dark'], boolean>;
// {
// 	theme: {
// 		color: string;
// 		dark: boolean;
// 	};
// }
```

@example
```
import type {SetProperty} from 'type-fest';

type Store = {
	users: Array<{name: string}>;
};

// Arrays are handled too. Only one element changes, so the element type becomes a union.
type UsersWithNumberedName = SetProperty<Store, 'users[0].name', number>;
// {
// 	users: Array<{name: string} | {name: number}>;
// }
```

Known limitations:
- A string path cannot address a key that contains a dot, like `'a.b'`, or a quoted bracket key, like `'a["b"]'`; the bracket part keeps its quotes, so it names the key `'"b"'`. Use the array form: `SetProperty<{'a.b': number}, ['a.b'], string>`.
- A non-literal key that cannot be an index, like `string` or `` `foo.${number}` ``, cannot be walked, so the type is returned unchanged. A non-literal index on an array, like `` `users.${number}` ``, sets into the element type instead.
- An array path of unknown length, like `string[]` or `['a', ...string[]]`, cannot be walked, so the type is returned unchanged.
- Creating a missing array container requires a literal non-negative integer index. Fresh arrays have an unknown length; empty positions are not modeled.
- An index outside a tuple's explicitly declared positions, including one in a rest region, gives an array of unknown length. This also applies to non-literal indexes and tuples with a leading rest element.
- A declared `never` property or tuple element absorbs the set value, at any depth: `SetProperty<{foo: never}, 'foo.bar', number>` is `{foo: never}`.
- A key under an index signature unions the old and new values, since the signature constrains every key it covers: `SetProperty<Record<string, number>, 'a', string>` is `{[x: string]: number | string}`.
- A string-enum key, like `{[Field.Name]: string}`, cannot be addressed, not by its value `'name'` and not by the member `Field.Name`, which is stringified to `'name'` first. The created `'name'` key then merges with the untouched member, so `SetProperty<{[Field.Name]: string}, 'name', number>` is `{name: never}`, and a deeper path intersects the old and new values.
- A path into a function, or into a class instance, flattens it to a plain object, so the call signature, private members, and class identity are dropped. Public members are kept.
- Very deep paths can exceed TypeScript's instantiation-depth limit.

@category Object
@category Array
@category Template literal
*/
export type SetProperty<BaseType extends object, Path extends string | number | ReadonlyArray<string | number>, Value> =
	IsAny<BaseType> extends true
		? any
		: Path extends unknown // For distributing `Path`, including an empty path in a union
			? NormalizePath<Path> extends readonly []
				// An empty path, like `[]`, sets nothing.
				? BaseType
				: SetPropertyAtPath<BaseType, NormalizePath<Path>, Value>
			: never; // Should never happen

export {};

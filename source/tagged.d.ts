import type tag from 'tagged-tag';

// eslint-disable-next-line type-fest/require-exported-types
export type TagContainer<Token> = {
	readonly [tag]: Token;
};

type Tag<Token extends PropertyKey, TagMetadata> = TagContainer<{[K in Token]: TagMetadata}>;

/**
Attach a "tag" to an arbitrary type. This allows you to create distinct types, that aren't assignable to one another, for distinct concepts in your program that should not be interchangeable, even if their runtime values have the same type. (See examples.)

A type returned by `Tagged` can be passed to `Tagged` again, to create a type with multiple tags.

[Read more about tagged types.](https://medium.com/@KevinBGreene/surviving-the-typescript-ecosystem-branding-and-type-tagging-6cf6e516523d)

A tag's name is usually a string (and must be a string, number, or symbol), but each application of a tag can also contain an arbitrary type as its "metadata". See {@link GetTagMetadata} for examples and explanation.

A type `A` returned by `Tagged` is assignable to another type `B` returned by `Tagged` if and only if:
  - the underlying (untagged) type of `A` is assignable to the underlying type of `B`;
	- `A` contains at least all the tags `B` has;
	- and the metadata type for each of `A`'s tags is assignable to the metadata type of `B`'s corresponding tag.

There have been several discussions about adding similar features to TypeScript. Unfortunately, nothing has (yet) moved forward:
	- [Microsoft/TypeScript#202](https://github.com/microsoft/TypeScript/issues/202)
	- [Microsoft/TypeScript#4895](https://github.com/microsoft/TypeScript/issues/4895)
	- [Microsoft/TypeScript#33290](https://github.com/microsoft/TypeScript/pull/33290)

@example
```
import type {Tagged} from 'type-fest';

type AccountNumber = Tagged<number, 'AccountNumber'>;
type AccountBalance = Tagged<number, 'AccountBalance'>;

function createAccountNumber(): AccountNumber {
	// As you can see, casting from a `number` (the underlying type being tagged) is allowed.
	return 2 as AccountNumber;
}

declare function getMoneyForAccount(accountNumber: AccountNumber): AccountBalance;

// This will compile successfully.
getMoneyForAccount(createAccountNumber());

// But this won't, because it has to be explicitly passed as an `AccountNumber` type!
// Critically, you could not accidentally use an `AccountBalance` as an `AccountNumber`.
// @ts-expect-error
getMoneyForAccount(2);

// You can also use tagged values like their underlying, untagged type.
// I.e., this will compile successfully because an `AccountNumber` can be used as a regular `number`.
// In this sense, the underlying base type is not hidden, which differentiates tagged types from opaque types in other languages.
const accountNumber = createAccountNumber() + 2;
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gFQIYHNcoAmAvnAGZQQhwDkSqAtGSgM4w0DcAUF-WgIIBjQRACuAOxgA5USABGKKHAC8cHPiIAecbIVQANLSEiJ03YpoA+bnzjGxkgELYANtnGC0q9QULbzBkbCDjDObh4oVtxcZBKCMMAQ4nCCUCjYMCj2pjLyigAUAJQAXHbBOQEYXACQAPS1dixwiGIp7nAsKCiGgthswOK45JTU2HAABjp5UONw+TAAFmgShIouiANDtgqbCHi+hXDATa4uEADuRAB0NWkwolDJAExwfWUmkrl63MQ8q4JuNLkOIJJJwAgwACySRQiAAYtBspJ8thyp8AqUkWZpiV3iEwu5PNF6moFsc4OdgC4XCkqGAqWgWKJhKwWLFqYgbhDoeJYQioFj8ql0pksV8CoVCsSGo5RPBFuTzkk6IYFL1RJ0jvAFm8YBA4Ao4CgAB5gFzAQTAGDrOBgPqdQivE7JcZigKzPgAQi4JIAwlArRbTohDC1RLTRC5HeIIPBUZbVpJg3ANWh2q60aFXISULM3um3dNxjcSQABGAsBgm1DxKtQShQLjcmHwxGZ-JPKU8EkATVavWSrhY+tTew0joAbq5RKw4OaANZoRYoYBKFZrDaDQymfZEBDIFAlhoASSuh8MCqalOptPADI6zM8LDZkZtauwo4LmfFMzayUNqaOvmcBpLgkbYEokzukecDHskl4dCg4idBeSwpuIqxQOsuxyH0S4HkcTQxtqwCEImhjnGSggLHAhDAGQzBpJIwAZLOMC7o6fBNBQVBwBAdoAI4zvuqBNAMfHLko4RgXgrA3CIyFxt+lSqMKrGFnoRRwAA1HATwcEAA)

@example
```
import type {Tagged} from 'type-fest';

// You can apply multiple tags to a type by using `Tagged` repeatedly.
type Url = Tagged<string, 'URL'>;
type SpecialCacheKey = Tagged<Url, 'SpecialCacheKey'>;

// You can also pass a union of tag names, so this is equivalent to the above, although it doesn't give you the ability to assign distinct metadata to each tag.
type SpecialCacheKey2 = Tagged<string, 'URL' | 'SpecialCacheKey'>;
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gFQIYHNcoAmAvnAGZQQhwDkSqAtGSgM4w0DcAUFwPS9wAmhACucAMbYAdnGxgwAG0RwQIhTGCK0MPCwQRZCZGgBGykS2BTccAAY58RW3CgpU2GESUA6LvTQAqlAKcAC8cA4EhAA8bFBWuAA0tAEASgAyNAB83P5wAMqo4sDYCgDC2OIAFigA0ijK4ZFE0UEKyTSFKMWlFdV1DdncfALCYpIypSwGYNgsethwIlLAEDIQZAh4cFLYIKzJ0whVwHqncCgAjiLAAG6lKFLwMAYwNbImELcoyaVvorgqnBgPBCBBWFI6HBcHc0IhRMc0NgTMAFCDlC9ZPNgLgZIRThopOJ4PsdIQPItMShKkCdLhfHkuj1yjSBogAExhCJ4KKxGDxawdNKZOAAH1oTJKLP69UQQyAA)

@category Type
*/
export type Tagged<Type, TagName extends PropertyKey, TagMetadata = never> = Type & Tag<TagName, TagMetadata>;

/**
Given a type and a tag name, returns the metadata associated with that tag on that type.

In the example below, one could use `Tagged<string, 'JSON'>` to represent "a string that is valid JSON". That type might be useful -- for instance, it communicates that the value can be safely passed to `JSON.parse` without it throwing an exception. However, it doesn't indicate what type of value will be produced on parse (which is sometimes known). `JsonOf<T>` solves this; it represents "a string that is valid JSON and that, if parsed, would produce a value of type T". The type T is held in the metadata associated with the `'JSON'` tag.

This article explains more about [how tag metadata works and when it can be useful](https://medium.com/@ethanresnick/advanced-typescript-tagged-types-improved-with-type-level-metadata-5072fc125fcf).

@example
```
import type {Tagged, GetTagMetadata} from 'type-fest';

type JsonOf<T> = Tagged<string, 'JSON', T>;

function stringify<T>(it: T) {
  return JSON.stringify(it) as JsonOf<T>;
}

function parse<T extends JsonOf<unknown>>(it: T) {
  return JSON.parse(it) as GetTagMetadata<T, 'JSON'>;
}

const x = stringify({ hello: 'world' });
const parsed = parse(x); // The type of `parsed` is { hello: string }
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gFQIYHNcoAmANHAOIow64Cyl2h2M2AvnAGZQQhwDkSqALTsUAZxi8A3AChpAtAClREAHYB5dgB5MAPjgBeONQKFN4qMBW5SvBQGU1AOV6ldM6ewCuKgMYxgqnDmlrjA7IjaOgAUwDAAXEYAlBjScHBQlJ5QKnD2TgB0wVZhiDEwydiiucrqWm7SLLJevv6BYNhQoijacCgAHjAoKoRVSqoamt4A1ioQAO4qOtGxCZjJ6Knpmdm5Do757Z0oZRVVFFR4dMyMzNo2ec46Mo3SPqricH0GQTAWxeFRdBwAAWKAANmCIAleHNoGDCLw4CxEjI3ioPocuoRvpjjn0UXAAPSEoyghDINAQdhwAAGuMINLgwCqQNBEKhPz+uCRQA)

@category Type
*/
export type GetTagMetadata<Type extends Tag<TagName, unknown>, TagName extends PropertyKey> = Type[typeof tag][TagName];

/**
Revert a tagged type back to its original type by removing all tags.

Why is this necessary?

1. Use a `Tagged` type as object keys
2. Prevent TS4058 error: "Return type of exported function has or is using name X from external module Y but cannot be named"

@example
```
import type {Tagged, UnwrapTagged} from 'type-fest';

type AccountType = Tagged<'SAVINGS' | 'CHECKING', 'AccountType'>;

const moneyByAccountType: Record<UnwrapTagged<AccountType>, number> = {
	SAVINGS: 99,
	CHECKING: 0.1
};

// Without UnwrapTagged, the following expression would throw a type error.
const money = moneyByAccountType.SAVINGS; // TS error: Property 'SAVINGS' does not exist

// Attempting to pass an non-Tagged type to UnwrapTagged will raise a type error.
// @ts-expect-error
type WontWork = UnwrapTagged<string>;
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gFQIYHNcoAmANHAKoB2A7lNmDvkQL5wBmUEIcA5EqgLSsUAZxjcA3AChJfNAEEAxgogBXCjEzI0AXjgMChADzcAynIBqASQByAcRPc4AHx4BhABIBRVwGkbt7lJuRWU1DS1uAD4pSWUKUTgQCAoURAAhRBDVdU1UAC44ACUUZSgjSho6fSJDLLDclEjSChUQACMUKEi4XXRJAEgzKzsTAoBOMeIBj28-OwKABgA6AEZJJhiAek24AHVgGAALVXgK2no8A1IjtFYIABt7iCpgClw4FAAPMCgRYWBknAqKp7oQEIcOFQ4NgEFoPlAOFAlrFkgkkilED1EslUhk6jktEshv4TOI4Ns9CZ4YiCgAFDioWCY0wWEmOQgQERwCgQeBfYCiaQUuQwGAocAwV7vGAQOBgbDCYTQijc5L8apg2QIWVnKqXIhA4CPOC0AVoGFazqI5EUgACMGE-C+qAUMCdCOgMjhu2SMB9UAA1ljdRdGEZRFApdEgA)

@category Type
*/
export type UnwrapTagged<TaggedType extends Tag<PropertyKey, any>> =
RemoveAllTags<TaggedType>;

type RemoveAllTags<T> = T extends Tag<PropertyKey, any>
	? {
		[ThisTag in keyof T[typeof tag]]: T extends Tagged<infer Type, ThisTag, T[typeof tag][ThisTag]>
			? RemoveAllTags<Type>
			: never
	}[keyof T[typeof tag]]
	: T;

/**
Note: The `Opaque` type is deprecated in favor of `Tagged`.

Attach a "tag" to an arbitrary type. This allows you to create distinct types, that aren't assignable to one another, for runtime values that would otherwise have the same type. (See examples.)

The generic type parameters can be anything.

Note that `Opaque` is somewhat of a misnomer here, in that, unlike [some alternative implementations](https://github.com/microsoft/TypeScript/issues/4895#issuecomment-425132582), the original, untagged type is not actually hidden. (E.g., functions that accept the untagged type can still be called with the "opaque" version -- but not vice-versa.)

Also note that this implementation is limited to a single tag. If you want to allow multiple tags, use `Tagged` instead.

[Read more about tagged types.](https://medium.com/@KevinBGreene/surviving-the-typescript-ecosystem-branding-and-type-tagging-6cf6e516523d)

There have been several discussions about adding similar features to TypeScript. Unfortunately, nothing has (yet) moved forward:
	- [Microsoft/TypeScript#202](https://github.com/microsoft/TypeScript/issues/202)
	- [Microsoft/TypeScript#15408](https://github.com/Microsoft/TypeScript/issues/15408)
	- [Microsoft/TypeScript#15807](https://github.com/Microsoft/TypeScript/issues/15807)

@example
```
import type {Opaque} from 'type-fest';

type AccountNumber = Opaque<number, 'AccountNumber'>;
type AccountBalance = Opaque<number, 'AccountBalance'>;

// The `Token` parameter allows the compiler to differentiate between types, whereas "unknown" will not. For example, consider the following structures:
type ThingOne = Opaque<string>;
type ThingTwo = Opaque<string>;

// To the compiler, these types are allowed to be cast to each other as they have the same underlying type. They are both `string & { __opaque__: unknown }`.
// To avoid this behaviour, you would instead pass the "Token" parameter, like so.
type NewThingOne = Opaque<string, 'ThingOne'>;
type NewThingTwo = Opaque<string, 'ThingTwo'>;

// Now they're completely separate types, so the following will fail to compile.
function createNewThingOne (): NewThingOne {
	// As you can see, casting from a string is still allowed. However, you may not cast NewThingOne to NewThingTwo, and vice versa.
	return 'new thing one' as NewThingOne;
}

// This will fail to compile, as they are fundamentally different types.
// @ts-expect-error
const thingTwo = createNewThingOne() as NewThingTwo;

// Here's another example of opaque typing.
function createAccountNumber(): AccountNumber {
	return 2 as AccountNumber;
}

declare function getMoneyForAccount(accountNumber: AccountNumber): AccountBalance;

// This will compile successfully.
getMoneyForAccount(createAccountNumber());

// But this won't, because it has to be explicitly passed as an `AccountNumber` type.
// @ts-expect-error
getMoneyForAccount(2);

// You can use opaque values like they aren't opaque too.
const accountNumber = createAccountNumber();

// This will compile successfully.
const newAccountNumber = accountNumber + 2;

// As a side note, you can (and should) use recursive types for your opaque types to make them stronger and hopefully easier to type.
type Person = {
	id: Opaque<number, Person>;
	name: string;
};
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3geTAQwI4CuKAvnAGZQQhwDkSqAtGSgM4w0DcAUF-WgIIBjQRAIA7GADkCIAEYoocALxxs+IgB4xM+VAA0tISPFSdCmgD5ufOEdESAQjgA2OMYLQq1hFFrP7DYXsYJ1d3FEtuLgB6aLgAFQALNAADeIgAaxQxFLhcKBwQFBgFOBdnCAB3FgRkuBFwYGdSmAg4ABNgMmYobJhgHBK4eRhKlGyEZFYDSuTenBqAInEMsSqxRbhKpuc4NZgAOjgAMWg4FAAPQrBmgxExFmB2lrqyCGcK7bEAczg2KAIghgBF6LAAXLwpglEsAfpgxJ5VLgfBp-rDvlZIahoej4pU2l5kZo0T9MTE4ulamgGmAmgoDDBkiw0HwajhemUPlUUO0EG15PUFvBWuccIJEnAIIzSgsqYg4IkcAA3Fl1FiFNDiZ5QZyIdGTVBHJIoeXstCyKUSlIk34AMgwcAA+o6IESUM6wXAVmtKmI4MQUgdyQk2sqIE9asAavJFUrgKIAohRFtRM5ebC2CgcLzcCwatK4It0lkNnl2RqSgFnMAsn8IEGbJIUJUkuj4YjvMSYFB0QYaK24QjIli0E2WzCfniCUj1L4bX2B98p8Pg5IqnKaByac0Srq-ih8oMWVMWAYWG0C28uV9ftsPuQcE0+fUqLTmkGyOIgfG-YJ5iUx0Xds4AACgASk9QCJ2+YD0C4ABIWJbBqJMCEFP1mRQO4hX1CgqDKP5u31KNCJ2TlPh5I4AAluRVRNkxAHB5X2QU2DgKC2wRZ8OMnfEDDcXk4w8OA6PVIN4N6YEoD9GgEUqSMfklIcyhqHiYIRbhiB4JDWxqO9djIR9dhFGk6X4-NklNDlPzEdoNQkcp5U6boFD6A1WCDJCAAEYBYBhLlQIF-KgSgoC4e42MZXF8WUep-xQNT23AlT2ObRcpyiJCqNcmg2X2OZziucBmklMhJTdA10Q-L9+ggX94rsExpDkBRwM9RqJGa3QMAQySQT9AAmFKOtMFqoE0nhnkEVxrJqn84G+YoAFk6pNU4oBGkCxWMTr-HaoImv8CDbAOxwXDcDxMopGE9LI0ySpYQEPDzT8PkQINFpgFaEUQdbNr-LMShGrrWrAsCrrgBwCGFG6UzEOgDHkQQcAIZk4GAeBFXzfk0AC6tBAxvdc2ZXlZTcOAUmB-xcj4Ty4h8vyApQIKFFCrhPu+tboE2gbwe0uIAE1k2Rv1UbQV1ZxElwiBqata2lKzsjocrJdaetwrqtjtuCEHFBUAGjypsbwIh3Stju186T+J7WBYV7dSDCL4Dko3upUbXDrGuAAGo4AGiH+DZP4njQfYsLgVD0NAgS-kSVN2jAr00d6QQQUeFV3JqN5FFQxQJZ8TPn0Y+Xkmof46sWxQY7j1B7flLNHhaC8pgbKEAAUFHPP0VDg+Cnk9TtfG0MaDA7qAu8xeCxA1T0bU0jggA)

@category Type
@deprecated Use {@link Tagged} instead
*/
export type Opaque<Type, Token = unknown> = Type & TagContainer<Token>;

/**
Note: The `UnwrapOpaque` type is deprecated in favor of `UnwrapTagged`.

Revert an opaque or tagged type back to its original type by removing the readonly `[tag]`.

Why is this necessary?

1. Use an `Opaque` type as object keys
2. Prevent TS4058 error: "Return type of exported function has or is using name X from external module Y but cannot be named"

@example
```
import type {Opaque, UnwrapOpaque} from 'type-fest';

type AccountType = Opaque<'SAVINGS' | 'CHECKING', 'AccountType'>;

const moneyByAccountType: Record<UnwrapOpaque<AccountType>, number> = {
	SAVINGS: 99,
	CHECKING: 0.1
};

// Without UnwrapOpaque, the following expression would throw a type error.
const money = moneyByAccountType.SAVINGS; // TS error: Property 'SAVINGS' does not exist

// Attempting to pass an non-Opaque type to UnwrapOpaque will raise a type error.
// @ts-expect-error
type WontWork = UnwrapOpaque<string>;

// Using a Tagged type will work too.
// @ts-expect-error
type WillWork = UnwrapOpaque<Tagged<number, 'AccountNumber'>>; // number
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3geTAQwI4CuKANHAKoB2A7lDmNvkQL5wBmUEIcA5EqgLSsUAZxjcA3AChJfNAEEAxgogEKMACrI0AXjgNCKADzcAynIBqASQByAcRPc4AHx4BhABIBRVwGkbt7lJuRWVVDS1uAD4pSWUKUTgQCAoURAAhRBCVNU1UAC44ACUUZSgAE0NKGjp9IkMssNyUSNIKAhAAIxQoSLhddEkASDMrOxMCgE4J4iGPbz87AoAGADoARkkmGIB6bbgAdWAYAAsVeCraelwDUhO0VggAG0eIKmAKAHM4FAAPMCgRMJgMk4FQVI8yghjhwqHAcAgtN8oBwoCtYskEkkUog+olkqkMg0cloViN-CZxHBdnB1CYkSiCgAFDioWA40wWcmOMoQERwCgQeC-YCiaTUuQwGAocAwd5fGAQOC4YTCOEUfnJfi1NCyBCKi41a5EUHAZ5wWgitDw3XdFFo6kAARgwn4v1QChgruR0BkiP2yRg-qgAGtcQarowjKIoHLomK9mQgZ84TScB8PihIbq3mawSG9RB7XsnS63SVPbafbrDs8g6HdOHtYZ1GmMxU2p1ukEiTBrO0ulAotEqXsOwOgA)

@category Type
@deprecated Use {@link UnwrapTagged} instead
*/
export type UnwrapOpaque<OpaqueType extends TagContainer<unknown>> =
	OpaqueType extends Tag<PropertyKey, any>
		? RemoveAllTags<OpaqueType>
		: OpaqueType extends Opaque<infer Type, OpaqueType[typeof tag]>
			? Type
			: OpaqueType;

export {type default as tag} from 'tagged-tag';

export {};

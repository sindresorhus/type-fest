declare const invariantBrand: unique symbol;

/**
Create an [invariant type](https://basarat.gitbook.io/typescript/type-system/type-compatibility#footnote-invariance), which is a type that does not accept supertypes and subtypes.

Use-case:
- Prevent runtime errors that may occur due to assigning subtypes to supertypes.
- Improve type signature of object methods like [`Object.keys()` or `Object.entries()`](https://github.com/microsoft/TypeScript/pull/12253#issuecomment-263132208) by sealing the object type.

@example
```
import type {InvariantOf} from 'type-fest';

class Animal {
	constructor(public name: string){}
}

class Cat extends Animal {
	meow() {}
}

let animalArray: Animal[] = [new Animal('jerry')];
let catArray: Cat[] = [new Cat('tom')];

animalArray = catArray; // Okay if covariant
animalArray.push(new Animal('another animal')); // Pushed an animal into catArray
catArray.forEach(c => c.meow()); // Allowed but, error at runtime

let invariantAnimalArray: InvariantOf<Animal>[] = [new Animal('jerry')] as InvariantOf<Animal>[];
let invariantCatArray: InvariantOf<Cat>[] = [new Cat('tom')] as InvariantOf<Cat>[];

// @ts-expect-error
invariantAnimalArray = invariantCatArray; // Error: Type 'InvariantOf<Cat>[]' is not assignable to type 'InvariantOf<Animal>[]'.
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSQHYDcCGUw+2MA8gGYC+cFUEIcA5EqgLQUoDOMTA3ACgBAYwA2+LlzgBBbKHyiMAgJDCI2HlACuwmNAAUYLQCNRwYXGz4QKAFxxNwbAHMAlOioDPI8ZLgBhfHgUAA8YFGwAEylZeUV0FRsIAHd9VwxPb1EUeBI46SgofER7WJAFAG0AXTgAXjgK7BRkmTly0X0mACsUQsQmVyrBbPhhIIKikoCg6rqGppbAmE69EAGhoTz2ieK5sZgdxD44AHoTuDIAa13gCjg1AiISGAEthUOAOiMuAAt9BdacU6JAgMB+vTgb1EA1cxzOcAAClpfihIpDsOi4nAnHp7uNCsURPjJh8KNAAKL4YR-Cy1AB89w+SVSrlhp3O0lEohSqLgxi0MAANHBevQoJD4NpSKAUEIRti8IRiKQyu8CVMcI9leQKAAeVWiOmzeqNZqA9qdHp9daQqSapXPSj6toKI0beVOLXPJaHez2p6kJ1LN1zU2LIIrBg2iRwf3aoNBN2CATwgACMC4bFCqF0WcK0AEnodKpdokOcyLAZgPvVcPO5PzUHsABVkGgmHHHXrg9UmNipNhQbauMBnFZTGhcax253A3qDW6mB8gA)

@example
```
import type {InvariantOf} from 'type-fest';

// In covariance (default)

interface FooBar {
	foo: number;
	bar: string
}

interface FooBarBaz extends FooBar {
	baz: boolean
}

declare const fooBar: FooBar
declare const fooBarBaz: FooBarBaz

function keyOfFooBar(fooBar: FooBar) {
	return Object.keys(fooBar) as (keyof FooBar)[]
}

keyOfFooBar(fooBar) //=> (keyof FooBar)[]
keyOfFooBar(fooBarBaz) //=> (keyof FooBar)[] but, (keyof FooBarBaz)[] at runtime

// In invariance

export function invariantOf<Type>(value: Type): InvariantOf<Type> {
	return value as InvariantOf<Type>;
}

function keyOfInvariantFooBar(fooBar: InvariantOf<FooBar>) {
	return Object.keys(fooBar) as (keyof FooBar)[]
}

keyOfInvariantFooBar(invariantOf(fooBar)); // (keyof FooBar)[]

// @ts-expect-error
keyOfInvariantFooBar(invariantOf(fooBarBaz)); // Error: Argument of type 'InvariantOf<FooBarBaz>' is not assignable to parameter of type 'InvariantOf<FooBar>'.
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSQHYDcCGUw+2MA8gGYC+cFUEIcA5EqgLQUoDOMTA3ACgBAemFwccAMYQCREpLQAKACYoK+AK4AbGAEohwUiijqFcAGIQIAIUIYBASApWAXHGwaQAI2OCHXwjceImwAcwEqAyMTfDNLG0JbAC84FAAPGBRsZS4LK1soe398JLcvKy0UEgihVUktQjRpbB5afMC8hKgBOoaoJogW+Gcu5Ld4guShCg1sSRhgQbgAaxRESgnCRRGC8faoXSL+mA0obDgyLwArFHmAOlXELm39w-xcxUeICk6C3QBtAC6NQEjw2+xeXUOogAvAA+OCfNbfX6EAHAsEUTZQSGTErQ4TwxFfH7Y9FwLwaGAAGmJyNJ+2S5Pw8CgswWIBQQlE4nOhlkxDmXIE6UgsFos3miz5eEIgvIFAAPAAVZAoOGKAhaDQoNyq1C6Nw4AUkBUqtUI9COY6nc5anVwd68k2kSjm1BwwSRAQzOYLJaY41y03Y3EdINyV1K7Fww5Whw2s4Xa63GAPNbPHZox0fEmog5AkGB2WRmCh-nBqNhg66PhwHlIxAosmFkRiAACMC4bFFqZ7UHo3WLLrLEIrpco1aZtfrYgAogPoG4AIJQUKeLLwFGsNBMCPyt3Y5JwphwYC5bAQeDvLjAULYfBeSoICBwMCEfCczKFbdq5j701D32E87iAA)

@category Type
*/
export type InvariantOf<Type> = Type & {[invariantBrand]: (_: Type) => Type};

export {};

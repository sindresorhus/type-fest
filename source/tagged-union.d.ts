/**
Create a union of types that share a common discriminant property.

Use-case: A shorter way to declare tagged unions with multiple members.

@example
```
import type {TaggedUnion} from 'type-fest';

type Tagged<Fields extends Record<string, Record<string, unknown>>> = TaggedUnion<'type', Fields>

// The TaggedUnion utility reduces the amount of boilerplate needed to create a tagged union with multiple members, making the code more concise.
type EventMessage = Tagged<{
	OpenExternalUrl: {
		url: string;
		id: number;
		language: string;
	};
	ToggleBackButtonVisibility: {
		visible: boolean;
	};
	PurchaseButtonPressed: {
		price: number;
		time: Date;
	};
	NavigationStateChanged: {
		navigation?: string;
	};
}>;

// Here is the same type created without this utility.
type ManualEventMessage =
	| {
		type: 'OpenExternalUrl';
		url: string;
		id: number;
		language: string;
	}
	| {type: 'ToggleBackButtonVisibility'; visible: boolean}
	| {type: 'PurchaseButtonPressed'; price: number; time: Date}
	| {type: 'NavigationStateChanged'; navigation?: string};
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gFQIYHNcoAmAqgHbASkC+cAZlBCHAORKoC0tKAzjMwNwAoQWzQ58RADwAxYCgA2hbnBQAPGClJK4AJRQBjaIUm8owUrgA0ug0ZMwzF6wFdSAa1IQA7qQB8-uABeOHECEnJKSVZkFGZrWQUlX2EAehSQgAsxPDCyClI4ZxhgeWAkOCgiZ30eBCy4bBAIV3gIWjgAIwgSlCgweWwNOFIUIiIECDh9SsG0bAQc8dd8uC8yjLgQZ3li-rQQFBAO3u5rEGw3c1w6tENCfehbyn1gbhQAOhEYuABRADdNDAALI8bh4NDBUJSdCCACQAHlUKQfupeqRsPJiFB5AAuDBw2HObF40xXISw2HAQh40jOI69cmwgYWZzgkkOMlwqjkzAQfDyFAAIWw+jcgqKMEoADVXsAOiUyog8TCKX9ZR0BXiuhABdhSOTuXCAApE-QZbBvcUwSWkI2Vbhvan4ilgMw1Gl045QRnFA54gAiswN5IActg1bhBvkAMowWYAYXNFiIyoJ6IjUcoAH52Y5cMHBFRfEJBGk4AAJXpoV43OBgg4Ib7TFCzQirdbNeAwDI1ooKpCfURwIF61nyf6AkEO8FBOEAH2dsNEeOYiM0KI0UHRmOxAgJRNxdY5FkZVI99O9BOZuFZBFznNhVHnGGXLF5-KFIrFEul6v7iAEOA1W4OVNU6CAdRbahn3QV9mBNKAzQtIUf1te1HUA11gHdYZPQZBBQBQANZifWEF1gmIVzDDNikoWMEyTMJAPTYBI1o0gcyPPNuSAA)

@category Utilities
*/
export type TaggedUnion<
	TagKey extends string,
	UnionMembers extends Record<string, Record<string, unknown>>,
> = {
	[Name in keyof UnionMembers]: {[Key in TagKey]: Name} & UnionMembers[Name];
}[keyof UnionMembers];

export {};

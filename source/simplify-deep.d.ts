import type {ConditionalSimplifyDeep} from './conditional-simplify-deep.d.ts';
import type {MapsSetsOrArrays, NonRecursiveType} from './internal/index.d.ts';

/**
Deeply simplifies an object type.

You can exclude certain types from being simplified by providing them in the second generic `ExcludeType`.

Useful to flatten the type output to improve type hints shown in editors.

@example
```
import type {SimplifyDeep} from 'type-fest';

type PositionX = {
	left: number;
	right: number;
};

type PositionY = {
	top: number;
	bottom: number;
};

type Properties1 = {
	height: number;
	position: PositionY;
};

type Properties2 = {
	width: number;
	position: PositionX;
};

type Properties = Properties1 & Properties2;
// In your editor, hovering over `Props` will show the following:
//
// type Properties = Properties1 & Properties2;

type SimplifyDeepProperties = SimplifyDeep<Properties1 & Properties2>;
// But if wrapped in SimplifyDeep, hovering over `SimplifyDeepProperties` will show a flattened object with all the properties:
//
// SimplifyDeepProperties = {
// 	height: number;
// 	width: number;
// 	position: {
// 		top: number;
// 		bottom: number;
// 		left: number;
// 		right: number;
// 	};
// };
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gZVGANsAM0QBEUUwBfOAqCEOAciVQFoCUBnGBgbgCg+zNAAUIHYDGAQAdgA04AXgx8AkLhQEYALjjSAriABGKKPxVRgAcwAW23QeOm+FfoOQixEqdICai5SowEGA6+kYmZoYQMEEgoQ4Rzq5CcMK0qLDAnACM-uiq1ihWtvHhTiqQ4pIyOqJV3j78LgIpacEmkpwATHmqAO7AACYw1qWOZpVeName1XJNye6p6R1ZHP5tGZ0cuQBky+2Z3fwA9CdwAJLScIgQelBwKIMS0AA0cNYQAG4mwNKWcG+JjgAANNhwQXABrhcHAOJ8+ghCtQIDCIAN-lo+GdsedWisjuslJtVjk4PsSYSuotUHBsOB8ERSORKdt-PS8IQSGQwAAeVlrPYHLZrLoAPlO5wAQnp4IQoVAAIZgVCDOB-Ok4Rnc8jvT4-Cz-QEG0Ec7XMsACziQ6Gw+HouCK6i4RUxFDSJ6AwwAKxQAGN4AMRo6YUi0GACdssTizpqGVyLVaicpYypCsU7GFxri4CoBsNRvYypLc5M5jp8qnAsExokq1EYnRa04q+pNM2SypzBmOzmVM1Yy4gA)

@example
```
import type {SimplifyDeep} from 'type-fest';

// A complex type that you don't want or need to simplify
type ComplexType = {
	a: string;
	b: 'b';
	c: number;
};

type PositionX = {
	left: number;
	right: number;
};

type PositionY = {
	top: number;
	bottom: number;
};

// You want to simplify all other types
type Properties1 = {
	height: number;
	position: PositionY;
	foo: ComplexType;
};

type Properties2 = {
	width: number;
	position: PositionX;
	foo: ComplexType;
};

type SimplifyDeepProperties = SimplifyDeep<Properties1 & Properties2, ComplexType>;
// If wrapped in `SimplifyDeep` and set `ComplexType` to exclude, hovering over `SimplifyDeepProperties` will
// show a flattened object with all the properties except `ComplexType`:
//
// SimplifyDeepProperties = {
// 	height: number;
// 	width: number;
// 	position: {
// 		top: number;
// 		bottom: number;
// 		left: number;
// 		right: number;
// 	};
//	foo: ComplexType;
// };
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gZVGANsAM0QBEUUwBfOAqCEOAciVQFoCUBnGBgbgCg+AekFwAgnADGdPCgAeCZGhgALAIbxEEAK5wAJhAB2TOAHdVB+NDgGyuhBDgcc+In2ZoAwtNxyAKorgAXgw+AEhVAC5HGChgAwBzflCAIyiGZN4wiSiDLRBklCh+Cn43AIAFCCcYYEMADSCQ0J8CGBy8gqKw2PjlNusOwuLS9zhK6tqDAE1G9DCYCDB2-KGw5IgYBZBlzuGBYTgp7VNzeAXHZ0JEOFVcXDgN5UKFVA4y1DHaVFhgTgBGWZhJ7AXr9XIrLqhSATQxRcbAGqGKZJAgQCBRLzgHyyfyoPbvNDlL6FGqcABMgNCJmAuhUO1WUKqCMmcKZiIMdRRaIx3j8inxo2wWKupHIRMWJN+HEaQrwIrIYAAPOLvqSOACAGSfCU-ckAGjgmJkOMUAD5+AcAJIEUxQVRgVB2OJwAAGspcJAVLpuBjsHBQ8BdRuxuJQ3vOcgkuC0uhQBuUEAAboU4vEHsmoK73fKxcTdRxvdS7kIRBwEyYbtRcOoYCgbHYIMkAFYoCTwakqG53BBPOBgPNquCR8iB4N81AuiIlktwbNEUVgFWSziAg6hYGg+ldNfU2nKLcWkSMmEGKJzNehBZLAYQw9wUIpDZbA8zh8tMGDbdH0I9PovtclCWoSouihq8iaeIziUQA)

@see {@link Simplify}
@category Object
*/
export type SimplifyDeep<Type, ExcludeType = never> =
	ConditionalSimplifyDeep<
		Type,
	ExcludeType | NonRecursiveType | MapsSetsOrArrays,
	object
	>;

export {};

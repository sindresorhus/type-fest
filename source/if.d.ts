import type {IsNever} from './is-never.d.ts';

/**
An if-else-like type that resolves depending on whether the given `boolean` type is `true` or `false`.

Use-cases:
- You can use this in combination with `Is*` types to create an if-else-like experience. For example, `If<IsAny<any>, 'is any', 'not any'>`.

Note:
- Returns a union of if branch and else branch if the given type is `boolean` or `any`. For example, `If<boolean, 'Y', 'N'>` will return `'Y' | 'N'`.
- Returns the else branch if the given type is `never`. For example, `If<never, 'Y', 'N'>` will return `'N'`.

@example
```
import {If} from 'type-fest';

type A = If<true, 'yes', 'no'>;
//=> 'yes'

type B = If<false, 'yes', 'no'>;
//=> 'no'

type C = If<boolean, 'yes', 'no'>;
//=> 'yes' | 'no'

type D = If<any, 'yes', 'no'>;
//=> 'yes' | 'no'

type E = If<never, 'yes', 'no'>;
//=> 'no'
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBAbwJIDMC+cVQiOByGATzAFMBaFEgZxjwG4AoBo0uAQTgF45UAeGKAFcSAGnyFqeMXgB2EPAD5GAemWcF4yUxYk4AIS48UvFAEMANlVGaqU-HMUq1G2fO3FdAYUN8ARhAhzElMZaQlbaQclBlV1Gzw4AB97N2YPOAARH2MQwjDJSPlo2JdwhOTXPHdWAFFs3hkSADcSKHyIlMcY506gA)

@example
```
import {If, IsAny, IsNever} from 'type-fest';

type A = If<IsAny<unknown>, 'is any', 'not any'>;
//=> 'not any'

type B = If<IsNever<never>, 'is never', 'not never'>;
//=> 'is never'
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBAbwJIDMA0ckGcCCA7ATw2wDkBTANzKgF84UoIQ4ByGAsMgWhTKxhYBuAFDD2nODjgBeTCgA82fAXkBXPAGs8EAO54AfBhbAscAIaEWR7fAsEW+kQHon0-axvnLo8WTgAhGTlFLHIqKHk8SmpDVhM4KPCrDwh4ROoHZ1d3Y1N0qBYgA)

@example
```
import {If, IsEqual} from 'type-fest';

type IfEqual<T, U, IfBranch, ElseBranch> = If<IsEqual<T, U>, IfBranch, ElseBranch>;

type A = IfEqual<string, string, 'equal', 'not equal'>;
//=> 'equal'

type B = IfEqual<string, number, 'equal', 'not equal'>;
//=> 'not equal'
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBAbwJIDMA0ckGcCiBHAVwEMAbAXzhSghDgHIYBPMAUwFoUWsY6BuAKH5NWmFPmIkAPABUMAVQyoAQlCIA7AMYALDDhJYWK9doB8cALyjJ2caRnyTilEc064egy9MChzFnABBC1FbKW4oYDUAcwxwyJj6FkJSOgw6NQh4JIk6EwEAenzzMzpslMFhfyVg1FDJOOiMNQIQACMWKDSyklT6DKzknrz+QuK+zLhuuiA)

Note: Sometimes using the `If` type can make an implementation non–tail-recursive, which can impact performance. In such cases, it’s better to use a conditional directly. Refer to the following example:

@example
```
import type {If, IsEqual, StringRepeat} from 'type-fest';

type HundredZeroes = StringRepeat<'0', 100>;

// The following implementation is not tail recursive
type Includes<S extends string, Char extends string> =
	S extends `${infer First}${infer Rest}`
		? If<IsEqual<First, Char>,
			'found',
			Includes<Rest, Char>>
		: 'not found';

// Hence, instantiations with long strings will fail
// @ts-expect-error
type Fails = Includes<HundredZeroes, '1'>;
//           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Error: Type instantiation is excessively deep and possibly infinite.

// However, if we use a simple conditional instead of `If`, the implementation becomes tail-recursive
type IncludesWithoutIf<S extends string, Char extends string> =
	S extends `${infer First}${infer Rest}`
		? IsEqual<First, Char> extends true
			? 'found'
			: IncludesWithoutIf<Rest, Char>
		: 'not found';

// Now, instantiations with long strings will work
type Works = IncludesWithoutIf<HundredZeroes, '1'>;
//=> 'not found'
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSQGYBo6YDOAogI4CuAhgDb4DKMUwAdgOYBKKqlMAvnNigQQcAORJUAWmwpCMUQG4AUEoloAEuWYATKCm0AtFENlwAvHAZM2nbjAA8ogAyj8ARidOAfMqUB6PzgAFQALNGwIamoIAHcWVjhQMGoUEBRmGB5gCGZEwjhmCHhM4Go4PQBjcihCYAA3FFVkNExmCupybVl7OjgUAA8YdO18uWtWfABhEMooPsHh0cZ4r3MlAEhegaGdfIADABJ0Fhk5gDFgGr4jk+M4TjlePY31gH4CbHsiMipqewurlMZlAvLgXutRBEtNpXODWu1Ot0HjAgbMvF4XgAuMSFeBQnSKFQBODqdIVFD4FhySgZYBZHL5OIwEJwaJsOBjeKM0plbCUUr+QIAARghEkA1QFRg4qgQigTVQcDO-Oo+Qs8I6XUI9k0Oj0hmMEFk+FEblEPkFcCt1ptcAAfg7HU7nS7XXbLcRZdBsUFmolmNTafTcsB8gNyYRag1qIg4F0uHAado4JBI8AAEYx-3YFjAIYAOiJgXUsRQDSglOwcBiaHIhDQlA5SRScAqOW0eeyzBo-rkKEoyYgVb2OD2+GZaGbqXSmRgXbg6ZQbbS+RK1EklWqUcaagIbU1sgA6nmQhByDAcD15jsRhzlmxUXNtos7+NVmYNlsFrs4IdjsxTiVS5HhuAC7mRJ4Xneb4KBof5gJROBpjRa8X0YchGnWLD3khM8CXBbENURQhj2ZM8L0+ZFHwxLDsVEXEBDwmFfGJAA5WJKQDTIgznBlqxPVkcgSTk2G5KJq2gABrBU0EPKS1T3BEtVI09z0vXVdH0IwTEIE0zQtAIzFWeiikY6FRCAA)

@category Type Guard
@category Utilities
*/
export type If<Type extends boolean, IfBranch, ElseBranch> =
	IsNever<Type> extends true
		? ElseBranch
		: Type extends true
			? IfBranch
			: ElseBranch;

export {};

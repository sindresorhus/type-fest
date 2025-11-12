/**
Matches any uppercase letter in the basic Latin alphabet (A-Z).

@example
```
import type {UppercaseLetter} from 'type-fest';

const a: UppercaseLetter = 'A';  // Valid
// @ts-expect-error
const b: UppercaseLetter = 'a';  // Invalid
// @ts-expect-error
const c: UppercaseLetter = 'AB'; // Invalid
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gVTKqBjAQwGcUAZFGGFKAXzgDMoIQ4ByJVAWnpSJlYDcAKCF4IAOz5wCALjjZchEuUrU4AXjYBBQXDgB6fXABqBADbAAJkMNwAAjCKcUAD1R4YzqEyiiJUgCM5BWolMgoqKA02Al0DIwBJcQA3cysbIwcnV3dPah8-SXg8YJxQ4nDVKM1WLQAhXVsk1ItLIA)

@category Type
*/
export type UppercaseLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';

/**
Matches any lowercase letter in the basic Latin alphabet (a-z).

@example
```
import type {LowercaseLetter} from 'type-fest';

const a: LowercaseLetter = 'a'; // Valid
// @ts-expect-error
const b: LowercaseLetter = 'A'; // Invalid
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gGQgdxVAYwEMBnFTFGGfAXzgDMoIQ4ByJVAWnpRJlYDcAKCEEIAOz5wiALjjY8hUuUrUocALxsiguAHo9cAGpEANsAAmQg3AACMEpxQAPVARhOoTKKIlSARnIK+MRkFFT4mmwAgro2AJLiAG5mlkA)

@category Type
*/
export type LowercaseLetter = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z';

/**
Matches any digit as a string ('0'-'9').

@example
```
import type {DigitCharacter} from 'type-fest';

const a: DigitCharacter = '0'; // Valid
// @ts-expect-error
const b: DigitCharacter = 0;   // Invalid
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gEWAc2DAYQAsBDKEgYxhSgF84AzKCEOAciVQFoGUBnGGwDcAKBEUIAOwFwSALjjY8hUuSo04AXnYAGYXAD0BuADUSAG2AATEUbgABGHy4oAHqiouozKOKkyAIwUlfGIySmooLTgdITh4uwBJSQA3C2sgA)

@category Type
*/
export type DigitCharacter = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

/**
Matches any lowercase letter (a-z), uppercase letter (A-Z), or digit ('0'-'9') in the basic Latin alphabet.

@example
```
import type {Alphanumeric} from 'type-fest';

const a: Alphanumeric = 'A'; // Valid
// @ts-expect-error
const b: Alphanumeric = '#'; // Invalid
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gQQDZgBYCGAdgK4gpTADGAvnAGZQQhwDkSqAtPSgM4ysA3AChhVCEX5wCALjg58xMhWpwAvG0xC4Aeh1wAagWzAAJsL1wAAjF6cUAD1RUY9qEyhiJUgEZyFhKTklFTqbADE2pYAkkQAbsZmQA)

@category Type
*/
export type Alphanumeric = LowercaseLetter | UppercaseLetter | DigitCharacter;

export {};

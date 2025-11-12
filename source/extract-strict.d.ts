/**
A stricter version of {@link Extract<T, U>} that ensures every member of `U` can successfully extract something from `T`.

For example, `ExtractStrict<string | number | boolean, number | bigint>` will error because `bigint` cannot extract anything from `string | number | boolean`.

@example
```
// Valid Examples
import type {ExtractStrict} from "type-fest";

type Example1 = ExtractStrict<{status: 'success'; data: string[]} | {status: 'error'; error: string}, {status: 'success'}>;
//=> {status: 'success'; data: string[]}

type Example2 = ExtractStrict<'xs' | 's' | 'm' | 'l' | 'xl', 'xs' | 's'>;
//=> 'xs' | 's'

type Example3 = ExtractStrict<{x: number; y: number} | [number, number], unknown[]>;
//=> [number, number]
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/PTAEDUEMBsEsBNQFEAekC2AHaBTAzgFCxYD2ATgC6gUCemOoA3qhWZAMYUDKrsnAvqABmZEulAAiWvQC0Q-BQkBuAgWkNUGbDgCMoALzIUrDt16cAPIzwVIFAK54AXKADkee+3b48rpaHg7SBcbMlgAOwBzAG0AXUEAHyYbO0cXVxwyUTI-UEzskN4o-gAaZNsHZzcPLx9XfgA+FRB9BvLUqvdPbzxff0DbQrCouP5VdSMtXAAmAyMTTh4wy1cUX1Ak91cNt3Rtzeh9txRDstX1zd8mgha286Ot8boNNCxcAGY5ljZF8worFAucL2dAAI0y-hoQJB4LIiVA0WBYMyZSRsNiZXs4QA1uESAB3cJxa63BFolGgclkWJAA)

@example
```
// Invalid Examples
import type {ExtractStrict} from "type-fest";

// `'xxl'` cannot extract anything from `'xs' | 's' | 'm' | 'l' | 'xl'`
// @ts-expect-error
type Example1 = ExtractStrict<'xs' | 's' | 'm' | 'l' | 'xl', 'xl' | 'xxl'>;
//                                                           ~~~~~~~~~~~~
// Error: Type "'xl' | 'xxl'" does not satisfy the constraint 'never'.

// `unknown[]` cannot extract anything from `{x: number; y: number} | {x: string; y: string}`
// @ts-expect-error
type Example2 = ExtractStrict<{x: number; y: number} | {x: string; y: string}, unknown[]>;
//                                                                             ~~~~~~~~~
// Error: Type 'unknown[]' does not satisfy the constraint 'never'.
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/PTAEEkDsDcEMBsCWATUBRAHrAtgB3gKYDOAUIngPYBOALqDQJ64GgDemNVsAxjQMqdEvAL6gAZlQrZQAIkbMAtGOI0ZAbhIkQoAAYByDBnh6dobrEiQKdAhk486FhjQAWiSAHNxk6foxE9UAAfUD0A4NDsQJC9YwiDYx0tMAABGiIFW2ZeTKpJKhJ5FkwcfAIARlAAXnQ7Ll4BKiEaAB4DcJiOyOjQuJijPQAaUIH4w2MAPg1tUFm5+YXFpeWV1bmAP02t7c3k9DzqAC5QABUmFhkEnoMBmVBkCmJQKzoiWBpEIjEGehcWbgokCI9ncdD0kAI0AIVD0ADpNNodABXSAAaysAHdIABtAC6pnMlmsoFs9l4oCcrncXgkUl0rAwx0gSOwACNoWpQAwmSz2VRRCEGcdgU1PJzuaARdThEltGkMlkCDloflCudaqVCAAmaq1Mn8QS8FpC568jlcnls6ECtiMyWCMUW+2ijzCYYo9EULF4qZ7Nb+gOBoNrHbbPZoA5UY5nZihD2YnG4wIPJ4vSXvT7fX7-QEi2Cg0IQqEw2FAA)

@category Improved Built-in
*/
export type ExtractStrict<
	T,
	U extends [U] extends [
		// Ensure every member of `U` extracts something from `T`
		U extends unknown ? (Extract<T, U> extends never ? never : U) : never,
	]
		? unknown
		: never,
> = Extract<T, U>;

export {};

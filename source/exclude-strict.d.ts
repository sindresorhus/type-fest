/**
A stricter version of {@link Exclude<T, U>} that ensures every member of `U` can successfully exclude something from `T`.

For example, `ExcludeStrict<string | number | boolean, number | bigint>` will error because `bigint` cannot exclude anything from `string | number | boolean`.

@example
```
// Valid Examples
import type {ExcludeStrict} from 'type-fest';

type Example1 = ExcludeStrict<{status: 'success'; data: string[]} | {status: 'error'; error: string}, {status: 'success'}>;
//=> {status: 'error'; error: string}

type Example2 = ExcludeStrict<'xs' | 's' | 'm' | 'l' | 'xl', 'xs' | 's'>;
//=> 'm' | 'l' | 'xl'

type Example3 = ExcludeStrict<{x: number; y: number} | [number, number], unknown[]>;
//=> {x: number; y: number}
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/PTAEDUEMBsEsBNQFEAekC2AHaBTAzgFCxYD2ATgC6gUCemOoA3qgMbQCu8OAyhWbCwoBfUADMyJdKADktegFpR+CtIDcBAnIaoM2HAEZQAXmQo2nHnwEUAPIzwVIFdngBcMvOxYt8eNaHgnSHcHfgA7AHMAbQBdEQAfJgcnF3dpHDIJMn8MrJCrSKEAGiTHZzcPLx88PyEAPnUQIzrSlIr0zPIczrJ88IihDS1TXVwAJmNTcy5efkEbaRQ-UETpZdX0aRWZaC3VlF2SxfWPaQaCJpbpTe3pXduD6SG6bTQsXABmSdYOGat5xgodxhdjoABGGVUoBowNBELICVAURB4IyJRR8JiJXYYQA1mESAB3MKxc6XJhA0AYyHQ2GohFAA)

@example
```
// Invalid Examples
import type {ExcludeStrict} from 'type-fest';

// `'xxl'` cannot exclude anything from `'xs' | 's' | 'm' | 'l' | 'xl'`
// @ts-expect-error
type Example1 = ExcludeStrict<'xs' | 's' | 'm' | 'l' | 'xl', 'xl' | 'xxl'>;
//                                                           ~~~~~~~~~~~~
// Error: Type "'xl' | 'xxl'" does not satisfy the constraint 'never'.

// `unknown[]` cannot exclude anything from `{x: number; y: number} | {x: string; y: string}`
// @ts-expect-error
type Example2 = ExcludeStrict<{x: number; y: number} | {x: string; y: string}, unknown[]>;
//                                                                             ~~~~~~~~~
// Error: Type 'unknown[]' does not satisfy the constraint 'never'.
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/PTAEEkDsDcEMBsCWATUBRAHrAtgB3gKYDOAUIngPYBOALqDQJ64GgDemAxvAK7IEDKNKog40AvqABmVCtlAByRswC0k4jXkBuEiRCgABvIwZ48-aA6xIkCnQIYuvFlYY0AFokgBzKTLmGMInlQAB8FINCFbGCw+VNIo1N9XTAAARoiZXtmUSyqGSoSJRZMHHwCAEZQAF50Bx4+QWFRAB4jCNiOqJiFeNiTeQAaBQGE41MAPm09UFm5+YXFpeWV1bmAP02t7c2U9HzqAC5QABUmFgAiRJ6jAYvQZApiUBs6IlgaRCJJBno3Fg4FEgRCEsE8dHkkAI0AIVHkADodHp9NxIABrGwAd0gAG0ALrmSzWWygeyOPigFzuTw+aSyAysDDHSDcbAAI1hmlADGZrI5VAkYUZxxBwm8XJ5oFFNLEyT06Uy2QIuVhBSK5zqZUIACYanVyQIhCIaC1hS8+Zzubz2bDBWwmVKjeKrY6xV4xMNURiKNj8VM9mtA0HgyG1jttns0AcqMczswFF6sbi8cFHs9XlKPl8fn8AUDRWDIBCoTC4fCgA)

@category Improved Built-in
*/
export type ExcludeStrict<
	T,
	U extends [U] extends [
		// Ensure every member of `U` excludes something from `T`
		U extends unknown ? ([T] extends [Exclude<T, U>] ? never : U) : never,
	]
		? unknown
		: never,
> = Exclude<T, U>;

export {};

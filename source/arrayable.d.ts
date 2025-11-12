/**
Create a type that represents either the value or an array of the value.

@see {@link Promisable}

@example
```
import type {Arrayable} from 'type-fest';

function bundle(input: string, output: Arrayable<string>) {
	const outputList = Array.isArray(output) ? output : [output];

	// …

	for (const output of outputList) {
		console.log(`write ${input} to: ${output}`);
	}
}

bundle('src/index.js', 'dist/index.js');
bundle('src/index.js', ['dist/index.cjs', 'dist/index.mjs']);
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gQSlAho3AIwBsUBfOAMyghDgHIlUBaSlAZxnoG4AoXygFcAdgGMYwCMLiERAE1IAKYMLCCYALjicoKgOYAaOBHVrNcbHgIkUAHh36AfAEoMvAJCipnY6fUAZYB8AXgscfAA6IMt8RRMYM1cAfl8E9TgtAG14swBdPg8AekK4QDICfndKaDhFL2EfHPSISlSzQM5XdA9PbwhSCOIIPUUAAwB3XRg0ABJ0FTMKGAgtWcaYMhHnPncyXl3eWWEFFEV6dihRQpU5FAAPCIArdnojejkgmCuju8fnrYP5Eozhcvjd7k8XnBMm8PqCfqIIa93pw4fcQBDclsgA)

@category Array
*/
export type Arrayable<T> =
	T
// TODO: Use `readonly T[]` when this issue is resolved: https://github.com/microsoft/TypeScript/issues/17002
	| T[];

export {};

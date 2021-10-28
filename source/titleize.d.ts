import { StringDigit, UpperCaseCharacters } from "./utilities";
import { SplitIncludingDelimiters } from "./delimiter-case";
import { CamelCase } from "./camel-case";
import { Join } from "./join";

type TitleizeJoin<Parts extends readonly any[]> = Parts extends [
	`${infer FirstPart}`,
	`${infer SecondPart}`,
	...infer Rest
]
	? FirstPart extends StringDigit
		? `${Capitalize<FirstPart>}${Titleize<
				Join<
					[SecondPart, Rest extends string[] | number[] ? Join<Rest, ""> : ""],
					""
				>
		  >}`
		: `${Capitalize<FirstPart>} ${Titleize<
				Join<
					[SecondPart, Rest extends string[] | number[] ? Join<Rest, ""> : ""],
					""
				>
		  >}`
	: Parts extends [`${infer FirstPart}`, ...infer Rest]
	? `${Capitalize<FirstPart>}${Rest extends string
			? Rest
			: TitleizeJoin<Rest>}`
	: Parts extends [string | number]
	? Parts extends [string]
		? Capitalize<Parts[0]>
		: `${Parts[0]}`
	: "";

/**
Convert a string literal to Titleized Format.

__This is similar to "TitleCase", however does _not_ follow APA guidelines for title casing:__

- _typeOfAnimal -> Type Of Animal (Titleize)_
- _typeOfAnimal -> Type of Animal (Title Case)_

This can be useful when converting a camel-cased object property into Titleized format for data display within a table or page.

It is ideal to use Titleize when you want automated formatting of data for display with a utility function like below:

```ts
const titleize = (str: string) => str.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
```

@example
```ts
import {Titleize} from 'type-fest';

// Simple

const someVariable: Titleize<'fooBar'> = 'Foo Bar';

// Advanced

interface CustomObject {
	id: number;
	fooBar: string;
	prettyPrintMePlease: any;
}

type CustomObjectProps = keyof CustomObject;

interface CustomGridColDef extends GridColDef {
	field: CustomObjectProps;
	headerName: Titleize<CustomObjectProps>;
}

const columns: CustomGridColDef[] = [
	{ field: "id", headerName: "Id" },
	{ field: "name", headerName: "Name" },
	{ field: "prettyPrintMePlease", headerName: "Pretty Print Me Please" }
]

// Or a more automated approach
const apiObject: CustomObject = {
	id: 1,
	fooBar: "barBaz",
	prettyPrintMePlease: null
}

const columns = Object(apiObject).keys().map(key => ({ field: key, headerName: titleize(key) }));
```

@category Template Literals
*/
export type Titleize<K> = K extends string
	? TitleizeJoin<SplitIncludingDelimiters<CamelCase<K>, UpperCaseCharacters | StringDigit>>
	: K;

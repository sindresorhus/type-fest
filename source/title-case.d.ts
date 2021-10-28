import { StringDigit, UpperCaseCharacters } from "./utilities";
import { SplitIncludingDelimiters } from "./delimiter-case";
import { CamelCase } from "./camel-case";
import { Join } from "./join";

export type Conjunctions = "and" | "as" | "but" | "for" | "if" | "nor" | "or" | "so" | "yet";
export type Articles = "a" | "an" | "the";
export type ShortPrepositions = "as" | "at" | "by" | "for" | "in" | "of" | "off" | "on" | "per" | "to" | "up" | "via" | "is" | "ok";

export type ApaIgnoreUpperCase = Conjunctions | Articles | ShortPrepositions;

type ApaTitleCase<K, I extends ApaIgnoreUpperCase> = K extends string
	? Lowercase<K> extends I
		? Lowercase<K>
		: Capitalize<K>
	: K;

type TitleCaseJoin<Parts extends readonly any[], I extends ApaIgnoreUpperCase> = Parts extends [
	`${infer FirstPart}`,
	`${infer SecondPart}`,
	...infer Rest
]
	? FirstPart extends StringDigit
		? `${ApaTitleCase<FirstPart, I>}${TitleCase<
				Join<
					[SecondPart, Rest extends string[] | number[] ? Join<Rest, ""> : ""],
					""
				>
		  >}`
		: `${ApaTitleCase<FirstPart, I>} ${TitleCase<
				Join<
					[SecondPart, Rest extends string[] | number[] ? Join<Rest, ""> : ""],
					""
				>
		  >}`
	: Parts extends [`${infer FirstPart}`, ...infer Rest]
	? `${ApaTitleCase<FirstPart, I>}${Rest extends string
			? Rest
			: TitleCaseJoin<Rest, I>}`
	: Parts extends [string | number]
	? Parts extends [string]
		? Capitalize<Parts[0]>
		: `${Parts[0]}`
	: "";

/**
Convert a string literal to Title Case.

__This is similar to "Titleize", however does follow APA guidelines for title casing.__ 

- _typeOfAnimal -> Type Of Animal (Titleize)_
- _typeOfAnimal -> Type of Animal (Title Case)_

This can be useful when, for example, converting a camel-cased object property into Title Case for data display within a table or page.
see https://apastyle.apa.org/style-grammar-guidelines/capitalization/title-case for more information about when to use title case according to the APA.

@example
```
import {TitleCase} from 'type-fest';

// Simple

const someVariable: TitleCase<'fooBar'> = 'Foo Bar';

// Advanced

interface CustomObject {
	id: number;
	fooBar: string;
	thisIsASpecialProperty: any;
}

type CustomObjectProps = keyof CustomObject;

interface CustomGridColDef extends GridColDef {
  field: CustomObjectProps;
  headerName: TitleCase<CustomObjectProps>;
}

const columns: CustomGridColDef[] = [
  { field: "id", headerName: "Id" },
  { field: "name", headerName: "Name" },
  { field: "thisIsASpecialProperty", headerName: "This is a Special Property" }
]
```

@category Template Literals
*/
export type TitleCase<K, I extends ApaIgnoreUpperCase = ApaIgnoreUpperCase> = K extends string
	? TitleCaseJoin<
			SplitIncludingDelimiters<CamelCase<K>, UpperCaseCharacters | StringDigit>,
			I
	  >
	: K;

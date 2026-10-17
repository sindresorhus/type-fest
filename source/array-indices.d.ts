import type {ArrayValues} from './array-values.d.ts'; // For `@link`

/**
Provides valid indices for a constant array or tuple.

Use-case: This type is useful when working with constant arrays or tuples and you want to enforce type-safety for accessing elements by their indices.

@example
```
import type {ArrayIndices, ArrayValues} from 'type-fest';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

type Weekday = ArrayIndices<typeof weekdays>;
type WeekdayName = ArrayValues<typeof weekdays>;

const getWeekdayName = (day: Weekday): WeekdayName => weekdays[day];
```

@see {@link ArrayValues}

@category Array
*/
export type ArrayIndices<Element extends readonly unknown[]> =
	// `keyof` of a union is the intersection of the members' keys, so the union is distributed first to give every member's indices. An array of unknown length can be indexed with any number, while an array of known length can only be indexed with the positions it actually has. A tuple's keys are string literals, so they are turned back into numbers.
	Element extends unknown
		? number extends Element['length']
			? number
			: {
				[Key in Extract<keyof Element, `${number}`>]: Key extends `${infer Index extends number}` ? Index : never
			}[Extract<keyof Element, `${number}`>]
		: never;

export {};

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
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gQSlAhogSQDsATYAYxQGcAaObPRANVwBsBXagXzgDMoIIOAHIkqALS9qMYQG4AUPPIQiVeAHcUKANYl8VOAF44AbWEBZFXsTC6wgCqcq12yIDqKEkWou79gBbsUM74rsIAYlDAviIAyrgwQTHCseykoQC6cLgGyqowCvJiaB461kb0OPjEZJRUADzFELxwmmX6AHwKxXCluvgAcrggaMYM+Cwc1I3IKM2tWv2IVF2KeWpwAOYoMH3WQyMVABTWAFy9i9YAlOd7g8OjHQvtyybWGbJAA)

@see {@link ArrayValues}

@category Array
*/
export type ArrayIndices<Element extends readonly unknown[]> =
	Exclude<Partial<Element>['length'], Element['length']>;

export {};

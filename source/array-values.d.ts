/**
Provides all values for a constant array or tuple.

Use-case: This type is useful when working with constant arrays or tuples and you want to enforce type-safety with their values.

@example
```
import type {ArrayValues, ArrayIndices} from 'type-fest';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

type WeekdayName = ArrayValues<typeof weekdays>;
type Weekday = ArrayIndices<typeof weekdays>;

const getWeekdayName = (day: Weekday): WeekdayName => weekdays[day];
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gQSlAhogNVwBsBXFAZwBo5s9EBJAOwBNgBjSgXzgDMoIIOAHIkqALS9KMYQG4AUPPYQmFeAHcUKANYt8FOAF44AbWEBZFXsTCawgCrkK12yIDqKFk0ou79gBakUM74rsIAYlDAviIAyrgwQTHCsaSsoQC6cLgGyqowCvJiaB461gByuCBoxnT4RGSUADzFELxwmmX6AHwKxXCluvhGtDj4zGycFC3IKG0dWkOIFL2KeWpwAOYoMIMVVTVwABTWAFwDi9YAlOd7+JXVRt0LXcsm1hmyQA)

@see {@link ArrayIndices}

@category Array
*/
export type ArrayValues<T extends readonly unknown[]> = T[number];

export {};

/**
Provides valid indices for a constant array or tuple.

Use-case: This type is useful when working with constant arrays or tuples and you want to enforce type-safety for accessing elements by their indices.

@example
```
import type {ArrayIndices} from 'type-fest';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

type WeekDay = ArrayIndices<typeof weekDays>;

const getWeekDayName = (day: WeekDay): WeekDayName => weekDays[day];
```

@category Array
*/
export type ArrayIndices<Element extends readonly unknown[]> =
	Exclude<Partial<Element>['length'], Element['length']>;

/**
Extract the keys of an array or tuple.

Use-case: Deal with valid keys for a const array.

@example
```
import type {ArrayIndex} from 'type-fest';

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ] as const;

type WeekDay = ArrayIndex<typeof weekDays>;

const getWeekDayName = (day: WeekDay): WeekDayName => weekDays[day];
```

@category Array
*/
export type ArrayIndex<Element extends readonly unknown[]> =
	Exclude<Partial<Element>['length'], Element['length']>;

/**
Provides all values for a constant array or tuple.

Use-case: This type is useful when working with constant arrays or tuples and you want to enforce type-safety with their values.

@example
```
import type {ArrayValues, ArrayIndices} from 'type-fest';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

type WeekDayName = ArrayValues<typeof weekdays>;
type WeekDay = ArrayIndices<typeof weekdays>;

const getWeekDayName = (day: WeekDay): WeekDayName => weekdays[day];

```

@see {@link ArrayIndices}

@category Array
*/
export type ArrayValues<T extends readonly unknown[]> = T[number];

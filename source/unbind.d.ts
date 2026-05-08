import type {ExclusifyUnion} from './exclusify-union.d.ts';

/**
Collapse a union into a single object type by merging all members.

Each property becomes:
- A union of all possible values across the union members
- Optional if it does not exist in every member

This removes the relationships between union members, producing
a loose object shape where properties are independent.

@example
```
import type {Unbind} from 'type-fest';

type Success = {
	kind: 'success';
	data: string;
};

type Failure = {
	kind: 'error';
	error: Error;
};

type Result = Unbind<Success | Failure>;
// {
// 	kind: 'success' | 'error';
// 	data?: string;
// 	error?: Error;
// }
```

@category Object
@category Union
*/
export type Unbind<Union> = Omit<ExclusifyUnion<Union>, never>;

export {};

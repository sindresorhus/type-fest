import {expectType} from 'tsd';
import type {GroupBy} from '../source/group-by.d.ts';

type Apple = {
	color: 'green';
	kind: 'fruit';
};

type Banana = {
	color: 'yellow';
	kind: 'fruit';
};

type Tomato = {
	color: 'red';
	kind: 'vegetable';
};

// Grouping a single type
declare const singleType: GroupBy<Apple, 'color'>;
expectType<{green: Apple}>(singleType);

// Grouping discriminated unions
declare const groupedByColor: GroupBy<Apple | Banana | Tomato, 'color'>;
expectType<{
	green: Apple;
	yellow: Banana;
	red: Tomato;
}>(groupedByColor);

declare const groupedByKind: GroupBy<Apple | Banana | Tomato, 'kind'>;
expectType<{
	fruit: Apple | Banana;
	vegetable: Tomato;
}>(groupedByKind);

// Grouping a key that is a union
type WithUnionKey = {
	type: 'a' | 'b';
	value: number;
};

declare const groupedByUnionKey: GroupBy<WithUnionKey, 'type'>;
expectType<{
	a: WithUnionKey;
	b: WithUnionKey;
}>(groupedByUnionKey);

// Test with numeric keys
type WithNumberKey = {id: 1 | 2; name: string};

declare const groupedByNumberKey: GroupBy<WithNumberKey, 'id'>;
expectType<{
	1: WithNumberKey;
	2: WithNumberKey;
}>(groupedByNumberKey);

// Edge cases with any, never, unknown
expectType<GroupBy<any, never>>({} as Record<string, any>);
expectType<GroupBy<never, never>>({} as {});
expectType<GroupBy<unknown, never>>({} as {});

// @ts-expect-error key that doesn't exist
type NonExistentKey = GroupBy<{id: number}, 'nonexistent'>;

// @ts-expect-error key with non-PropertyKey value
type InvalidKey = GroupBy<{data: object}, 'data'>;

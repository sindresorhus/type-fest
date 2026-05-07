import { expectType } from "tsd";
import type { GroupBy } from "../source/group-by.d.ts";

type Apple = {
	color: "green";
	kind: "fruit";
};

type Banana = {
	color: "yellow";
	kind: "fruit";
};

type Tomato = {
	color: "red";
	kind: "vegetable";
};

// Grouping a single type
expectType<GroupBy<Apple, "color">>({
	green: {} as Apple,
});

// Grouping discriminated unions
expectType<GroupBy<Apple | Banana | Tomato, "color">>({
	green: {} as Apple,
	yellow: {} as Banana,
	red: {} as Tomato,
});

expectType<GroupBy<Apple | Banana | Tomato, "kind">>({
	fruit: {} as Apple | Banana,
	vegetable: {} as Tomato,
});

// Grouping a key that is a union
type WithUnionKey = {
	type: "a" | "b";
	value: number;
};

expectType<GroupBy<WithUnionKey, "type">>({
	a: {} as WithUnionKey,
	b: {} as WithUnionKey,
});

// Test with numeric keys
type WithNumberKey = { id: 1 | 2; name: string };

expectType<GroupBy<WithNumberKey, "id">>({
	1: {} as WithNumberKey,
	2: {} as WithNumberKey,
});

// Edge cases with any, never, unknown
expectType<GroupBy<any, never>>({} as {});
expectType<GroupBy<never, never>>({} as {});
expectType<GroupBy<unknown, never>>({} as {});

// @ts-expect-error key that doesn't exist
type NonExistentKey = GroupBy<{ id: number }, "nonexistent">;

// @ts-expect-error key with non-PropertyKey value
type InvalidKey = GroupBy<{ data: object }, "data">;

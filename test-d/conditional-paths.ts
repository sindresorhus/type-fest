import {expectAssignable, expectNotAssignable, expectType} from 'tsd';
import type {ConditionalPaths, Paths} from '../index.d.ts';

// Basic flat object — filter by value type.
type User = {
	id: number;
	name: string;
	email: string;
	age: number;
	isActive: boolean;
};

expectType<'name' | 'email'>({} as ConditionalPaths<User, string>);
expectType<'id' | 'age'>({} as ConditionalPaths<User, number>);
expectType<'isActive'>({} as ConditionalPaths<User, boolean>);
expectType<never>({} as ConditionalPaths<User, bigint>);

// Nested objects.
type Post = {
	id: number;
	title: string;
	author: {
		id: number;
		name: string;
		email: string;
	};
	metadata: {
		views: number;
		likes: number;
	};
};
expectType<'title' | 'author.name' | 'author.email'>({} as ConditionalPaths<Post, string>);
expectType<'id' | 'author.id' | 'metadata.views' | 'metadata.likes'>({} as ConditionalPaths<Post, number>);

// Intermediate object-typed paths are included when the condition matches them.
expectType<'author' | 'metadata'>({} as ConditionalPaths<Post, object>);

// `Condition = any` keeps every path, like `Paths`.
expectType<Paths<Post>>({} as ConditionalPaths<Post, any>);
expectType<Paths<User>>({} as ConditionalPaths<User, any>);

// `Condition = unknown` also keeps every path.
expectType<Paths<User>>({} as ConditionalPaths<User, unknown>);

// `Condition = never` matches nothing.
expectType<never>({} as ConditionalPaths<User, never>);

// Arrays and tuples.
type Data = {
	tags: string[];
	scores: [number, number, number];
	items: Array<{name: string; count: number}>;
};

expectType<`tags.${number}` | `items.${number}.name`>({} as ConditionalPaths<Data, string>);
expectType<'scores.0' | 'scores.1' | 'scores.2' | `items.${number}.count`>({} as ConditionalPaths<Data, number>);

// Optional fields count as their base type (`string | undefined` → `string` after `Required`).
expectType<'name'>({} as ConditionalPaths<{name?: string; age: number}, string>);

// Nullable fields are NOT treated as their base type: `string | null` ≠ `string`.
expectType<'b'>({} as ConditionalPaths<{a: string | null; b: string}, string>);

// Null-typed fields do not match non-null conditions.
expectType<never>({} as ConditionalPaths<{a: null; b: string}, number>);

// Null conditions work correctly and distinguish null from undefined.
expectType<'a'>({} as ConditionalPaths<{a: null; b: string}, null>);
expectType<'a'>({} as ConditionalPaths<{a: null; b: undefined}, null>);

// Union-typed values are compared non-distributively (like `ConditionalKeys`).
expectType<never>({} as ConditionalPaths<{a: string | number}, string>);
expectType<'a'>({} as ConditionalPaths<{a: string | number}, string | number>);

// Union root types distribute — each member is checked independently.
expectType<'a'>({} as ConditionalPaths<{a: string} | {b: number}, string>);

// Number keys yield both numeric and string forms, like `Paths`.
expectType<1 | '1'>({} as ConditionalPaths<Record<1, string>, string>);

// `condition: 'equality'` requires an exact value-type match.
type Mixed = {
	a: string;
	b: string | number;
};
expectType<'a'>({} as ConditionalPaths<Mixed, string>);
expectType<'a' | 'b'>({} as ConditionalPaths<Mixed, string | number>);
expectType<'b'>({} as ConditionalPaths<Mixed, string | number, {condition: 'equality'}>);
expectType<'a'>({} as ConditionalPaths<Mixed, string, {condition: 'equality'}>);

// `condition: 'equality'` works with object-shaped conditions.
expectType<'author'>({} as ConditionalPaths<Post, {id: number; name: string; email: string}, {condition: 'equality'}>);

// Enums are treated as their underlying primitive type (recursion does not descend into them).
enum NumericEnum {
	A,
	B,
}

enum StringEnum {
	X = 'x',
	Y = 'y',
}

type WithEnums = {
	num: NumericEnum;
	str: StringEnum;
	plain: string;
	count: number;
};

// A string enum matches `string`; a numeric enum matches `number`.
expectType<'str' | 'plain'>({} as ConditionalPaths<WithEnums, string>);
expectType<'num' | 'count'>({} as ConditionalPaths<WithEnums, number>);

// Filtering by the enum type itself.
expectType<'str'>({} as ConditionalPaths<WithEnums, StringEnum>);
// Under `extends`, a numeric enum and `number` are mutually assignable, so a plain `number`-valued path matches too.
expectType<'num' | 'count'>({} as ConditionalPaths<WithEnums, NumericEnum>);

// `condition: 'equality'` distinguishes a numeric enum from plain `number`.
expectType<'num'>({} as ConditionalPaths<WithEnums, NumericEnum, {condition: 'equality'}>);
expectType<'count'>({} as ConditionalPaths<WithEnums, number, {condition: 'equality'}>);

// Enums nested inside objects.
expectType<'theme.primary'>(
	{} as ConditionalPaths<{theme: {primary: NumericEnum; label: StringEnum}}, NumericEnum>,
);

// Options pass through to `Paths`.
type Product = {
	name: string;
	prices: [number, number];
	variants: Array<{color: string}>;
};
expectType<'prices[0]' | 'prices[1]'>({} as ConditionalPaths<Product, number, {bracketNotation: true}>);
expectType<'name' | `variants[${number}].color`>({} as ConditionalPaths<Product, string, {bracketNotation: true}>);

type Company = {
	name: string;
	ceo: {
		name: string;
		contact: {
			email: string;
			phone: string;
		};
	};
};
expectType<'name'>({} as ConditionalPaths<Company, string, {depth: 0}>);
expectType<'ceo.name'>({} as ConditionalPaths<Company, string, {depth: 1}>);
expectType<'ceo.contact.email' | 'ceo.contact.phone'>({} as ConditionalPaths<Company, string, {depth: 2}>);

// With `bracketNotation`, numeric/index keys become `[n]` while string keys keep dots.
expectType<'label' | `tags[${number}]`>({} as ConditionalPaths<{label: string; tags: string[]}, string, {bracketNotation: true}>);
// String-only key paths are unaffected — `[n]` syntax only applies to numeric keys.
expectType<'name' | 'ceo.name' | 'ceo.contact.email' | 'ceo.contact.phone'>({} as ConditionalPaths<Company, string, {bracketNotation: true}>);

// `maxRecursionDepth` caps traversal depth — paths deeper than the cap are not emitted.
type Deep = {a: {b: string; c: {d: string}}};
expectType<'a.b'>({} as ConditionalPaths<Deep, string, {maxRecursionDepth: 1}>);

// Edge cases: `any`, `never`, `unknown` as field VALUE types.
// `any`- and `never`-typed fields vacuously match every `extends`-mode condition
// because `[any] extends [C]` and `[never] extends [C]` are both `true` in the
// non-distributive tuple form (known limitation).
expectType<'data' | 'name'>({} as ConditionalPaths<{data: any; name: string}, string>);
expectType<'data' | 'name'>({} as ConditionalPaths<{data: never; name: string}, string>);
// `unknown`-typed fields only match conditions that `unknown` satisfies.
expectType<'name'>({} as ConditionalPaths<{data: unknown; name: string}, string>);
expectType<'data' | 'name'>({} as ConditionalPaths<{data: unknown; name: string}, unknown>);

// Edge cases for the base type.
expectType<never>({} as ConditionalPaths<any, string>);
expectType<never>({} as ConditionalPaths<never, string>);
expectType<never>({} as ConditionalPaths<unknown, string>);
expectType<never>({} as ConditionalPaths<{}, string>);
expectType<never>({} as ConditionalPaths<[], string>);

// Assignability sanity checks.
declare function open<Path extends ConditionalPaths<Post, string>>(path: Path): void;
expectAssignable<Parameters<typeof open>[0]>('title');
expectAssignable<Parameters<typeof open>[0]>('author.name');
expectNotAssignable<Parameters<typeof open>[0]>('id');
expectNotAssignable<Parameters<typeof open>[0]>('metadata');

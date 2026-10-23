import {expectTypeOf} from 'nz';
import type {RequiredNonNullable, Tagged} from '../index.d.ts';

// =================
// Objects
// =================

// Removes the optional modifier and `null` and `undefined` from every value type.
expectTypeOf<RequiredNonNullable<{a?: string | null; b: number | undefined}>>().toBe<{a: string; b: number}>();
expectTypeOf<RequiredNonNullable<{a: string | null; b?: number}>>().toBe<{a: string; b: number}>();
expectTypeOf<RequiredNonNullable<{a: string | undefined}>>().toBe<{a: string}>();
expectTypeOf<RequiredNonNullable<{a?: string | undefined}>>().toBe<{a: string}>();

// `any` is kept, and `unknown` becomes `{}`, the same as with the built-in `NonNullable`.
expectTypeOf<RequiredNonNullable<{a?: any}>>().toBe<{a: any}>();
expectTypeOf<RequiredNonNullable<{a?: unknown}>>().toBe<{a: {}}>();

// A value that is only `null` or only `undefined` becomes `never`.
expectTypeOf<RequiredNonNullable<{a?: null}>>().toBe<{a: never}>();
expectTypeOf<RequiredNonNullable<{a?: undefined}>>().toBe<{a: never}>();
expectTypeOf<RequiredNonNullable<{a: null | undefined}>>().toBe<{a: never}>();
expectTypeOf<RequiredNonNullable<{a?: never}>>().toBe<{a: never}>();

// A key that is already required and non-nullable is kept as is.
expectTypeOf<RequiredNonNullable<{a: string; b: number}>>().toBe<{a: string; b: number}>();

// The same as the built-in `Required` when there is no `null` or `undefined` to remove.
expectTypeOf<RequiredNonNullable<{a?: string; b: number}>>().toBe<Required<{a?: string; b: number}>>();

// A nested value keeps its nullability and its optional keys.
expectTypeOf<RequiredNonNullable<{a?: {b?: string | null}}>>().toBe<{a: {b?: string | null}}>();

// Recursive types work.
type Tree = {
	value?: number | null;
	children?: Tree[] | null;
};
expectTypeOf<RequiredNonNullable<Tree>>().toBe<{value: number; children: Tree[]}>();

// =================
// Modifiers and special keys
// =================

// Keeps the `readonly` modifier.
expectTypeOf<RequiredNonNullable<{readonly a?: string | null}>>().toBe<{readonly a: string}>();
declare const readonlyValue: RequiredNonNullable<{readonly a?: string | null}>;
// @ts-expect-error - The `readonly` modifier is kept.
readonlyValue.a = 'unicorn';

// Works with a numeric key on an object.
expectTypeOf<RequiredNonNullable<{0?: string | null; 1: number}>>().toBe<{0: string; 1: number}>();

// Works with a symbol key.
expectTypeOf<RequiredNonNullable<{[Symbol.iterator]?: () => Iterator<number>}>>().toBe<{[Symbol.iterator]: () => Iterator<number>}>();

// An index signature is kept, and its value type loses `null` and `undefined`.
expectTypeOf<RequiredNonNullable<{[key: string]: string | null}>>().toBe<{[key: string]: string}>();
expectTypeOf<RequiredNonNullable<Record<string, number | undefined>>>().toBe<Record<string, number>>();

// =================
// Arrays and tuples
// =================

// An optional tuple element becomes a required element.
expectTypeOf<RequiredNonNullable<[string | null, number?]>>().toBe<[string, number]>();
expectTypeOf<RequiredNonNullable<[x: number | null, y?: string]>>().toBe<[number, string]>();
expectTypeOf<RequiredNonNullable<[string?, number?]>>().toBe<[string, number]>();

// An optional element that is only nullish becomes `never`, so the tuple cannot be built.
expectTypeOf<RequiredNonNullable<[string, null?]>>().toBe<[string, never]>();

// Keeps `readonly` on a tuple and on an array.
expectTypeOf<RequiredNonNullable<readonly [string | null]>>().toBe<readonly [string]>();
expectTypeOf<RequiredNonNullable<ReadonlyArray<string | null>>>().toBe<readonly string[]>();

// An array loses `null` and `undefined` from its element type.
expectTypeOf<RequiredNonNullable<Array<string | null>>>().toBe<string[]>();

// A rest element is kept, and its element type loses `null` and `undefined`.
expectTypeOf<RequiredNonNullable<[string, number?, ...Array<boolean | null>]>>().toBe<[string, number, ...boolean[]]>();
expectTypeOf<RequiredNonNullable<[...Array<string | null>, number | undefined]>>().toBe<[...string[], number]>();

// An optional element before a rest element becomes a required element.
expectTypeOf<RequiredNonNullable<[string?, ...number[]]>>().toBe<[string, ...number[]]>();

// An empty tuple is kept as is.
expectTypeOf<RequiredNonNullable<[]>>().toBe<[]>();

// Distributes over a union of tuples.
expectTypeOf<RequiredNonNullable<[string | null] | [number | undefined]>>().toBe<[string] | [number]>();

// Distributes over a union of objects.
expectTypeOf<RequiredNonNullable<{a?: string | null} | {b?: number}>>().toBe<{a: string} | {b: number}>();

// Distributes over a union that mixes a tuple and an object.
expectTypeOf<RequiredNonNullable<[string | null] | {a?: number | null}>>().toBe<[string] | {a: number}>();

// The elements are readable without `undefined`.
declare const point: RequiredNonNullable<[x: number | null, y?: string | null]>;
const [x, y] = point;
expectTypeOf(x).toBe<number>();
expectTypeOf(y).toBe<string>();

// =================
// Special types
// =================

// `any`, `never`, and `unknown` give the same result as with the built-in `Required`.
expectTypeOf<RequiredNonNullable<any>>().toBe<{[x: string]: any}>();
expectTypeOf<RequiredNonNullable<never>>().toBe<never>();
expectTypeOf<RequiredNonNullable<unknown>>().toBe<{}>();

// A primitive is kept as is, the same as with the built-in `Required`.
expectTypeOf<RequiredNonNullable<string>>().toBe<string>();
expectTypeOf<RequiredNonNullable<null>>().toBe<null>();
expectTypeOf<RequiredNonNullable<undefined>>().toBe<undefined>();

// A function type has no keys, so it becomes an empty object type, the same as with the built-in `Required`.
expectTypeOf<RequiredNonNullable<() => void>>().toBe<{}>();

// =================
// Values
// =================

type Point = [x: number | null, y?: number];

// A complete tuple is accepted.
const completePoint: RequiredNonNullable<Point> = [1, 2];

// @ts-expect-error - An element cannot be `null`.
const nullPoint: RequiredNonNullable<Point> = [null, 2];

// @ts-expect-error - An optional element cannot be left out.
const shortPoint: RequiredNonNullable<Point> = [1];

// The original type has an optional and a nullish element, so it is not assignable.
expectTypeOf<Point>().not.toBeAssignableTo<RequiredNonNullable<Point>>();

// The result is assignable to the original type.
expectTypeOf<RequiredNonNullable<Point>>().toBeAssignableTo<Point>();

type Options = {
	name?: string | null;
	verbose?: boolean;
};

// @ts-expect-error - An optional key cannot be left out.
const missingName: RequiredNonNullable<Options> = {verbose: true};

// @ts-expect-error - A key cannot be `null`.
const nullName: RequiredNonNullable<Options> = {name: null, verbose: true};

const options: RequiredNonNullable<Options> = {
	name: 'unicorn',
	verbose: false,
};

const {name} = options;
expectTypeOf(name).toBe<string>();

expectTypeOf<RequiredNonNullable<Options>>().toBeAssignableTo<Options>();

// =================
// Known limitations
// =================

// A class loses its private members, because `keyof` leaves them out, so the result is not assignable to the class.
class Service {
	private readonly secret: string;
	name?: string | null;

	constructor(secret: string) {
		this.secret = secret;
	}

	getSecret(): string {
		return this.secret;
	}
}
declare const service: RequiredNonNullable<Service>;
expectTypeOf(service.name).toBe<string>();
expectTypeOf(service).not.toBeAssignableTo<Service>();

// An intersection with the class keeps the private members.
declare const completeService: Service & RequiredNonNullable<Service>;
expectTypeOf(completeService.name).toBe<string>();
expectTypeOf(completeService).toBeAssignableTo<Service>();

// An array with extra members does not keep its array type. The value under the `number` key loses `null`, but the array methods keep the original element type.
type Augmented = Array<string | null> & {tag: boolean};
declare const augmented: RequiredNonNullable<Augmented>;
expectTypeOf<RequiredNonNullable<Augmented>[number]>().toBe<string>();
expectTypeOf(augmented.tag).toBe<boolean>();
expectTypeOf(augmented.pop).returns.toBe<string | null | undefined>();

// A `Tagged` tuple has the same limitation.
type TaggedTuple = Tagged<[string | null], 'Tuple'>;
declare const taggedTuple: RequiredNonNullable<TaggedTuple>;
expectTypeOf(taggedTuple[0]).toBe<string>();
expectTypeOf(taggedTuple.pop).returns.toBe<string | null | undefined>();

import {expectTypeOf} from 'nz';
import type {IterableElement} from '../index.d.ts';

declare const iterableElement: IterableElement<ReturnType<typeof secretGenerator>>;
expectTypeOf(iterableElement).toBe<number | string>();

declare const iterableElementAsync: IterableElement<ReturnType<typeof secretGeneratorAsync>>;
expectTypeOf(iterableElementAsync).toBe<boolean | Date>();

function * secretGenerator() {
	yield 1;
	yield 'two';
}

async function * secretGeneratorAsync() {
	yield true;
	yield new Date();
}

const fruits = new Set(['🍎', '🍌', '🍉'] as const);

type Fruit = IterableElement<typeof fruits>;

expectTypeOf<'🍎'>().toBeAssignableTo<Fruit>();
expectTypeOf<'🍌'>().toBeAssignableTo<Fruit>();
expectTypeOf<'🍉'>().toBeAssignableTo<Fruit>();

type VegetableSet = Set<'🥦' | '🥕' | '🌶'>;
type Vegetable = IterableElement<VegetableSet>;

expectTypeOf<'🥦'>().toBeAssignableTo<Vegetable>();
expectTypeOf<'🥕'>().toBeAssignableTo<Vegetable>();
expectTypeOf<'🌶'>().toBeAssignableTo<Vegetable>();

type UserRolesSet = ReadonlySet<'regular' | 'contributor' | 'maintainer'>;
type UserRole = IterableElement<UserRolesSet>;

expectTypeOf<'regular'>().toBeAssignableTo<UserRole>();
expectTypeOf<'contributor'>().toBeAssignableTo<UserRole>();
expectTypeOf<'maintainer'>().toBeAssignableTo<UserRole>();

// Tuple positions and map entries retain their element types.
expectTypeOf<IterableElement<readonly ['first', 2]>>().toBe<'first' | 2>();
expectTypeOf<IterableElement<readonly []>>().toBe<never>();
expectTypeOf<IterableElement<ReadonlyMap<'id', number>>>().toBe<['id', number]>();
expectTypeOf<IterableElement<Map<string, boolean>>>().toBe<[string, boolean]>();
expectTypeOf<IterableElement<string>>().toBe<string>();

// A generator's return and next-input types are separate from its yielded values.
expectTypeOf<IterableElement<Generator<'item', number, boolean>>>().toBe<'item'>();
expectTypeOf<IterableElement<AsyncGenerator<'item', number, boolean>>>().toBe<'item'>();
expectTypeOf<IterableElement<Iterable<Promise<string>>>>().toBe<Promise<string>>();
expectTypeOf<IterableElement<AsyncIterable<Promise<string>>>>().toBe<Promise<string>>();

// Each union member contributes its elements; non-iterable members contribute nothing.
expectTypeOf<IterableElement<ReadonlySet<'cached'> | AsyncIterable<'remote'>>>().toBe<'cached' | 'remote'>();
expectTypeOf<IterableElement<readonly number[] | null | undefined>>().toBe<number>();
expectTypeOf<IterableElement<Iterator<string>>>().toBe<never>();
expectTypeOf<IterableElement<unknown>>().toBe<never>();
expectTypeOf<IterableElement<never>>().toBe<never>();
expectTypeOf<IterableElement<any>>().toBe<unknown>();

import {expectType} from 'tsd';
import type {Filter} from '../source/filter.d.ts';

// Basic loose filtering
expectType<Filter<[1, 2, 3, 3, 4], 3, true>>([3, 3]);
expectType<Filter<[1, '2', 3, 'foo', false], number>>([1, 3]);
expectType<Filter<[1, '2', 3, 'foo', false], string>>(['2', 'foo']);
expectType<Filter<[1, '2', 3, 'foo', false], string | number>>([1, '2', 3, 'foo']);
expectType<Filter<['foo', 'baz', 'foo', 'foo'], 'foo', true>>(['foo', 'foo', 'foo']);
expectType<Filter<[1, '2', 3, 'foo', false], string | number, true>>([1, '2', 3, 'foo']);
expectType<Filter<['1', '2', 3, 4, 'foo'], `${number}`>>(['1', '2']);
expectType<Filter<[true, false, true, 0, 1], boolean>>([true, false, true]);
expectType<Filter<[true, false, true, 0, 1], true>>([true, true]);

// Filtering Boolean (keep truthy values)
expectType<Filter<[true, false, boolean, 0, 1], Boolean>>([true, 1]);
expectType<Filter<[true, false, boolean, 0, 1], Boolean, true>>([true, 1]);
expectType<Filter<[0, '', false, null, undefined, 'ok', 42], Boolean>>(['ok', 42]);
expectType<Filter<[true, false, 0, 1, '', 'text', null, undefined], Boolean>>([true, 1, 'text']);

// Filtering objects
type Object1 = {a: number};
type Object2 = {b: string};
expectType<Filter<[Object1, Object2, Object1 & Object2], Object1>>({} as [Object1, Object1 & Object2]);
expectType<Filter<[Object1, Object2, Object1 & Object2], Object1, true>>({} as [Object1, Object1 & Object2]);

// Loose filtering by boolean or number
expectType<Filter<[true, 0, 1, false, 'no'], boolean | number>>([true, 0, 1, false]);

// Filtering array containing null | undefined | string
expectType<Filter<[null, undefined, 'foo', ''], string>>(['foo', '']);

// Filtering with unknown type (should keep everything)
expectType<Filter<[1, 'a', true], unknown>>([1, 'a', true]);

// Filtering with any type (should keep everything)
expectType<Filter<[1, 'a', true], any>>([1, 'a', true]);

// Filtering with never type (should remove everything)
expectType<Filter<[1, 2, 3], never>>([]);
// ? Shoud we change this behavior ?

// Filtering array of arrays by array type
expectType<Filter<[[number], string[], number[]], number[]>>([[1], [2, 3]]);

// Filtering by a union including literal and broader type
expectType<Filter<[1, 2, 3, 'foo', 'bar'], 1 | string>>([1, 'foo', 'bar']);

// Filtering complex nested union types
type Nested = {x: string} | {y: number} | null;
expectType<Filter<[ {x: 'a'}, {y: 2}, null, {z: true} ], Nested>>([{x: 'a'}, {y: 2}, null]);

// Filtering with boolean type but array has no boolean values
expectType<Filter<[1, 2, 3], Boolean>>([1, 2, 3]);

// Filtering with boolean type but array has falsy values
expectType<Filter<[0, '', false, null, undefined], Boolean>>([]);

// Filtering string literals with template literal union
expectType<Filter<['foo1', 'bar2', 'foo3'], `foo${number}`>>(['foo1', 'foo3']);

// Filtering with `Boolean` type but including custom objects with truthy/falsy behavior
class Foo {}
expectType<Filter<[typeof Foo, {}, null, undefined], Boolean>>([Foo, {}]);

// Filtering with strict = true and union including literals and primitives
expectType<Filter<[1, '1', 2, '2', true, false], number | `${number}`, true>>([1, '1', 2, '2']);

// Filtering falsy values mixed with ({} | [] is truthy)
expectType<Filter<[false, 0, '', null, undefined, {}, []], Boolean>>([{}, []]);

// Filtering with `true` literal (strict) but array contains boolean and number
expectType<Filter<[true, false, 1, 0], true, true>>([true]);

// Filtering empty string literal type with strict mode
expectType<Filter<['', 'non-empty'], '', true>>(['']);

// Filtering with loose mode for literal union type and matching subset
expectType<Filter<[1, 2, 3, 4, 5], 2 | 3>>([2, 3]);

// Filtering tuples with mixed optional and required elements
type Tuple = [string, number?, boolean?];
expectType<Filter<Tuple, number>>({} as [number?]);
expectType<Filter<Tuple, string | boolean>>({} as [string, boolean?]);

// Rest elements
expectType<Filter<['f', ...string[], 's'], string>>({} as ['f', ...string[], 's']);
expectType<Filter<['f', ...string[], 's'], 'f' | 's'>>({} as ['f', 's']);
expectType<Filter<[string, ...string[]], string>>({} as [string, ...string[]]);
expectType<Filter<[string, ...string[], number], string>>({} as [string, ...string[]]);

// Rest and Optional
expectType<Filter<[true, number?, ...string[]], string>>({} as string[]);
expectType<Filter<[true, number?, ...string[]], number | string>>({} as [number?, ...string[]]);
expectType<Filter<[string?, ...string[]], number | string>>({} as [string?, ...string[]]);

// Union
expectType<Filter<[1, '2', 3, false] | ['1', 2, '3', true], number>>({} as [1, 3] | [2]);
expectType<Filter<[1, '2', 3, false] | ['1', 2, '3', true], string>>({} as ['2'] | ['1', '3']);
expectType<Filter<[true, number?, ...string[]] | [false?, ...Array<'foo'>], string>>({} as string[] | Array<'foo'>);
expectType<Filter<[true, number?, ...string[]] | [false?, ...Array<'foo'>], number>>({} as [number?]);

// Edge cases
expectType<Filter<any, any>>({} as []);
expectType<Filter<any, never>>([]);
expectType<Filter<any[], any>>({} as []);
expectType<Filter<any[], never>>({} as any[]);
expectType<Filter<never, any>>({} as never);
expectType<Filter<never, never>>({} as never);

expectType<Filter<[], number>>([]);
expectType<Filter<[never, never], number>>([]);
expectType<Filter<[never, never], never>>([]);
expectType<Filter<[never, never], never>>([]);
expectType<Filter<[never, never], never, true>>({} as [never, never]);

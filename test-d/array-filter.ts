import {expectType} from 'tsd';
import type {ArrayFilter} from '../source/array-filter.d.ts';

// Basic loose filtering
expectType<ArrayFilter<[1, '2', 3, 'foo', false], number>>([1, 3]);
expectType<ArrayFilter<[1, '2', 3, 'foo', false], string>>(['2', 'foo']);

// Filtering Boolean (keep truthy values)
expectType<ArrayFilter<[true, false, boolean, 0, 1], Boolean>>([true, 1]);
expectType<ArrayFilter<[true, false, boolean, 0, 1], Boolean, true>>([true, 1]);
expectType<ArrayFilter<[0, '', false, null, undefined, 'ok', 42], Boolean>>(['ok', 42]);
expectType<ArrayFilter<[true, false, 0, 1, '', 'text', null, undefined], Boolean>>([true, 1, 'text']);

// Strict filtering by literals
expectType<ArrayFilter<[1, 2, 3, 3, 4], 3, true>>([3, 3]);
expectType<ArrayFilter<[1, '2', 3, 'foo', false], string | number>>([1, '2', 3, 'foo']);
expectType<ArrayFilter<['foo', 'baz', 'foo', 'foo'], 'foo', true>>(['foo', 'foo', 'foo']);
expectType<ArrayFilter<[1, '2', 3, 'foo', false], string | number, true>>([1, '2', 3, 'foo']);

expectType<ArrayFilter<['1', '2', 3, 4, 'foo'], `${number}`>>(['1', '2']);
expectType<ArrayFilter<[true, false, true, 0, 1], boolean>>([true, false, true]);
expectType<ArrayFilter<[true, false, true, 0, 1], true>>([true, true]);

// Filtering union with objects
type Object1 = {a: number};
type Object2 = {b: string};
expectType<ArrayFilter<[Object1, Object2, Object1 & Object2], Object1>>([{a: 1}, {a: 1, b: 'b'}]);
expectType<ArrayFilter<[Object1, Object2, Object1 & Object2], Object1, true>>([{a: 1}, {a: 1, b: 'b'}]);

// Loose filtering by boolean or number
expectType<ArrayFilter<[true, 0, 1, false, 'no'], boolean | number>>([true, 0, 1, false]);

// Filtering array containing null | undefined | string
expectType<ArrayFilter<[null, undefined, 'foo', ''], string>>(['foo', '']);

// Filtering with unknown type (should keep everything)
expectType<ArrayFilter<[1, 'a', true], unknown>>([1, 'a', true]);

// Filtering with any type (should keep everything)
expectType<ArrayFilter<[1, 'a', true], any>>([1, 'a', true]);

// Filtering with never type (should remove everything)
expectType<ArrayFilter<[1, 2, 3], never>>([]);
// ? Shoud we change this behavior ?

// Filtering array of arrays by array type
expectType<ArrayFilter<[[number], string[], number[]], number[]>>([[1], [2, 3]]);

// Filtering by a union including literal and broader type
expectType<ArrayFilter<[1, 2, 3, 'foo', 'bar'], 1 | string>>([1, 'foo', 'bar']);

// Filtering complex nested union types
type Nested = {x: string} | {y: number} | null;
expectType<ArrayFilter<[ {x: 'a'}, {y: 2}, null, {z: true} ], Nested>>([{x: 'a'}, {y: 2}, null]);

// Filtering with boolean type but array has no boolean values
expectType<ArrayFilter<[1, 2, 3], Boolean>>([1, 2, 3]);

// Filtering with boolean type but array has falsy values
expectType<ArrayFilter<[0, '', false, null, undefined], Boolean>>([]);

// Filtering string literals with template literal union
expectType<ArrayFilter<['foo1', 'bar2', 'foo3'], `foo${number}`>>(['foo1', 'foo3']);

// Filtering with `Boolean` type but including custom objects with truthy/falsy behavior
class Foo {}
expectType<ArrayFilter<[typeof Foo, {}, null, undefined], Boolean>>([Foo, {}]);

// Filtering with strict = true and union including literals and primitives
expectType<ArrayFilter<[1, '1', 2, '2', true, false], number | `${number}`, true>>([1, '1', 2, '2']);

// Filtering falsy values mixed with ({} | [] is truthy)
expectType<ArrayFilter<[false, 0, '', null, undefined, {}, []], Boolean>>([{}, []]);

// Filtering with `true` literal (strict) but array contains boolean and number
expectType<ArrayFilter<[true, false, 1, 0], true, true>>([true]);

// Filtering empty string literal type with strict mode
expectType<ArrayFilter<['', 'non-empty'], '', true>>(['']);

// Filtering with loose mode for literal union type and matching subset
expectType<ArrayFilter<[1, 2, 3, 4, 5], 2 | 3>>([2, 3]);

// Filtering tuples with mixed optional and required elements
type Tuple = [string, number?, boolean?];
expectType<ArrayFilter<Tuple, number>>({} as [number?]);
expectType<ArrayFilter<Tuple, string | boolean>>({} as [string, boolean?]);

// Rest elements
expectType<ArrayFilter<['f', ...string[], 's'], string>>({} as ['f', ...string[], 's']);
expectType<ArrayFilter<['f', ...string[], 's'], 'f' | 's'>>({} as ['f', 's']);
expectType<ArrayFilter<[string, ...string[]], string>>({} as [string, ...string[]]);
expectType<ArrayFilter<[string, ...string[], number], string>>({} as [string, ...string[]]);

// Rest and Optional
expectType<ArrayFilter<[true, number?, ...string[]], string>>({} as string[]);
expectType<ArrayFilter<[true, number?, ...string[]], number | string>>({} as [number?, ...string[]]);
expectType<ArrayFilter<[string?, ...string[]], number | string>>({} as [string?, ...string[]]);

// Union
expectType<ArrayFilter<[1, '2', 3, false] | ['1', 2, '3', true], number>>({} as [1, 3] | [2]);
expectType<ArrayFilter<[1, '2', 3, false] | ['1', 2, '3', true], string>>({} as ['2'] | ['1', '3']);
expectType<ArrayFilter<[true, number?, ...string[]] | [false?, ...Array<'foo'>], string>>({} as string[] | Array<'foo'>);
expectType<ArrayFilter<[true, number?, ...string[]] | [false?, ...Array<'foo'>], number>>({} as [number?]);

// Edge cases
expectType<ArrayFilter<any, any>>({} as []);
expectType<ArrayFilter<any, never>>([]);
expectType<ArrayFilter<any[], any>>({} as []);
expectType<ArrayFilter<any[], never>>({} as any[]);
expectType<ArrayFilter<never, any>>({} as never);
expectType<ArrayFilter<never, never>>({} as never);

expectType<ArrayFilter<[], number>>([]);
expectType<ArrayFilter<[never, never], number>>([]);
expectType<ArrayFilter<[never, never], never>>([]);
expectType<ArrayFilter<[never, never], never>>([]);
expectType<ArrayFilter<[never, never], never, true>>({} as [never, never]);

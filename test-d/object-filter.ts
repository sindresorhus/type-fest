import {expectType} from 'tsd';
import type {ObjectFilter} from '../source/object-filter.d.ts';

// Loose filtering
expectType<ObjectFilter<{a: 1; b: 2; c: 3 | 4; d: 3; e: 4}, 3>>({} as {c: 3 | 4; d: 3});
expectType<ObjectFilter<{a: 1; b: '2'; c: 3; d: 'foo'; e: boolean}, number>>({a: 1, c: 3});
expectType<ObjectFilter<{a: 1; b: '2'; c: 3 | 'bar'; d: 'foo'; e: false}, string>>({} as {b: '2'; c: 3 | 'bar'; d: 'foo'});
expectType<ObjectFilter<{a: 1; b: '2'; c: 3; d: 'foo'; e: false}, string | number>>({a: 1, b: '2', c: 3, d: 'foo'});
expectType<ObjectFilter<{a: 'foo'; b: 'baz'; c: 'foo'; d: 'foo' | 'bar'}, 'foo'>>({} as {a: 'foo'; c: 'foo'; d: 'foo' | 'bar'});
expectType<ObjectFilter<{a: '1'; b: '2'; c: 3; d: 4; e: 'foo'}, `${number}`>>({a: '1', b: '2'});
expectType<ObjectFilter<{a: true; b: false; c: boolean | 'bar'; d: 0; e: 1}, boolean>>({} as {a: true; b: false; c: boolean | 'bar'});
expectType<ObjectFilter<{a: true; b: false; c: true; d: 0; e: 1}, true>>({a: true, c: true});

// Strict filtering
expectType<ObjectFilter<{a: 1; b: 2; c: 3 | 4; d: 3; e: 4}, 3, {strict: true}>>({d: 3});
expectType<ObjectFilter<{a: 1; b: '2'; c: 3; d: 'foo'; e: boolean}, number, {strict: true}>>({a: 1, c: 3});
expectType<ObjectFilter<{a: 1; b: '2'; c: 3 | 'bar'; d: 'foo'; e: false}, string, {strict: true}>>({b: '2', d: 'foo'});
expectType<ObjectFilter<{a: 1; b: '2'; c: 3; d: 'foo'; e: false}, string | number, {strict: true}>>({a: 1, b: '2', c: 3, d: 'foo'});
expectType<ObjectFilter<{a: 'foo'; b: 'baz'; c: 'foo'; d: 'foo' | 'bar'}, 'foo', {strict: true}>>({} as {a: 'foo'; c: 'foo'});
expectType<ObjectFilter<{a: '1'; b: '2'; c: 3; d: 4; e: 'foo'}, `${number}`, {strict: true}>>({a: '1', b: '2'});
expectType<ObjectFilter<{a: true; b: false; c: boolean | 'bar'; d: 0; e: 1}, boolean, {strict: true}>>({} as {a: true; b: false});
expectType<ObjectFilter<{a: true; b: false; c: true; d: 0; e: 1}, true, {strict: true}>>({a: true, c: true});

// Index signatures
expectType<ObjectFilter<{[a: string]: number | string; b: 1}, 1 | string>>({} as {[x: string]: string | number; b: 1});
expectType<ObjectFilter<{[a: string]: number | string; b: 1}, 1 | string, {strict: true}>>({} as {b: 1});
expectType<ObjectFilter<{[a: string]: number; [b: symbol]: string}, string>>({} as {[b: symbol]: string});
expectType<ObjectFilter<{[a: string]: number; [b: symbol]: string; c: 5}, number>>({} as {[a: string]: number; c: 5});

// Optional elements
expectType<ObjectFilter<{a?: 'f'; b: 's'; c: undefined}, undefined>>({} as {a?: 'f'; c: undefined});
expectType<ObjectFilter<{a?: 'f'; b: 's'; c: undefined}, undefined, {strict: true}>>({c: undefined});
expectType<ObjectFilter<{a?: 'f'; b: 's'; c: 5}, string>>({} as {a?: 'f'; b: 's'});
expectType<ObjectFilter<{a?: 'f'; b: 's'; c: 5}, string, {strict: true}>>({} as {b: 's'});

// Filtering Boolean (keep truthy values)
expectType<ObjectFilter<{a: true; b: false; c: boolean; d: 0; e: 1}, Boolean>>({a: true, e: 1});
expectType<ObjectFilter<{a: true; b: false; c: boolean; d: 0; e: 1}, Boolean, {strict: true}>>({a: true, e: 1});
expectType<ObjectFilter<{a: 0; b: ''; c: false; d: null; e: undefined; f: 'ok'; g: 42}, Boolean>>({f: 'ok', g: 42});
expectType<ObjectFilter<{a: true; b: false; c: 0; d: 1; e: ''; f: 'text'; g: null; h: undefined}, Boolean>>({a: true, d: 1, f: 'text'});

// Filtering objects
type Object1 = {a: number};
type Object2 = {b: string};
expectType<ObjectFilter<{a: Object1; b: Object2; c: Object1 & Object2}, Object1>>({} as {a: Object1; c: Object1 & Object2});
expectType<ObjectFilter<{a: Object1; b: Object2; c: Object1 & Object2}, Object1, {strict: true}>>({} as {a: Object1; c: Object1 & Object2});

// Loose filtering by boolean or number
expectType<ObjectFilter<{a: true; b: 0; c: 1; d: false; e: 'no'}, boolean | number>>({a: true, b: 0, c: 1, d: false});

// Filtering object containing null | undefined | string
expectType<ObjectFilter<{a: null; b: undefined; c: 'foo'; d: ''}, string>>({c: 'foo', d: ''});

// Filtering with unknown type (should keep everything)
expectType<ObjectFilter<{a: 1; b: 'a'; c: true}, unknown>>({a: 1, b: 'a', c: true});

// Filtering with any type (should keep everything)
expectType<ObjectFilter<{a: 1; b: 'a'; c: true}, any>>({a: 1, b: 'a', c: true});

// Filtering with never type (should remove everything)
expectType<ObjectFilter<{a: 1; b: 2; c: 3}, never>>({});

// Filtering object of arrays by array type
expectType<ObjectFilter<{a: number[]; b: string[]; c: number[]}, number[]>>({a: [1], c: [2, 3]});

// Filtering by a union including literal and broader type
expectType<ObjectFilter<{a: 1; b: 2; c: 3; d: 'foo'; e: 'bar'}, 1 | string>>({a: 1, d: 'foo', e: 'bar'});

// Filtering complex nested union types
type Nested = {x: string} | {y: number} | null;
expectType<ObjectFilter<{a: {x: 'a'}; b: {y: 2}; c: null; d: {z: true}}, Nested>>({a: {x: 'a'}, b: {y: 2}, c: null});

// Filtering with boolean type but object has no boolean values
expectType<ObjectFilter<{a: 1; b: 2; c: 3}, Boolean>>({a: 1, b: 2, c: 3});

// Filtering with boolean type but object has falsy values
expectType<ObjectFilter<{a: 0; b: ''; c: false; d: null; e: undefined}, Boolean>>({});

// Filtering string literals with template literal union
expectType<ObjectFilter<{a: 'foo1'; b: 'bar2'; c: 'fooo'; d: 'foo3'}, `foo${number}`>>({a: 'foo1', d: 'foo3'});

// Filtering with `Boolean` type but including custom objects with truthy/falsy behavior
class Foo {}
expectType<ObjectFilter<{a: typeof Foo; b: {}; c: null; d: undefined}, Boolean>>({a: Foo, b: {}});

// Filtering with strict = true and union including literals and primitives
expectType<ObjectFilter<{a: 1; b: '1'; c: 2; d: '2'; e: true; f: false}, number | `${number}`, {strict: true}>>({a: 1, b: '1', c: 2, d: '2'});

// Filtering falsy values mixed with truthy objects
expectType<ObjectFilter<{a: false; b: 0; c: ''; d: null; e: undefined; f: {}; g: []}, Boolean>>({f: {}, g: []});

// Filtering with `true` literal (strict) but object contains boolean and number
expectType<ObjectFilter<{a: true; b: false; c: 1; d: 0}, true, {strict: true}>>({a: true});

// Filtering empty string literal type with strict mode
expectType<ObjectFilter<{a: ''; b: 'non-empty'}, '', {strict: true}>>({a: ''});

// Filtering with loose mode for literal union type and matching subset
expectType<ObjectFilter<{a: 1; b: 2; c: 3; d: 4; e: 5}, 2 | 3>>({b: 2, c: 3});

// Union
expectType<ObjectFilter<{a: 1; b: '2'; c: 3; d: false} | {b1: '1'; b2: 2; b3: '3'; b4: true}, number>>({} as {a: 1; c: 3} | {b2: 2});
expectType<ObjectFilter<{a: 1; b: '2'; c: 3; d: false} | {b1: '1'; b2: 2; b3: '3'; b4: true}, string>>({} as {b: '2'} | {b1: '1'; b3: '3'});

// Edge cases
expectType<ObjectFilter<any, never>>({});
expectType<ObjectFilter<never, any>>({} as never);
expectType<ObjectFilter<never, never>>({} as never);

expectType<ObjectFilter<{}, number>>({});
expectType<ObjectFilter<{a: never; b: never}, number>>({});
expectType<ObjectFilter<{a: never; b: never}, never>>({});
expectType<ObjectFilter<{a: never; b: never}, never, {strict: true}>>({} as {a: never; b: never});
